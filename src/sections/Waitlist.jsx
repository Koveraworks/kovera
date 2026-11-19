import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2, Store, UserRound } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import CityCombobox from '../components/CityCombobox.jsx';
import { Button, Card, CheckItem, Pill, Segmented } from '../ui.jsx';
import { fmt, useLang, useStrings } from '../i18n/index.js';
import { STATES } from '../data/states.js';
import { SHOP_TYPE_IDS } from '../data/shopTypes.js';
import { whatsappUrl } from '../lib/contact.js';
import { cx } from '../lib/cx.js';
import { caretAfterDigits, digitsBefore, formatPhone, isValidIndianMobile } from '../lib/phone.js';
import { submitBusinessRegistration, submitWorkerRegistration } from '../lib/supabase.js';

// state is a code from src/data/states.js; city is the chosen district (saved),
// cityText what is typed in its box.
const EMPTY = {
  business: { businessName: '', contactName: '', phone: '', shopType: '', state: '', city: '', cityText: '', area: '' },
  worker: { fullName: '', phone: '', state: '', city: '', cityText: '', area: '' },
};

// Every field that must be filled, in the order it appears in the form: focus
// goes to the first one that failed. Area is not required, but not labelled
// "optional" either: the team wants it whenever the visitor knows it.
const REQUIRED = {
  business: ['businessName', 'contactName', 'phone', 'shopType', 'state', 'city'],
  worker: ['fullName', 'phone', 'state', 'city'],
};

// The database refuses longer text (supabase/migrations, the guard triggers);
// its caps sit a little above these.
const MAX_LENGTH = {
  businessName: 100,
  contactName: 60,
  fullName: 60,
  area: 100,
};

/** Standard shift length, shown in the worker path card. */
const SHIFT_HOURS = 4;

/** The two paths in the chooser card, in order. Text lives in strings (waitlist.chooser). */
const PATHS = [
  { side: 'business', tone: 'biz', icon: Store },
  { side: 'worker', tone: 'worker', icon: UserRound },
];

const STATE_BY_CODE = Object.fromEntries(STATES.map((st) => [st.code, st]));

function isInvalid(field, form) {
  if (field === 'phone') return !isValidIndianMobile(form.phone);
  return !String(form[field] ?? '').trim();
}

/**
 * Confetti and a buzz on success, unless the visitor asked for less motion or
 * less data. Checked once, at the moment of success.
 */
function canCelebrate() {
  if (typeof window === 'undefined') return false;
  const media = (query) => Boolean(window.matchMedia?.(query).matches);
  const saveData = Boolean(navigator.connection?.saveData) || media('(prefers-reduced-data: reduce)');
  return !saveData && !media('(prefers-reduced-motion: reduce)');
}

const CONFETTI_COLORS = ['var(--color-biz)', 'var(--color-worker-bright)', 'var(--color-gold)', 'var(--color-worker-glow)', 'var(--color-whatsapp)'];
// Fixed positions, so every success looks the same and nothing is computed at random.
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 37) % 100}%`,
  delay: `${(i % 6) * 60}ms`,
  drift: `${((i * 53) % 60) - 30}px`,
  spin: `${((i * 97) % 540) + 180}deg`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

/** CSS-only burst over the confirmation card (styles in index.css, .confetti). */
function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {CONFETTI.map((piece, i) => (
        <i key={i} style={{ '--x': piece.x, '--delay': piece.delay, '--drift': piece.drift, '--spin': piece.spin, '--color': piece.color }} />
      ))}
    </div>
  );
}

const INPUT_BASE = 'w-full min-h-12 rounded-xl border bg-white px-4 py-3 text-base text-ink transition-colors';
const borderFor = (hasError) => (hasError ? 'border-danger' : 'border-line-strong hover:border-ink');

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
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

/** Native select (fast, and every phone gives it a good picker) with the same look as the text boxes. */
function Select({ placeholder, options, hasError, ...rest }) {
  return (
    <div className="relative">
      <select {...rest} className={cx(INPUT_BASE, 'cursor-pointer appearance-none pr-11', !rest.value && 'text-body', borderFor(hasError))}>
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">{option.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body" aria-hidden="true" />
    </div>
  );
}

export default function Waitlist({ side, onSideChange, context, onClearContext, headingRef, joinCount }) {
  const s = useStrings('waitlist');
  const c = useStrings('common');
  const shopTypes = useStrings('shopTypes');
  const { lang } = useLang();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({ business: {}, worker: {} });
  // Which side is sending / failed to send, so one form's state never shows on the other.
  const [submittingSide, setSubmittingSide] = useState(null);
  const [failedSide, setFailedSide] = useState(null);
  const [done, setDone] = useState(null);
  const doneRef = useRef(null);
  const formHeadingRef = useRef(null);
  const returnToForm = useRef(false);
  const focusFormOnOpen = useRef(false);

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

  // A button in the chooser card removes the card it sits in: hand focus to the form that replaces it.
  useEffect(() => {
    if (side && focusFormOnOpen.current) {
      focusFormOnOpen.current = false;
      formHeadingRef.current?.focus();
    }
  }, [side]);

  const choosePath = (next) => {
    focusFormOnOpen.current = true;
    onSideChange(next);
  };

  const submitting = submittingSide === side;
  const failed = failedSide === side;

  // A shop category picked further up the page preselects the shop type,
  // until the visitor chooses one themselves.
  const pickedShopType = context?.side === 'business' && SHOP_TYPE_IDS.includes(context.category) ? context.category : '';
  const form = side
    ? (side === 'business' ? { ...values.business, shopType: values.business.shopType || pickedShopType } : values.worker)
    : null;
  const formErrors = side ? errors[side] : {};

  const update = (patch) => {
    setValues((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));
    const cleared = Object.keys(patch).filter((field) => formErrors[field]);
    if (cleared.length) {
      setErrors((prev) => ({ ...prev, [side]: { ...prev[side], ...Object.fromEntries(cleared.map((f) => [f, false])) } }));
    }
    if (failed) setFailedSide(null);
  };
  const setField = (field, value) => update({ [field]: value });

  const flag = (field) => setErrors((prev) => ({ ...prev, [side]: { ...prev[side], [field]: true } }));

  // Check a field as soon as the visitor leaves it with something typed.
  const checkOnBlur = (field) => {
    if (form[field] && isInvalid(field, form)) flag(field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    for (const field of REQUIRED[side]) {
      if (isInvalid(field, form)) found[field] = true;
    }
    setErrors((prev) => ({ ...prev, [side]: found }));
    const firstInvalid = REQUIRED[side].find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`${side}-${firstInvalid}`)?.focus();
      return;
    }

    const sentSide = side;
    const stateName = STATE_BY_CODE[form.state]?.name ?? null;
    const location = { state: stateName, city: form.city, area: form.area.trim() || null };
    setSubmittingSide(sentSide);
    setFailedSide(null);
    try {
      const phone = formatPhone(form.phone);
      let result;
      let name;
      if (side === 'business') {
        name = form.contactName.trim();
        result = await submitBusinessRegistration({
          businessName: form.businessName.trim(),
          contactName: name,
          phone,
          shopType: form.shopType,
          ...location,
        });
      } else {
        name = form.fullName.trim();
        result = await submitWorkerRegistration({ fullName: name, phone, ...location });
      }
      // Without a database nothing was saved. Only a local preview, or a build
      // made on purpose as a demo (VITE_DEMO_MODE=true, e.g. a GitHub Pages
      // preview), may pretend otherwise; both show the "not saved" note.
      if (result?.mock && !import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== 'true') {
        throw new Error('Supabase is not configured, so the registration was not saved.');
      }
      const celebrate = canCelebrate();
      if (celebrate) navigator.vibrate?.([30, 50, 30]);
      setDone({
        side: sentSide,
        joinCount,
        name,
        business: sentSide === 'business' ? form.businessName.trim() : null,
        stateCode: form.state,
        city: form.city,
        area: location.area,
        phone,
        celebrate,
        mock: Boolean(result?.mock),
      });
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

  const describedBy = (field) => {
    const id = `${side}-${field}`;
    if (formErrors[field]) return `${id}-error`;
    return s.fields[field].hint ? `${id}-hint` : undefined;
  };

  const inputProps = (field, extra = {}) => ({
    id: `${side}-${field}`,
    value: form[field],
    placeholder: s.fields[field].placeholder,
    maxLength: MAX_LENGTH[field],
    onChange: field === 'phone' ? handlePhoneChange : (e) => setField(field, e.target.value),
    onBlur: REQUIRED[side].includes(field) ? () => checkOnBlur(field) : undefined,
    'aria-required': REQUIRED[side].includes(field) ? 'true' : undefined,
    'aria-invalid': formErrors[field] ? 'true' : undefined,
    'aria-describedby': describedBy(field),
    className: cx(INPUT_BASE, borderFor(formErrors[field])),
    ...extra,
  });

  const fieldProps = (field) => ({
    id: `${side}-${field}`,
    label: s.fields[field].label,
    hint: s.fields[field].hint,
    error: formErrors[field] ? s.errors[field] : null,
  });

  const stateOptions = STATES.map((st) => ({ value: st.code, label: lang === 'hi' ? st.hi : st.name }));
  const shopTypeOptions = SHOP_TYPE_IDS.map((id) => ({ value: id, label: shopTypes[id] }));

  const tone = side === 'worker' ? 'worker' : 'biz';
  const copy = side ? s[side] : null;
  // A join button pressed elsewhere on the page since then opens a fresh form, not the old confirmation.
  const showDone = done && done.side === side && done.joinCount === joinCount;
  // "Samalkha, Panipat, Haryana". A UT whose only district has its name (Chandigarh) is named once.
  const doneState = done ? STATE_BY_CODE[done.stateCode] : null;
  const donePlace = done
    ? [done.area, done.city, doneState && doneState.name !== done.city ? (lang === 'hi' ? doneState.hi : doneState.name) : null].filter(Boolean).join(', ')
    : '';

  return (
    <section id="waitlist" className="bg-page pb-16 pt-16 md:pb-28 md:pt-24">
      {/* Wide for the two-path chooser; the form below keeps a narrow, readable column. */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 ref={headingRef} tabIndex={-1} className="text-[1.375rem] font-extrabold leading-tight tracking-tight text-ink min-[22.5rem]:text-2xl sm:text-4xl">
            {s.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-body sm:text-lg">{s.sub}</p>
        </div>

        {/*
          Before a side is chosen: one card with both paths side by side, equal
          weight, each in its own colour. Choosing one opens its form below,
          where the switch lets the visitor change their mind.
        */}
        {!side && (
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-biz px-6 py-3.5 text-white sm:px-8">
              <p className="flex min-w-0 items-start gap-2 text-sm font-semibold sm:text-base">
                <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full bg-worker-glow" aria-hidden="true" />
                <span className="min-w-0">{s.chooser.band}</span>
              </p>
              <p className="text-sm text-navy-soft">{s.chooser.bandNote}</p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0">
              {PATHS.map(({ side: pathSide, tone: pathTone, icon }) => {
                const path = s.chooser[pathSide];
                return (
                  <div key={pathSide} className="flex min-w-0 flex-col p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap gap-2">
                      <Pill tone={pathTone} icon={icon}>{c.side[pathSide]}</Pill>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-ink sm:text-2xl">{path.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-body">{fmt(path.body, { hours: SHIFT_HOURS })}</p>
                    <ul className="mt-4 space-y-2.5">
                      {path.points.map((point) => (
                        <CheckItem key={point} tone={pathTone} className="text-ink">{point}</CheckItem>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <div className="border-t border-line pt-6">
                        <Button variant={pathTone} size="lg" className="w-full" onClick={() => choosePath(pathSide)}>
                          {pathSide === 'worker' ? c.cta.wantWork : c.cta.needWorkers}
                          <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="border-t border-line bg-page px-6 py-4 text-center text-sm text-body sm:px-8">{s.chooser.note}</p>
          </div>
        )}

        {side && (
          <div className="mx-auto max-w-2xl">
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

            {showDone && (
              <Card key={`done-${side}`} className="animate-swap relative overflow-hidden" role="status">
                {done.celebrate && <Confetti />}
                <span className={cx('mb-4 flex h-12 w-12 items-center justify-center rounded-2xl', tone === 'worker' ? 'bg-worker-pale text-worker' : 'bg-biz-pale text-biz')}>
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 ref={doneRef} tabIndex={-1} className="text-xl font-bold text-ink">
                  {fmt(s.success.title, { name: done.name })}
                </h3>
                <p className="mt-2 text-base text-body">
                  {done.business
                    ? fmt(s.success.business, { business: done.business, place: donePlace })
                    : fmt(s.success.worker, { place: donePlace })}
                </p>
                <p className="mt-4 text-base font-semibold text-ink">{fmt(s.success.next, { phone: done.phone })}</p>
                {done.mock && (
                  <p className="mt-4 rounded-xl border border-gold/40 bg-gold-pale p-3 text-sm text-gold-ink">{s.success.demo}</p>
                )}
                {/* The message carries no name or number, only which side joined, in the visitor's language. */}
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="mt-4 w-full"
                  href={whatsappUrl(done.side === 'worker' ? c.whatsapp.joinedWorker : c.whatsapp.joinedBusiness)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {s.success.whatsapp}
                </Button>
                <p className="mt-3 text-sm text-body">{s.success.later}</p>
                <div className="mt-4 border-t border-line pt-4">
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

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                  {side === 'business' ? (
                    <>
                      <Field {...fieldProps('businessName')}>
                        <input type="text" autoComplete="organization" enterKeyHint="next" {...inputProps('businessName')} />
                      </Field>
                      <Field {...fieldProps('contactName')}>
                        <input type="text" autoComplete="name" enterKeyHint="next" {...inputProps('contactName')} />
                      </Field>
                    </>
                  ) : (
                    <Field {...fieldProps('fullName')}>
                      <input type="text" autoComplete="name" enterKeyHint="next" {...inputProps('fullName')} />
                    </Field>
                  )}

                  <Field {...fieldProps('phone')}>
                    <div className="flex">
                      <span className="inline-flex select-none items-center rounded-l-xl border border-r-0 border-line-strong bg-page px-3.5 text-base font-semibold text-ink">
                        +91
                      </span>
                      <input type="tel" inputMode="tel" autoComplete="tel-national" enterKeyHint="next" {...inputProps('phone', { className: cx(INPUT_BASE, 'min-w-0 rounded-l-none', borderFor(formErrors.phone)) })} />
                    </div>
                  </Field>

                  {side === 'business' && (
                    <Field {...fieldProps('shopType')}>
                      <Select
                        id="business-shopType"
                        value={form.shopType}
                        placeholder={s.fields.shopType.placeholder}
                        options={shopTypeOptions}
                        hasError={formErrors.shopType}
                        onChange={(e) => setField('shopType', e.target.value)}
                        aria-required="true"
                        aria-invalid={formErrors.shopType ? 'true' : undefined}
                        aria-describedby={describedBy('shopType')}
                      />
                    </Field>
                  )}

                  <Field {...fieldProps('state')}>
                    <Select
                      id={`${side}-state`}
                      value={form.state}
                      placeholder={s.fields.state.placeholder}
                      options={stateOptions}
                      hasError={formErrors.state}
                      autoComplete="address-level1"
                      // A new state means a new district list: the old city no longer applies.
                      onChange={(e) => update({ state: e.target.value, city: '', cityText: '' })}
                      aria-required="true"
                      aria-invalid={formErrors.state ? 'true' : undefined}
                      aria-describedby={describedBy('state')}
                    />
                  </Field>

                  <Field {...fieldProps('city')}>
                    <CityCombobox
                      id={`${side}-city`}
                      stateCode={form.state}
                      text={form.cityText}
                      value={form.city}
                      onChange={({ text, value }) => update({ cityText: text, city: value })}
                      onBlur={(committed) => {
                        if (form.cityText && !committed) flag('city');
                      }}
                      strings={{ ...s.city, placeholder: s.fields.city.placeholder }}
                      invalid={formErrors.city}
                      describedBy={describedBy('city')}
                      className={cx(INPUT_BASE, borderFor(formErrors.city))}
                    />
                  </Field>

                  <Field {...fieldProps('area')}>
                    <input type="text" autoComplete="address-level3" enterKeyHint="done" {...inputProps('area')} />
                  </Field>

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
        )}
      </div>
    </section>
  );
}
