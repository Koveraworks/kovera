import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../lib/cx.js';
import { exactOption, rankOptions } from '../lib/match.js';

const MAX_SHOWN = 60;

/**
 * A text box that suggests items from a fixed list as you type (ARIA 1.2
 * combobox with a listbox popup). Only a listed item counts as a value:
 * typing clears the value until the text matches an item exactly or one is
 * picked, so the parent can tell "picked from the list" from "typed something".
 *
 * Built by hand rather than with <datalist>, which is unreliable in in-app
 * browsers such as Facebook's, where most visitors arrive.
 *
 * options: [{ value, label, sublabel?, search: [strings matched against] }]
 * To clear the typed text from outside (a new form, a changed state), remount
 * it with a new `key`.
 */
export default function Combobox({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  noMatchText,
  disabled = false,
  invalid = false,
  required = false,
  describedBy,
  className,
}) {
  const listId = useId();
  const inputRef = useRef(null);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const selected = options.find((o) => o.value === value) ?? null;
  // While typing, show what was typed; otherwise the picked item's name in
  // the current language (so switching language updates it).
  const shown = editing ? text : selected ? selected.label : text;
  const matches = open ? rankOptions(options, editing ? text : '', MAX_SHOWN) : [];
  const optionId = (i) => `${listId}-opt-${i}`;

  useEffect(() => {
    if (active >= 0) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
    // optionId only depends on listId, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const pick = (option) => {
    onChange(option.value);
    setText(option.label);
    setEditing(false);
    setOpen(false);
    setActive(-1);
  };

  const handleInput = (e) => {
    const next = e.target.value;
    setText(next);
    setEditing(true);
    setOpen(true);
    setActive(next.trim() ? 0 : -1);
    const exact = exactOption(options, next);
    onChange(exact ? exact.value : '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(0);
        return;
      }
      const count = matches.length;
      if (!count) return;
      setActive((i) => (e.key === 'ArrowDown' ? (i + 1) % count : (i <= 0 ? count - 1 : i - 1)));
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && matches[active]) {
        e.preventDefault();
        pick(matches[active]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  };

  // Tells the parent whether something was typed that matches no item, so it
  // can say so straight away rather than on submit.
  const handleBlur = () => {
    setOpen(false);
    setActive(-1);
    let unmatched = false;
    if (editing) {
      const exact = exactOption(options, text);
      if (exact) pick(exact);
      else unmatched = Boolean(text.trim());
    }
    onBlur?.({ unmatched });
  };

  const showNoMatch = open && editing && text.trim() && matches.length === 0;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0 ? 'true' : 'false'}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 && matches[active] ? optionId(active) : undefined}
        aria-required={required ? 'true' : undefined}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        placeholder={placeholder}
        disabled={disabled}
        value={shown}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cx(className, 'pr-11 disabled:cursor-not-allowed disabled:bg-page')}
      />
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body" aria-hidden="true" />

      <ul
        id={listId}
        role="listbox"
        hidden={!(open && matches.length > 0)}
        className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-line-strong bg-white py-1 shadow-lg"
      >
        {matches.map((option, i) => (
          <li
            key={option.value}
            id={optionId(i)}
            role="option"
            aria-selected={option.value === value ? 'true' : 'false'}
            // Keep focus in the text box, so picking does not count as leaving it.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(option)}
            onMouseMove={() => active !== i && setActive(i)}
            className={cx(
              'flex min-h-11 cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5 text-base text-ink',
              i === active && 'bg-biz-pale',
              option.value === value && 'font-semibold',
            )}
          >
            <span className="min-w-0 break-words">{option.label}</span>
            {option.sublabel && <span className="shrink-0 text-sm text-body">{option.sublabel}</span>}
          </li>
        ))}
      </ul>

      {showNoMatch && (
        <p className="absolute left-0 right-0 z-30 mt-1 rounded-xl border border-line-strong bg-white px-4 py-3 text-sm text-body shadow-lg" aria-live="polite">
          {noMatchText}
        </p>
      )}
    </div>
  );
}
