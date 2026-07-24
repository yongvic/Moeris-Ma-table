"use client";

import type { ReactNode } from "react";

export const inputClass =
  "min-h-tap-min w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-base px-4 text-[16px] font-medium text-ink-primary placeholder:text-ink-secondary/60 transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

type Option<T extends string> = { value: T; label: string; icon?: ReactNode };

/** Segmented pill toggle with a single active choice. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border border-border bg-surface-raised/60 p-1"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-5 text-sm font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              active
                ? "bg-accent text-ink-onaccent shadow-soft"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Field wrapper — label above input (never placeholder-as-label). */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-ink-primary">{label}</span>
      {children}
      {hint ? <span className="text-xs text-ink-secondary">{hint}</span> : null}
    </label>
  );
}
