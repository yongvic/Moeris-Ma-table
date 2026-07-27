"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import { inputClass } from "@/components/ui/form";

type CountryOption = {
  value?: Country;
  label: string;
};

type PhoneCountrySelectProps = {
  name?: string;
  value?: Country;
  onChange: (value?: Country) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: CountryOption[];
  iconComponent: ElementType<{ country?: Country; label: string }>;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number | string;
  className?: string;
};

/** Sélecteur pays avec recherche (remplace le `<select>` natif). */
export const PhoneCountrySelect = forwardRef<
  HTMLButtonElement,
  PhoneCountrySelectProps
>(function PhoneCountrySelect(
  {
    value,
    onChange,
    onFocus,
    onBlur,
    options,
    iconComponent: Icon,
    disabled,
    className,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const countries = useMemo(
    () => options.filter((option): option is CountryOption & { value: Country } => Boolean(option.value)),
    [options],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;

    const digits = q.replace(/\D/g, "");
    return countries.filter((option) => {
      const dial = getCountryCallingCode(option.value);
      return (
        option.label.toLowerCase().includes(q) ||
        (digits.length > 0 && dial.includes(digits)) ||
        `+${dial}`.includes(q.replace(/\s/g, ""))
      );
    });
  }, [countries, query]);

  const selected = countries.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`phone-country-select ${className ?? ""}`.trim()}
    >
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          selected
            ? `${selected.label}, indicatif +${getCountryCallingCode(selected.value)}`
            : "Choisir un pays"
        }
        className="phone-country-select__trigger"
        onClick={() => {
          if (disabled) return;
          const next = !open;
          setOpen(next);
          if (next) onFocus?.();
          else close();
        }}
      >
        {value ? (
          <>
            <Icon country={value} label={selected?.label ?? ""} />
            <span className="phone-country-select__dial">
              +{getCountryCallingCode(value)}
            </span>
          </>
        ) : (
          <span className="phone-country-select__dial">+…</span>
        )}
      </button>

      {open ? (
        <div className="phone-country-select__panel">
          <label htmlFor={searchId} className="sr-only">
            Rechercher un pays
          </label>
          <div className="phone-country-select__search">
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="phone-country-select__search-icon"
              aria-hidden
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un pays…"
              autoComplete="off"
              autoFocus
              className={`${inputClass} phone-country-select__search-input`}
            />
          </div>

          <ul className="phone-country-select__list" role="listbox">
            {filtered.length === 0 ? (
              <li className="phone-country-select__empty" role="presentation">
                Aucun pays trouvé
              </li>
            ) : (
              filtered.map((option) => (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    className="phone-country-select__option"
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                  >
                    <Icon country={option.value} label={option.label} />
                    <span className="phone-country-select__option-label">
                      {option.label}
                    </span>
                    <span className="phone-country-select__option-dial">
                      +{getCountryCallingCode(option.value)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
});
