"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HandWaving,
  Drop,
  Receipt,
  DotsThreeOutline,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { createServiceRequestAction } from "@/domain/service/actions";

const TILES: { type: string; icon: Icon; label: string; hint: string }[] = [
  { type: "WAITER", icon: HandWaving, label: "Serveur", hint: "Quelqu'un vient te voir" },
  { type: "WATER", icon: Drop, label: "Eau", hint: "On t'apporte de l'eau" },
  { type: "BILL", icon: Receipt, label: "Addition", hint: "On prépare la note" },
  { type: "OTHER", icon: DotsThreeOutline, label: "Autre", hint: "Un besoin particulier" },
];

export function ServiceTiles() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-4">
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        role="group"
        aria-label="Micro-missions service"
      >
        {TILES.map((tile) => {
          const isSent = sent === tile.type;
          const IconCmp = tile.icon;
          return (
            <button
              key={tile.type}
              type="button"
              disabled={pending}
              aria-label={`Demander : ${tile.label}`}
              className={`group relative flex min-h-[128px] flex-col items-start justify-between gap-3 overflow-hidden rounded-[var(--radius-lg)] border p-5 text-left shadow-card transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-70 ${
                isSent
                  ? "border-accent bg-accent-soft"
                  : "border-border/70 bg-surface-base"
              }`}
              onClick={() => {
                startTransition(async () => {
                  setError(null);
                  const res = await createServiceRequestAction(tile.type);
                  if (!res.ok) {
                    setError(res.message);
                    return;
                  }
                  setSent(tile.type);
                  router.refresh();
                });
              }}
            >
              <span
                className={`grid size-12 place-items-center rounded-full transition-colors ${
                  isSent
                    ? "bg-accent text-ink-onaccent"
                    : "bg-accent-soft text-accent-deep group-hover:bg-accent group-hover:text-ink-onaccent"
                }`}
              >
                <IconCmp size={26} weight="fill" />
              </span>
              <div>
                <p className="font-display text-[18px] font-semibold text-ink-primary">
                  {tile.label}
                </p>
                <p className="text-[13px] text-ink-secondary">
                  {isSent ? "L'équipe est prévenue" : tile.hint}
                </p>
              </div>
              {isSent ? (
                <CheckCircle
                  size={22}
                  weight="fill"
                  className="absolute right-4 top-4 text-accent-deep"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
