import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2, Store, UserRound, X } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import Combobox from '../components/Combobox.jsx';
import Confetti from '../components/Confetti.jsx';
import { Button, Card, CheckItem, Pill, Segmented } from '../ui.jsx';
import { fmt, getStrings, useLang, useStrings } from '../i18n/index.js';
import { SHOP_TYPE_IDS, isShopType } from '../data/shopTypes.js';
import { whatsappUrl } from '../lib/contact.js';
import { cx } from '../lib/cx.js';
import { buzz, canCelebrate } from '../lib/motion.js';
import { caretAfterDigits, digitsBefore, formatPhone, isValidIndianMobile } from '../lib/phone.js';
import { districtOptions, loadDistricts, stateByCode, stateOptions } from '../lib/places.js';
import { submitBusinessRegistration, submitWorkerRegistration } from '../lib/supabase.js';

// state holds a state code (e.g. "HR"); city the district's English name.
const EMPTY = {
  business: { businessName: '', contactName: '', phone: '', shopType: '', state: '', city: '', area: '' },
  worker: { fullName: '', phone: '', state: '', city: '', area: '' },
};

// Every field that must be filled, in the order it appears in the form:
// focus goes to the first one that failed. Area is not required, but is not
// labelled "optional" either: the team wants it whenever the visitor knows it.
const REQUIRED = {
  business: ['businessName', 'contactName', 'phone', 'shopType', 'state', 'city'],
  worker: ['fullName', 'phone', 'state', 'city'],
};

// The database refuses longer text (supabase/schema.sql, section 6). Its caps
// are higher than these, because what is saved also joins area, city and
// state into one field.
const MAX_LENGTH = {
  businessName: 100,
  contactName: 60,
  fullName: 60,
  area: 100,
};

/** The two paths in the chooser card, in order. Text lives in strings (waitlist.chooser). */
const PATHS = [
  { side: 'business', tone: 'biz', icon: Store },
  { side: 'worker', tone: 'worker', icon: UserRound },
];

// What is saved is always English, whichever language the visitor reads in,
// so the team's sheet stays sortable.
const SAVED_SHOP_TYPES = getStrings('shopTypes', 'en');

function isInvalid(field, value) {
  if (field === 'phone') return !isValidIndianMobile(value);
  return !String(value).trim();
}

function joinParts(parts, separator) {
  return parts.map((part) => (part ?? '').trim()).filter(Boolean).join(separator) || null;
}

const INPUT_BASE = 'w-full min-h-12 rounded-xl border bg-white px-4 py-3 text-base text-ink transition-colors';
const inputBorder = (hasError) => (hasError ? 'border-danger' : 'border-line-strong hover:border-ink');

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
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
  const shopTypes = useStrings('shopTypes');
  const { lang } = useLang();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({ business: {}, worker: {} });
  // Which side is sending / failed to send, so one form's state never shows on the other.
  const [submittingSide, setSubmittingSide] = useState(null);
  const [failedSide, setFailedSide] = useState(null);
  const [done, setDone] = useState(null);
  // District lists by state code: an array once loaded, 'error' if it failed.
  const [districts, setDistricts] = useState({});
  const [retries, setRetries] = useState(0);
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

  const form = side ? values[side] : null;
  const formErrors = side ? errors[side] : {};
  const stateCode = form?.state || '';

  // Fetch the chosen state's districts (a small file per state).
  useEffect(() => {
    if (!stateCode || Array.isArray(districts[stateCode])) return undefined;
    let live = true;
    loadDistricts(stateCode).then(
      (list) => live && setDistricts((prev) => ({ ...prev, [stateCode]: list })),
      (err) => {
        console.error(err);
        if (live) setDistricts((prev) => ({ ...prev, [stateCode]: 'error' }));
      },
    );
    return () => {
      live = false;
    };
    // districts is read only to skip lists already loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, retries]);

  const choosePath = (next) => {
    focusFormOnOpen.current = true;
    onSideChange(next);
  };

  const submitting = submittingSide === side;
  const failed = failedSide === side;

  // A shop type picked in the hero or the shifts section fills the business
  // form's shop type until the visitor chooses one themselves.
  const contextShopType = context?.side === 'business' && isShopType(context.category) ? context.category : '';
  const shopTypeValue = side === 'business' ? form.shopType || contextShopType : '';

  const setFields = (changes) => {
    setValues((prev) => ({ ...prev, [side]: { ...prev[side], ...changes } }));
    const cleared = Object.keys(changes).filter((field) => formErrors[field]);
    if (cleared.length) {
      setErrors((prev) => ({ ...prev, [side]: { ...prev[side], ...Object.fromEntries(cleared.map((f) => [f, false])) } }));
    }
    if (failed) setFailedSide(null);
  };
  const setField = (field, value) => setFields({ [field]: value });

  const markError = (field) => setErrors((prev) => ({ ...prev, [side]: { ...prev[side], [field]: true } }));

  // Check a text field as soon as the visitor leaves it with something typed.
  const checkOnBlur = (field) => {
    if (form[field] && isInvalid(field, form[field])) markError(field);
  };

  const fieldValue = (field) => (field === 'shopType' ? shopTypeValue : form[field]);

  const placeNames = (f, language) => {
    const st = stateByCode(f.state);
    const district = (Array.isArray(districts[f.state]) ? districts[f.state] : []).find((d) => d.en === f.city);
    const pick = (item) => (item ? (language === 'hi' ? item.hi : item.en) : null);
    return { state: pick(st), city: pick(district) ?? f.city };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    for (const field of REQUIRED[side]) {
      if (isInvalid(field, fieldValue(field))) found[field] = true;
    }
    setErrors((prev) => ({ ...prev, [side]: found }));
    const firstInvalid = REQUIRED[side].find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`${side}-${firstInvalid}`)?.focus();
      return;
    }

    const sentSide = side;
    setSubmittingSide(sentSide);
    setFailedSide(null);
    try {
      const saved = placeNames(form, 'en');
      const shown = placeNames(form, lang);
      const area = form.area.trim() || null;
      const savedPlace = joinParts([area, saved.city, saved.state], ', ');
      const shownPlace = joinParts([area, shown.city, shown.state], ', ');
      const phone = formatPhone(form.phone);
      const place = { state: saved.state, city: saved.city, area };
      let result;
      let name;
      let business = null;
      if (side === 'business') {
        name = form.contactName.trim();
        business = form.businessName.trim();
        result = await submitBusinessRegistration({
          businessName: business,
          contactName: name,
          phone,
          shopType: SAVED_SHOP_TYPES[shopTypeValue],
          ...place,
          workLocation: savedPlace,
        });
      } else {
        name = form.fullName.trim();
        const interest = context?.side === 'worker' && isShopType(context.category)
          ? `[Interested in: ${SAVED_SHOP_TYPES[context.category]}]`
          : null;
        result = await submitWorkerRegistration({
          fullName: name,
          phone,
          ...place,
          locality: savedPlace,
          experience: interest,
        });
      }
      // Without a database nothing was saved. Only a local preview may pretend otherwise.
      if (result?.mock && !import.meta.env.DEV) {
        throw new Error('Supabase is not configured, so the registration was not saved.');
      }
      const celebrate = canCelebrate();
      if (celebrate) buzz();
      setDone({
        side: sentSide,
        joinCount,
        name,
        business,
        shopType: sentSide === 'business' ? shopTypeValue : null,
        place: shownPlace,
        phone,
        mock: Boolean(result?.mock),
        celebrate,
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

  const inputProps = (field, extra = {}) => {
    const hasError = Boolean(formErrors[field]);
    return {
      id: `${side}-${field}`,
      value: form[field],
      placeholder: s.fields[field].placeholder,
      maxLength: MAX_LENGTH[field],
      onChange: field === 'phone' ? handlePhoneChange : (e) => setField(field, e.target.value),
      onBlur: REQUIRED[side].includes(field) ? () => checkOnBlur(field) : undefined,
      'aria-required': REQUIRED[side].includes(field) ? 'true' : undefined,
      'aria-invalid': hasError ? 'true' : undefined,
      'aria-describedby': describedBy(field),
      className: cx(INPUT_BASE, inputBorder(hasError)),
      ...extra,
    };
  };

  const fieldProps = (field) => ({
    id: `${side}-${field}`,
    label: s.fields[field].label,
    hint: s.fields[field].hint,
    error: formErrors[field] ? s.errors[field] : null,
  });

  const cityList = districts[stateCode];
  const cityStatus = !stateCode ? 'needsState' : cityList === 'error' ? 'error' : Array.isArray(cityList) ? 'ready' : 'loading';
  const cityPlaceholder = {
    needsState: s.fields.city.needsState,
    loading: s.fields.city.loading,
    error: s.fields.city.placeholder,
    ready: s.fields.city.placeholder,
  }[cityStatus];

  const tone = side === 'worker' ? 'worker' : 'biz';
  const copy = side ? s[side] : null;
  // The worker form shows the shop type picked elsewhere as a removable chip;
  // the business form puts it straight into its shop-type field.
  const showContext = side === 'worker' && context?.side === 'worker' && isShopType(context.category);
  // A join button pressed elsewhere on the page since then opens a fresh form, not the old confirmation.
  const showDone = done && done.side === side && done.joinCount === joinCount;

  const doneMessage = showDone
    ? done.side === 'business'
      ? fmt(s.whatsappMessage.business, { business: done.business, shopType: shopTypes[done.shopType], place: done.place })
      : fmt(s.whatsappMessage.worker, { place: done.place })
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
                    <p className="mt-2 text-base leading-relaxed text-body">{path.body}</p>
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
              <div className="relative">
                {done.celebrate && <Confetti />}
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
                  <div className="mt-6 rounded-2xl bg-whatsapp-pale p-4 sm:p-5">
                    <p className="text-base font-semibold text-ink">{s.success.more}</p>
                    <Button variant="whatsapp" size="lg" className="mt-4 w-full sm:w-auto" href={whatsappUrl(doneMessage)} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="h-5 w-5" />
                      {s.success.whatsapp}
                    </Button>
                  </div>
                  <div className="mt-4">
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
              </div>
            )}

            {side && !showDone && (
              <Card key={side} className="animate-swap">
                <h3 ref={formHeadingRef} tabIndex={-1} className="text-xl font-bold text-ink">{copy.heading}</h3>
                <p className="mt-1 text-base text-body">{copy.sub}</p>

                {showContext && (
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-worker-pale px-4 py-2 text-sm text-worker-dark">
                    <p className="min-w-0">
                      {s.context.label}: <span className="font-semibold">{shopTypes[context.category]}</span>
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
                      <input type="tel" inputMode="tel" autoComplete="tel-national" {...inputProps('phone', { className: cx(INPUT_BASE, 'min-w-0 rounded-l-none', inputBorder(formErrors.phone)) })} />
                    </div>
                  </Field>

                  {side === 'business' && (
                    <Field {...fieldProps('shopType')}>
                      <div className="relative">
                        <select
                          id={`${side}-shopType`}
                          value={shopTypeValue}
                          onChange={(e) => setField('shopType', e.target.value)}
                          aria-required="true"
                          aria-invalid={formErrors.shopType ? 'true' : undefined}
                          aria-describedby={describedBy('shopType')}
                          className={cx(INPUT_BASE, 'cursor-pointer appearance-none pr-11', inputBorder(formErrors.shopType), !shopTypeValue && 'text-body')}
                        >
                          <option value="" disabled>{s.fields.shopType.placeholder}</option>
                          {SHOP_TYPE_IDS.map((id) => (
                            <option key={id} value={id} className="text-ink">{shopTypes[id]}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body" aria-hidden="true" />
                      </div>
                    </Field>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field {...fieldProps('state')}>
                      <Combobox
                        id={`${side}-state`}
                        options={stateOptions(lang)}
                        value={form.state}
                        // A new state empties the city, which belonged to the old one.
                        onChange={(code) => code !== form.state && setFields({ state: code, city: '' })}
                        onBlur={({ unmatched }) => unmatched && markError('state')}
                        placeholder={s.fields.state.placeholder}
                        noMatchText={s.noMatch.state}
                        required
                        invalid={Boolean(formErrors.state)}
                        describedBy={describedBy('state')}
                        className={cx(INPUT_BASE, inputBorder(formErrors.state))}
                      />
                    </Field>
                    <Field {...fieldProps('city')} error={formErrors.city ? s.errors.city : cityStatus === 'error' ? s.errors.places : null}>
                      <Combobox
                        // A new state (or language) starts the city box afresh.
                        key={`${side}-${stateCode}`}
                        id={`${side}-city`}
                        options={districtOptions(Array.isArray(cityList) ? cityList : [], lang)}
                        value={form.city}
                        onChange={(city) => setField('city', city)}
                        onBlur={({ unmatched }) => unmatched && markError('city')}
                        placeholder={cityPlaceholder}
                        noMatchText={s.noMatch.city}
                        disabled={cityStatus === 'needsState' || cityStatus === 'loading'}
                        required
                        invalid={Boolean(formErrors.city) || cityStatus === 'error'}
                        describedBy={formErrors.city || cityStatus === 'error' ? `${side}-city-error` : `${side}-city-hint`}
                        className={cx(INPUT_BASE, inputBorder(formErrors.city || cityStatus === 'error'))}
                      />
                      {cityStatus === 'error' && (
                        <Button
                          variant={tone === 'worker' ? 'link-worker' : 'link-biz'}
                          className="mt-1"
                          onClick={() => {
                            setDistricts((prev) => ({ ...prev, [stateCode]: undefined }));
                            setRetries((n) => n + 1);
                          }}
                        >
                          {s.errors.retry}
                        </Button>
                      )}
                    </Field>
                  </div>

                  <Field {...fieldProps('area')}>
                    <input type="text" autoComplete="address-level3" {...inputProps('area')} />
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
