"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { tasteLabel } from "@/domain/order/tastes";

export function BlocMemoire({
  preferences,
  rememberedTastes,
}: {
  preferences: { menuItemId: string; label: string; rank: number }[];
  rememberedTastes: string[];
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <section
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-accent-soft bg-gradient-to-br from-accent-soft/70 to-surface-raised/50 p-5 shadow-soft sm:p-6"
      aria-label="Bon retour — ta mémoire"
    >
      <button
        type="button"
        aria-label="Masquer ma mémoire"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
      >
        <X size={18} weight="bold" />
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="relative size-[76px] shrink-0 overflow-hidden rounded-full bg-surface-base ring-2 ring-surface-base shadow-soft">
          <Image
            src="/img/illus-memoire.png"
            alt=""
            fill
            sizes="76px"
            className="object-cover"
          />
        </span>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="font-display text-[22px] font-semibold leading-7 text-ink-primary">
              Bon retour.
            </p>
            <p className="text-[14px] text-ink-secondary">
              On a gardé tes préférés de la dernière fois.
            </p>
          </div>

          {preferences.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <li key={pref.menuItemId}>
                  <Link
                    href={`/menu/${pref.menuItemId}`}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-surface-base px-4 text-sm font-bold text-ink-primary shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <ForkKnife size={15} weight="fill" className="text-accent-deep" />
                    {pref.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">
              Pas encore de préférés. Ils apparaîtront après ta première commande.
            </p>
          )}

          {rememberedTastes.length > 0 ? (
            <p className="text-[13px] text-ink-secondary">
              Tes goûts :{" "}
              <span className="font-semibold text-ink-primary">
                {rememberedTastes.map(tasteLabel).join(", ")}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
