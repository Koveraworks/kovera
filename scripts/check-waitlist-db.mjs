// Checks that section 6 of supabase/schema.sql and the migrations in
// supabase/migrations/ are in force, by talking to the database the same way a
// visitor's browser (or a script with the public key) can.
//
//   node scripts/check-waitlist-db.mjs               the standard checks
//   node scripts/check-waitlist-db.mjs --limit=6     also test the rate limit
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
// The standard checks save 5 rows from this address, so the limit must be above that.
if (limitArg && !(Number.isInteger(limit) && limit >= 6)) {
  console.error('--limit needs a whole number of 6 or more, matching private.intake_config.per_ip_per_hour.');
  process.exit(2);
}

const TEST = 'TEST delete me';
const PHONE = '98765 43210';
// What the new short forms send (src/lib/supabase.js). (Haryana, Panipat) is in
// private.districts; Panipat is not in Punjab.
const BUSINESS = { business_name: TEST, contact_name: TEST, phone_number: PHONE, shop_type: 'cafe', state: 'Haryana', city: 'Panipat', area: 'Test area' };
const WORKER = { full_name: TEST, phone_number: PHONE, state: 'Haryana', city: 'Panipat', area: null };
// What the old forms on main send, which must keep working until the new
// frontend is deployed.
const OLD_BUSINESS = { business_name: TEST, contact_name: TEST, phone_number: PHONE, work_location: 'Test area, Test city', support_need: null };
const OLD_WORKER = { full_name: TEST, phone_number: PHONE, locality: 'Test area, Test city', experience: null, availability: 'Weekends' };

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
  return { status: response.status, text };
}

// The site sends one row in an array and names its columns, as supabase-js does.
async function insert(table, row, headers) {
  const columns = Object.keys(row).map((name) => `"${name}"`).join(',');
  const result = await call(`/${table}?columns=${encodeURIComponent(columns)}`, { method: 'POST', body: [row], headers });
  if (result.status === 201) accepted += 1;
  return result;
}

async function expectSaved(label, table, row) {
  const { status, text } = await insert(table, row);
  report(status === 201, label, `HTTP ${status}${status === 201 ? '' : ` ${text.slice(0, 200)}`}`);
}

// Not allowed by the column grants: PostgREST answers 401 or 403.
async function expectDenied(label, table, row) {
  const { status, text } = await insert(table, row);
  const ok = [401, 403].includes(status);
  report(ok, label, `HTTP ${status}${ok ? '' : ` ${text.slice(0, 200)}`}`);
}

// Refused by the guard trigger: HTTP 400 carrying its KOVERA_INTAKE code, so a
// 400 for some other reason (an unknown column, say) does not count as a pass.
async function expectRefused(label, table, row) {
  const { status, text } = await insert(table, row);
  const ok = status === 400 && text.includes('KOVERA_INTAKE');
  report(ok, label, `HTTP ${status}${ok ? '' : ` ${text.slice(0, 200)}`}`);
}

const keepalive = await call('/rpc/keepalive', { method: 'POST', body: {} });
report(keepalive.status === 200 && keepalive.text.trim() === 'true', 'keepalive() answers', `HTTP ${keepalive.status}`);

for (const table of ['business_registrations', 'worker_registrations']) {
  const read = await call(`/${table}?select=*&limit=1`);
  const hidden = read.status >= 400 || read.text.trim() === '[]';
  report(hidden, `visitors cannot read ${table}`, `HTTP ${read.status}`);
}
for (const view of ['business_latest', 'worker_latest', 'districts']) {
  const direct = await call(`/${view}?limit=1`);
  const viaProfile = await call(`/${view}?limit=1`, { headers: { 'Accept-Profile': 'private' } });
  report(direct.status >= 400 && viaProfile.status >= 400, `visitors cannot read private.${view}`, `HTTP ${direct.status}, ${viaProfile.status}`);
}

// New forms.
await expectSaved('a new-form business row is saved', 'business_registrations', BUSINESS);
await expectSaved('a new-form worker row (no area) is saved', 'worker_registrations', WORKER);
await expectSaved('a new-form worker row with an area is saved', 'worker_registrations', { ...WORKER, area: 'Samalkha' });

// Old forms on main, until the new frontend is live.
await expectSaved('an old-form business row is saved', 'business_registrations', OLD_BUSINESS);
await expectSaved('an old-form worker row is saved', 'worker_registrations', OLD_WORKER);

// Columns visitors may not set.
await expectDenied('a visitor cannot set status', 'business_registrations', { ...BUSINESS, status: 'approved' });
await expectDenied('a visitor cannot set created_at', 'worker_registrations', { ...WORKER, created_at: '2020-01-01T00:00:00Z' });
await expectDenied('a visitor cannot set id', 'worker_registrations', { ...WORKER, id: '00000000-0000-4000-8000-000000000000' });
{
  // Email is no longer granted. Where the column exists this is a 401/403;
  // where it does not (the live project), PostgREST answers 400.
  const { status } = await insert('worker_registrations', { ...WORKER, email: 'test@example.com' });
  report(status >= 400 && status < 500, 'a visitor cannot set email', `HTTP ${status}`);
}

// Location and shop type.
await expectRefused('an unknown city is refused', 'business_registrations', { ...BUSINESS, city: 'Atlantis' });
await expectRefused('a city from another state is refused', 'worker_registrations', { ...WORKER, state: 'Punjab' });
await expectRefused('a state without a city is refused', 'worker_registrations', { ...WORKER, city: null });
await expectRefused('a city without a state is refused', 'business_registrations', { ...BUSINESS, state: null });
await expectRefused('an unknown shop type is refused', 'business_registrations', { ...BUSINESS, shop_type: 'casino' });
await expectRefused('a new-form business row without a shop type is refused', 'business_registrations', { ...BUSINESS, shop_type: null });
await expectRefused('an over-long area is refused', 'worker_registrations', { ...WORKER, area: 'x'.repeat(121) });
await expectRefused('a worker row with neither locality nor city is refused', 'worker_registrations', { ...WORKER, state: null, city: null, area: 'Samalkha' });

// Phone, names and lengths, both shapes.
await expectRefused('a bad phone number is refused', 'business_registrations', { ...BUSINESS, phone_number: '12345 67890' });
await expectRefused('a bad phone number on the old form is refused', 'worker_registrations', { ...OLD_WORKER, phone_number: '12345 67890' });
await expectRefused('a missing phone number is refused', 'worker_registrations', { ...WORKER, phone_number: null });
await expectRefused('a blank required name is refused', 'business_registrations', { ...BUSINESS, business_name: '   ' });
await expectRefused('an over-long old-form field is refused', 'business_registrations', { ...OLD_BUSINESS, support_need: 'x'.repeat(1001) });
await expectRefused('an over-long old-form worker field is refused', 'worker_registrations', { ...OLD_WORKER, experience: 'x'.repeat(501) });

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
