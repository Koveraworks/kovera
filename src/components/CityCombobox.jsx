import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { fmt } from '../i18n/index.js';
import { cx } from '../lib/cx.js';
import { exactDistrict, loadDistricts, matchDistricts } from '../lib/places.js';

/**
 * Type-ahead over the districts of one state (ARIA 1.2 combobox with a list
 * popup). Only a district from the list can be chosen: typing filters the
 * list, and the field is committed when an option is picked, or when what was
 * typed names a district exactly (current or former name).
 *
 *   text      what is in the box
 *   value     the chosen district ('' while nothing valid is chosen)
 *   onChange  ({ text, value }) on every change
 *   strings   { placeholder, pickStateFirst, loading, loadFailed, noMatch, count, countOne }
 */
export default function CityCombobox({ id, stateCode, text, value, onChange, onBlur, strings, invalid, describedBy, className }) {
  const listId = useId();
  const inputRef = useRef(null);
  const [loaded, setLoaded] = useState({ code: null, list: null, failed: false });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Fetch the state's list once a state is picked. A late answer for a state
  // the visitor has since changed is ignored.
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!stateCode) return undefined;
    let current = true;
    loadDistricts(stateCode).then(
      (list) => current && setLoaded({ code: stateCode, list, failed: false }),
      () => current && setLoaded({ code: stateCode, list: null, failed: true }),
    );
    return () => {
      current = false;
    };
  }, [stateCode, retry]);

  const list = loaded.code === stateCode ? loaded.list : null;
  const failed = loaded.code === stateCode && loaded.failed;
  const loading = Boolean(stateCode) && !list && !failed;
  const options = useMemo(() => matchDistricts(list, value ? '' : text), [list, text, value]);
  const expanded = open && Boolean(list);

  const choose = (name) => {
    onChange({ text: name, value: name });
    setOpen(false);
    setActive(-1);
  };

  const handleInput = (e) => {
    const next = e.target.value;
    onChange({ text: next, value: '' });
    setOpen(true);
    setActive(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!list) return;
      e.preventDefault();
      if (!expanded) {
        setOpen(true);
        setActive(e.key === 'ArrowDown' ? 0 : options.length - 1);
        return;
      }
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (options.length ? (i + step + options.length) % options.length : -1));
    } else if (e.key === 'Enter') {
      if (expanded && active >= 0 && options[active]) {
        e.preventDefault();
        choose(options[active]);
      } else if (expanded) {
        // Enter on an exact name commits it; otherwise it must not submit a half-typed city.
        const exact = exactDistrict(list, text);
        if (exact) {
          e.preventDefault();
          choose(exact);
        } else if (options.length === 1) {
          e.preventDefault();
          choose(options[0]);
        }
      }
    } else if (e.key === 'Escape') {
      if (expanded) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      } else if (text) {
        e.preventDefault();
        onChange({ text: '', value: '' });
      }
    } else if (e.key === 'Home' || e.key === 'End') {
      // Leave Home/End to move the caret in the text box (APG recommendation).
      setActive(-1);
    }
  };

  const handleBlur = () => {
    setOpen(false);
    setActive(-1);
    let committed = value;
    if (!value && list) {
      const exact = exactDistrict(list, text);
      if (exact) {
        committed = exact;
        onChange({ text: exact, value: exact });
      }
    }
    onBlur?.(committed);
  };

  // Keep the highlighted option in view as arrows move through a long list.
  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  let status = '';
  if (!stateCode) status = strings.pickStateFirst;
  else if (failed) status = strings.loadFailed;
  else if (loading) status = strings.loading;
  else if (expanded && !options.length) status = strings.noMatch;
  else if (expanded) status = options.length === 1 ? strings.countOne : fmt(strings.count, { n: options.length });

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded ? 'true' : 'false'}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required="true"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="next"
          disabled={!stateCode}
          value={text}
          placeholder={stateCode ? strings.placeholder : strings.pickStateFirst}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cx(className, 'pr-11 disabled:cursor-not-allowed disabled:bg-page')}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-body" aria-hidden="true">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </div>

      {/* Always in the page, so aria-controls points at something; hidden while closed. */}
      <ul
        id={listId}
        role="listbox"
        aria-label={strings.listLabel}
        hidden={!expanded || !options.length}
        className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-line-strong bg-white py-1 shadow-lg"
      >
        {options.map((name, i) => (
          <li
            key={name}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active ? 'true' : 'false'}
            // Keep focus in the box, so blur does not close the list before the tap lands.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => choose(name)}
            onPointerEnter={() => setActive(i)}
            className={cx(
              'flex min-h-11 cursor-pointer items-center px-4 py-2 text-base text-ink',
              i === active && 'bg-biz-pale',
            )}
          >
            {name}
          </li>
        ))}
      </ul>

      {/* Polite count, so screen-reader users know the list changed while typing. */}
      <p className="sr-only" aria-live="polite">{status}</p>

      {failed && (
        <p className="mt-1.5 text-sm text-danger">
          {strings.loadFailed}{' '}
          <button type="button" className="cursor-pointer font-semibold underline" onClick={() => setRetry((n) => n + 1)}>
            {strings.retry}
          </button>
        </p>
      )}
    </div>
  );
}
