import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { Button, Card, Choice, Segmented } from '../ui.jsx';
import { fmt, getStrings, useStrings } from '../i18n/index.js';
import { whatsappUrl } from '../lib/contact.js';
import { cx } from '../lib/cx.js';
import { EMAIL_MAX_LENGTH, isValidEmail, normalizeEmail } from '../lib/email.js';
import { caretAfterDigits, digitsBefore, formatPhone, isValidIndianMobile } from '../lib/phone.js';
import { submitBusinessRegistration, submitWorkerRegistration } from '../lib/supabase.js';

const EMPTY = {
  business: { businessName: '', contactName: '', phone: '', email: '', city: '', state: '', locality: '', supportNeed: '' },
  worker: { fullName: '', phone: '', email: '', city: '', state: '', locality: '', experience: '', availability: [] },
};

const REQUIRED = {
  business: ['businessName', 'contactName', 'phone', 'city'],
  worker: ['fullName', 'phone', 'city'],
};

// Every field that can fail validation, in the order it appears in the form:
// focus goes to the first one that failed. Email is optional, but is checked
// when something is typed.
const CHECKED = {
  business: ['businessName', 'contactName', 'phone', 'email', 'city'],
  worker: ['fullName', 'phone', 'email', 'city'],
};

// Not required to submit, but not labelled "optional" either: the team wants
// them filled in whenever the visitor knows them.
const UNLABELLED = ['state', 'locality'];

// The database refuses longer text (supabase/schema.sql, section 6). Its caps
// are higher than these, because what is saved also carries the picked
// category in front and joins area, city and state into one field.
const MAX_LENGTH = {
  businessName: 100,
  contactName: 60,
  fullName: 60,
  city: 60,
  state: 60,
  locality: 100,
  supportNeed: 800,
  experience: 300,
  email: EMAIL_MAX_LENGTH,
};

const AVAILABILITY_KEYS = ['weekdayMornings', 'weekdayAfternoons', 'weekends'];

// What is saved is always English, whichever language the visitor reads in,
// so the team's sheet stays sortable.
const SAVED_COMMON = getStrings('common', 'en');
const SAVED_WAITLIST = getStrings('waitlist', 'en');

function isInvalid(field, value) {
  if (field === 'phone') return !isValidIndianMobile(value);
  // Empty is fine for email; anything typed has to be a full address.
  if (field === 'email') return Boolean(String(value).trim()) && !isValidEmail(value);
  return !String(value).trim();
}

function savedContext(side, context) {
  if (!context?.category || context.side !== side) return null;
  const parts = [SAVED_COMMON.categories[context.category]];
  if (side === 'business' && context.hours) parts.push(`${context.hours} hours`);
  return `[${parts.join(' · ')}]`;
}

function joinParts(parts, separator) {
  return parts.map((part) => (part ?? '').trim()).filter(Boolean).join(separator) || null;
}

const INPUT_BASE = 'w-full min-h-12 rounded-xl border bg-white px-4 py-3 text-base text-ink transition-colors';

function Field({ id, label, optionalText, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optionalText && <span className="font-normal text-body"> ({optionalText})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-body">{hint}</p>}
    </div>
  );
}

export default function Waitlist({ side, onSideChange, context, onClearContext, headingRef, joinCount }) {
  const s = useStrings('waitlist');
  const c = useStrings('common');

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({ business: {}, worker: {} });
  // Which side is sending / failed to send, so one form's state never shows on the other.
  const [submittingSide, setSubmittingSide] = useState(null);
  const [failedSide, setFailedSide] = useState(null);
  const [done, setDone] = useState(null);
  const doneRef = useRef(null);
  const formHeadingRef = useRef(null);
  const returnToForm = useRef(false);

  // After a successful submit, move focus to the confirmation so it is announced.
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  // "Add another response" removes the button that had focus: hand focus to the form.
  useEffect(() => {
    if (!done && returnToForm.current) {
      returnToForm.current = false;
      formHeadingRef.current?.focus();
    }
  }, [done]);

  const submitting = submittingSide === side;
  const failed = failedSide === side;

  const form = side ? values[side] : null;
  const formErrors = side ? errors[side] : {};

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
    if (formErrors[field]) {
      setErrors((prev) => ({ ...prev, [side]: { ...prev[side], [field]: false } }));
    }
    if (failed) setFailedSide(null);
  };

  // Check a required field as soon as the visitor leaves it with something typed.
  const checkOnBlur = (field) => {
    if (form[field] && isInvalid(field, form[field])) {
      setErrors((prev) => ({ ...prev, [side]: { ...prev[side], [field]: true } }));
    }
  };

  const toggleAvailability = (key) => {
    const current = values.worker.availability;
    setField('availability', current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    for (const field of CHECKED[side]) {
      if (isInvalid(field, form[field])) found[field] = true;
    }
    setErrors((prev) => ({ ...prev, [side]: found }));
    const firstInvalid = CHECKED[side].find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`${side}-${firstInvalid}`)?.focus();
      return;
    }

    const sentSide = side;
    setSubmittingSide(sentSide);
    setFailedSide(null);
    try {
      const place = joinParts([form.locality, form.city, form.state], ', ');
      const phone = formatPhone(form.phone);
      const email = normalizeEmail(form.email);
      let result;
      let name;
      if (side === 'business') {
        name = form.contactName.trim();
        result = await submitBusinessRegistration({
          businessName: form.businessName.trim(),
          contactName: name,
          phone,
          email,
          workLocation: place,
          supportNeed: joinParts([savedContext('business', context), form.supportNeed], ' '),
        });
      } else {
        name = form.fullName.trim();
        const shifts = context?.side === 'worker' && context.shiftsPerWeek
          ? `${context.shiftsPerWeek} shift${context.shiftsPerWeek > 1 ? 's' : ''}/week`
          : null;
        result = await submitWorkerRegistration({
          fullName: name,
          phone,
          email,
          locality: place,
          experience: joinParts([savedContext('worker', context), form.experience], ' '),
          // Listed in a fixed order, not click order, so identical answers save identically.
          availability: joinParts([...AVAILABILITY_KEYS.filter((key) => form.availability.includes(key)).map((key) => SAVED_WAITLIST.availabilityOptions[key]), shifts], ', '),
        });
      }
      // Without a database nothing was saved. Only a local preview may pretend otherwise.
      if (result?.mock && !import.meta.env.DEV) {
        throw new Error('Supabase is not configured, so the registration was not saved.');
      }
      setDone({ side: sentSide, joinCount, name, business: sentSide === 'business' ? form.businessName.trim() : null, place, phone, mock: Boolean(result?.mock) });
      setValues((prev) => ({ ...prev, [sentSide]: EMPTY[sentSide] }));
      if (context?.side === sentSide) onClearContext();
    } catch (err) {
      console.error(err);
      setFailedSide(sentSide);
    } finally {
      setSubmittingSide(null);
    }
  };

  // Re-formatting the number would otherwise throw the caret to the end,
  // which makes fixing one digit in the middle error-prone.
  const handlePhoneChange = (e) => {
    const el = e.target;
    const before = digitsBefore(el.value, el.selectionStart ?? el.value.length);
    const formatted = formatPhone(el.value);
    setField('phone', formatted);
    requestAnimationFrame(() => {
      if (document.activeElement !== el) return;
      const caret = caretAfterDigits(formatted, before);
      el.setSelectionRange(caret, caret);
    });
  };

  const inputProps = (field, extra = {}) => {
    const id = `${side}-${field}`;
    const required = REQUIRED[side].includes(field);
    const hasError = Boolean(formErrors[field]);
    const hint = s.fields[field].hint;
    return {
      id,
      value: form[field],
      placeholder: s.fields[field].placeholder,
      maxLength: MAX_LENGTH[field],
      onChange: field === 'phone' ? handlePhoneChange : (e) => setField(field, e.target.value),
      onBlur: CHECKED[side].includes(field) ? () => checkOnBlur(field) : undefined,
      'aria-required': required ? 'true' : undefined,
      'aria-invalid': hasError ? 'true' : undefined,
      'aria-describedby': hasError ? `${id}-error` : hint ? `${id}-hint` : undefined,
      className: cx(INPUT_BASE, hasError ? 'border-danger' : 'border-line-strong hover:border-ink'),
      ...extra,
    };
  };

  const fieldProps = (field) => ({
    id: `${side}-${field}`,
    label: s.fields[field].label,
    optionalText: REQUIRED[side].includes(field) || UNLABELLED.includes(field) ? null : s.optional,
    hint: s.fields[field].hint,
    error: formErrors[field] ? s.errors[field] : null,
  });

  const tone = side === 'worker' ? 'worker' : 'biz';
  const copy = side ? s[side] : null;
  const showContext = side && context?.category && context.side === side;
  const contextText = showContext
    ? [
        c.categories[context.category],
        side === 'business' && context.hours ? fmt(c.hours, { n: context.hours }) : null,
        side === 'worker' && context.shiftsPerWeek
          ? (context.shiftsPerWeek === 1 ? s.context.oneShift : fmt(s.context.shifts, { n: context.shiftsPerWeek }))
          : null,
      ].filter(Boolean).join(' · ')
    : null;
  // A join button pressed elsewhere on the page since then opens a fresh form, not the old confirmation.
  const showDone = done && done.side === side && done.joinCount === joinCount;

  return (
    <section id="waitlist" className="bg-page pb-16 pt-10 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-6 text-center">
          <h2 ref={headingRef} tabIndex={-1} className="text-[1.375rem] font-extrabold leading-tight tracking-tight text-ink min-[22.5rem]:text-2xl sm:text-4xl">
            {s.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-body sm:text-lg">{s.sub}</p>
        </div>

        <Segmented
          ariaLabel={s.chooserLabel}
          value={side}
          onChange={onSideChange}
          options={[
            // The same words as the join buttons that lead here.
            { value: 'business', label: c.cta.needWorkers, tone: 'biz' },
            { value: 'worker', label: c.cta.wantWork, tone: 'worker' },
          ]}
          className="mb-5"
        />

        {!side && (
          <Card className="text-center">
            <p className="text-base text-body">{s.pickPrompt}</p>
          </Card>
        )}

        {showDone && (
          <Card key={`done-${side}`} className="animate-swap" role="status">
            <span className={cx('mb-4 flex h-12 w-12 items-center justify-center rounded-2xl', tone === 'worker' ? 'bg-worker-pale text-worker' : 'bg-biz-pale text-biz')}>
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 ref={doneRef} tabIndex={-1} className="text-xl font-bold text-ink">
              {fmt(s.success.title, { name: done.name })}
            </h3>
            <p className="mt-2 text-base text-body">
              {done.business
                ? fmt(s.success.business, { business: done.business, place: done.place })
                : fmt(s.success.worker, { place: done.place })}
            </p>
            <p className="mt-2 text-base text-body">{fmt(s.success.next, { phone: done.phone })}</p>
            {done.mock && (
              <p className="mt-4 rounded-xl border border-gold/40 bg-gold-pale p-3 text-sm text-gold-ink">{s.success.demo}</p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="whatsapp" href={whatsappUrl(done.side === 'worker' ? c.whatsapp.joinedWorker : c.whatsapp.joinedBusiness)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                {s.success.whatsapp}
              </Button>
              <Button
                variant={tone === 'worker' ? 'link-worker' : 'link-biz'}
                onClick={() => {
                  returnToForm.current = true;
                  setDone(null);
                }}
              >
                {s.success.again}
              </Button>
            </div>
          </Card>
        )}

        {side && !showDone && (
          <Card key={side} className="animate-swap">
            <h3 ref={formHeadingRef} tabIndex={-1} className="text-xl font-bold text-ink">{copy.heading}</h3>
            <p className="mt-1 text-base text-body">{copy.sub}</p>

            {showContext && (
              <div className={cx('mt-5 flex items-center justify-between gap-3 rounded-xl px-4 py-2 text-sm', tone === 'worker' ? 'bg-worker-pale text-worker-dark' : 'bg-biz-pale text-biz')}>
                <p className="min-w-0">
                  {s.context.label}: <span className="font-semibold">{contextText}</span>
                </p>
                <button
                  type="button"
                  onClick={onClearContext}
                  aria-label={s.context.remove}
                  className="-mr-2 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              {side === 'business' ? (
                <>
                  <Field {...fieldProps('businessName')}>
                    <input type="text" autoComplete="organization" {...inputProps('businessName')} />
                  </Field>
                  <Field {...fieldProps('contactName')}>
                    <input type="text" autoComplete="name" {...inputProps('contactName')} />
                  </Field>
                </>
              ) : (
                <Field {...fieldProps('fullName')}>
                  <input type="text" autoComplete="name" {...inputProps('fullName')} />
                </Field>
              )}

              <Field {...fieldProps('phone')}>
                <div className="flex">
                  <span className="inline-flex select-none items-center rounded-l-xl border border-r-0 border-line-strong bg-page px-3.5 text-base font-semibold text-ink">
                    +91
                  </span>
                  <input type="tel" inputMode="tel" autoComplete="tel-national" {...inputProps('phone', { className: cx(INPUT_BASE, 'min-w-0 rounded-l-none', formErrors.phone ? 'border-danger' : 'border-line-strong hover:border-ink') })} />
                </div>
              </Field>

              <Field {...fieldProps('email')}>
                <input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} {...inputProps('email')} />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field {...fieldProps('city')}>
                  <input type="text" autoComplete="address-level2" {...inputProps('city')} />
                </Field>
                <Field {...fieldProps('state')}>
                  <input type="text" autoComplete="address-level1" {...inputProps('state')} />
                </Field>
              </div>

              <Field {...fieldProps('locality')}>
                <input type="text" {...inputProps('locality')} />
              </Field>

              {side === 'business' ? (
                <Field {...fieldProps('supportNeed')}>
                  <textarea rows={3} {...inputProps('supportNeed', { className: cx(INPUT_BASE, 'resize-none border-line-strong hover:border-ink') })} />
                </Field>
              ) : (
                <>
                  <Field {...fieldProps('experience')}>
                    <input type="text" {...inputProps('experience')} />
                  </Field>
                  <fieldset>
                    <legend className="mb-1.5 text-sm font-semibold text-ink">
                      {s.fields.availability.label}
                      <span className="font-normal text-body"> ({s.optional})</span>
                    </legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {AVAILABILITY_KEYS.map((key) => (
                        <Choice key={key} tone="worker" selected={form.availability.includes(key)} onClick={() => toggleAvailability(key)}>
                          <span className="text-sm font-semibold">{s.availabilityOptions[key]}</span>
                        </Choice>
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm text-body">{s.fields.availability.hint}</p>
                  </fieldset>
                </>
              )}

              {failed && (
                <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-white p-3.5 text-sm text-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{s.errors.submit}</span>
                </div>
              )}

              <Button type="submit" variant={tone === 'worker' ? 'worker' : 'biz'} size="lg" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    {s.submitting}
                  </>
                ) : (
                  <>
                    {copy.submit}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-body">{copy.disclaimer}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
