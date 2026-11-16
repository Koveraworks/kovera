// Checks that section 6 of supabase/schema.sql is in force, by talking to the
// database the same way a visitor's browser (or a script with the public key) can.
//
//   node scripts/check-waitlist-db.mjs               the standard checks
//   node scripts/check-waitlist-db.mjs --limit=3     also test the rate limit
//
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the environment or .env.
// Point it at a scratch project, not the live one: it saves a few rows named
// "TEST delete me", which only you can remove (in Supabase Studio).
//
// For --limit=N, first run this in the SQL Editor (it sets the limit to N and
// forgets earlier test inserts, which would otherwise be counted):
//   update private.intake_config set per_ip_per_hour = N;
//   delete from private.intake_log;
// and put the limit back to 30 afterwards.

try {
  process.loadEnvFile('.env');
} catch {
  // No .env file: the variables must already be in the environment.
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
// A plain PostgREST server has no /rest/v1 prefix; this lets the checks run against one.
// Nothing in front of it reports a visitor address, so WAITLIST_TEST_IP supplies one.
const rest = process.env.WAITLIST_REST_URL || (url ? `${url.replace(/\/+$/, '')}/rest/v1` : null);
const localAddress = process.env.WAITLIST_REST_URL && process.env.WAITLIST_TEST_IP
  ? { 'X-Forwarded-For': process.env.WAITLIST_TEST_IP }
  : {};
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : null;

if (!rest || (!key && !process.env.WAITLIST_REST_URL)) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (in .env or the environment) first.');
  process.exit(2);
}
if (limitArg && !(Number.isInteger(limit) && limit >= 3)) {
  console.error('--limit needs a whole number of 3 or more, matching private.intake_config.per_ip_per_hour.');
  process.exit(2);
}

const TEST = 'TEST delete me';
const BUSINESS = { business_name: TEST, contact_name: TEST, phone_number: '98765 43210', work_location: 'Test area, Test city', support_need: null };
const WORKER = { full_name: TEST, phone_number: '98765 43210', locality: 'Test area, Test city', experience: null, availability: 'Weekends' };

let failures = 0;
let warnings = 0;
let accepted = 0;

function report(ok, label, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
}

async function call(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${rest}${path}`, {
    method,
    headers: {
      ...(key ? { apikey: key, Authorization: `Bearer ${key}` } : {}),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...localAddress,
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  return { status: response.status, text: text.slice(0, 200) };
}

// The site sends one row in an array and names its columns, as supabase-js does.
async function insert(table, row, headers) {
  const columns = Object.keys(row).map((name) => `"${name}"`).join(',');
  const result = await call(`/${table}?columns=${encodeURIComponent(columns)}`, { method: 'POST', body: [row], headers });
  if (result.status === 201) accepted += 1;
  return result;
}

async function expectRejected(label, table, row, wanted) {
  const { status, text } = await insert(table, row);
  report(wanted.includes(status), label, `HTTP ${status}${wanted.includes(status) ? '' : ` ${text}`}`);
}

const keepalive = await call('/rpc/keepalive', { method: 'POST', body: {} });
report(keepalive.status === 200 && keepalive.text.trim() === 'true', 'keepalive() answers', `HTTP ${keepalive.status}`);

for (const table of ['business_registrations', 'worker_registrations']) {
  const read = await call(`/${table}?select=*&limit=1`);
  const hidden = read.status >= 400 || read.text.trim() === '[]';
  report(hidden, `visitors cannot read ${table}`, `HTTP ${read.status}`);
}
for (const view of ['business_latest', 'worker_latest']) {
  const direct = await call(`/${view}?limit=1`);
  const viaProfile = await call(`/${view}?limit=1`, { headers: { 'Accept-Profile': 'private' } });
  report(direct.status >= 400 && viaProfile.status >= 400, `visitors cannot read the team view ${view}`, `HTTP ${direct.status}, ${viaProfile.status}`);
}

const business = await insert('business_registrations', BUSINESS);
report(business.status === 201, 'a valid business row is saved', `HTTP ${business.status} ${business.status === 201 ? '' : business.text}`.trim());
const worker = await insert('worker_registrations', WORKER);
report(worker.status === 201, 'a valid worker row is saved', `HTTP ${worker.status} ${worker.status === 201 ? '' : worker.text}`.trim());

const denied = [401, 403];
await expectRejected('a visitor cannot set status', 'business_registrations', { ...BUSINESS, status: 'approved' }, denied);
await expectRejected('a visitor cannot set created_at', 'worker_registrations', { ...WORKER, created_at: '2020-01-01T00:00:00Z' }, denied);
await expectRejected('a visitor cannot set id', 'worker_registrations', { ...WORKER, id: '00000000-0000-4000-8000-000000000000' }, denied);
await expectRejected('a bad phone number is refused', 'business_registrations', { ...BUSINESS, phone_number: '12345 67890' }, [400]);
await expectRejected('a missing phone number is refused', 'worker_registrations', { ...WORKER, phone_number: null }, [400]);
await expectRejected('a blank required name is refused', 'business_registrations', { ...BUSINESS, business_name: '   ' }, [400]);
await expectRejected('an over-long field is refused', 'business_registrations', { ...BUSINESS, support_need: 'x'.repeat(1001) }, [400]);
await expectRejected('an over-long worker field is refused', 'worker_registrations', { ...WORKER, experience: 'x'.repeat(501) }, [400]);

if (limit !== null) {
  // Every row counts, so one request cannot carry more rows than the limit allows.
  const bulk = await call('/worker_registrations', { method: 'POST', body: Array.from({ length: limit }, () => WORKER) });
  report(bulk.status === 429, `one request with ${limit} rows is refused as a whole`, `HTTP ${bulk.status}`);

  // Fill up to the limit, then the next one from this address must be refused.
  let last = { status: 201 };
  while (accepted < limit && last.status === 201) last = await insert('worker_registrations', WORKER);
  const over = await insert('worker_registrations', WORKER);
  const tripped = accepted === limit && over.status === 429;
  report(tripped, `the per-IP limit stops insert number ${limit + 1}`, `${accepted} saved, then HTTP ${over.status}`);
  if (!tripped) {
    console.log('      Was the pre-step run (limit set to the same number, intake_log emptied)? If so, look at the');
    console.log('      ip column of private.intake_log: if it is empty, the database is not told visitor addresses');
    console.log('      and only the total limit is in effect.');
  }

  // The limit trusts the address the network reports. If a made-up header gets a
  // row through, a script can dodge the per-IP limit and only the total limit holds.
  for (const header of ['X-Forwarded-For', 'CF-Connecting-IP']) {
    const forged = await insert('worker_registrations', WORKER, { [header]: `203.0.113.${1 + Math.floor(Math.random() * 250)}` });
    if (forged.status === 201) {
      warnings += 1;
      console.log(`WARN  a made-up ${header} header gets past the per-IP limit (only the total limit protects you)`);
    } else {
      console.log(`PASS  a made-up ${header} header does not get past the per-IP limit  (HTTP ${forged.status})`);
    }
  }
}

console.log('');
console.log(`${failures} failed, ${warnings} warning${warnings === 1 ? '' : 's'}. ${accepted} "${TEST}" row${accepted === 1 ? '' : 's'} saved: delete them in Supabase Studio.`);
if (limit !== null) console.log('Put the limit back: update private.intake_config set per_ip_per_hour = 30;  Then look at the ip column of private.intake_log: it should hold your own address.');
process.exit(failures ? 1 : 0);
