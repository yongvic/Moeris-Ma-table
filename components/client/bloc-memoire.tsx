"use client";

import { useState } from "react";
import Link from "next/link";

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
      className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised/40 p-4"
      aria-label="Bloc mémoire — bon retour"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-3xl" aria-hidden>
            🌟
          </span>
          <p className="mt-1 font-display text-lg font-semibold text-ink-primary">
            Bon retour !
          </p>
          <p className="text-sm text-ink-secondary">
            Tes préférés de la dernière fois :
          </p>
        </div>
        <button
          type="button"
          aria-label="Ignorer ma mémoire"
          onClick={() => setDismissed(true)}
          className="min-h-tap-min min-w-tap-min rounded-full text-ink-secondary hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          ✕
        </button>
      </div>

      {preferences.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {preferences.map((pref) => (
            <li key={pref.menuItemId}>
              <Link
                href={`/menu/${pref.menuItemId}`}
                className="inline-flex min-h-tap-min items-center rounded-full bg-accent-soft px-4 text-sm font-semibold text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {pref.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-secondary">
          Pas encore de préférés — commande et ils apparaîtront ici.
        </p>
      )}

      {rememberedTastes.length > 0 ? (
        <p className="text-xs text-ink-secondary">
          Goûts : {rememberedTastes.join(", ")}
        </p>
      ) : null}

      <button
        type="button"
        className="self-start text-sm text-ink-secondary underline underline-offset-2"
        onClick={() => setDismissed(true)}
      >
        Continuer sans ma mémoire
      </button>
    </section>
  );
}
