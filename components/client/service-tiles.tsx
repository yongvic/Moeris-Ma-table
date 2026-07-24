"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createServiceRequestAction } from "@/domain/service/actions";

const TILES = [
  { type: "WAITER", icon: "🙋", label: "Serveur" },
  { type: "WATER", icon: "💧", label: "Eau" },
  { type: "BILL", icon: "🧾", label: "Addition" },
  { type: "OTHER", icon: "•••", label: "Autre" },
] as const;

export function ServiceTiles() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-ink-primary">
        Un tap suffit — l'équipe est prévenue.
      </p>
      <div
        className="grid grid-cols-2 gap-3"
        role="group"
        aria-label="Micro-missions service"
      >
        {TILES.map((tile) => (
          <button
            key={tile.type}
            type="button"
            disabled={pending}
            aria-label={`Demander : ${tile.label}`}
            className={`flex min-h-tap-min flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface-base p-4 text-ink-primary shadow-[var(--elevation-soft)] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60 ${
              sent === tile.type ? "border-accent bg-accent-soft" : ""
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
            <span className="text-3xl" aria-hidden>
              {tile.icon}
            </span>
            <span className="text-sm font-semibold">{tile.label}</span>
            {sent === tile.type ? (
              <span className="text-xs font-normal text-ink-secondary">
                ✓ Envoyé
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-sm text-ink-secondary" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
