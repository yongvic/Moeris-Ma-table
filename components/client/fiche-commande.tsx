"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { placeOrderAction } from "@/domain/order/place-order";
import { TASTE_CHIPS, tasteLabel } from "@/domain/order/tastes";
import { reapplyRememberedTastesAction } from "@/domain/guest/memory-actions";

export function FicheCommande({
  item,
  initialTastes,
  rememberedTastes = [],
}: {
  item: { id: string; name: string; priceCents: number; photoUrl: string | null };
  initialTastes: string[];
  rememberedTastes?: string[];
}) {
  const router = useRouter();
  const [tastes, setTastes] = useState<Set<string>>(new Set(initialTastes));
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reapplied, setReapplied] = useState(false);

  function toggle(key: string) {
    setTastes((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  if (success) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-6 px-margin-mobile py-10"
        aria-live="polite"
      >
        <span className="text-6xl" aria-hidden>
          🥘
        </span>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-display text-[22px] font-semibold text-ink-primary">
            C'est parti !
          </p>
          <p className="max-w-sm text-base text-ink-secondary">
            Ta commande est enregistrée — on s'en occupe.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-tap-min items-center justify-center rounded-md border border-border px-5 text-base font-bold text-ink-primary"
          onClick={() => router.push("/menu")}
        >
          Retour à la carte
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await placeOrderAction({
            menuItemId: item.id,
            tastes: [...tastes],
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          setSuccess(true);
          router.refresh();
        });
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Ma commande
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          {item.name}
        </h1>
      </div>

      <section aria-labelledby="tastes-label">
        <p
          id="tastes-label"
          className="mb-3 text-sm font-semibold text-ink-primary"
        >
          Goûts cuisine{" "}
          <span className="font-normal text-ink-secondary">(optionnel)</span>
        </p>
        {rememberedTastes.length > 0 && !reapplied ? (
          <button
            type="button"
            disabled={pending}
            className="mb-3 inline-flex min-h-tap-min items-center rounded-md border border-border bg-accent-soft px-4 text-sm font-bold text-ink-primary disabled:opacity-60"
            onClick={() => {
              startTransition(async () => {
                const res = await reapplyRememberedTastesAction();
                if (!res.ok) {
                  setError(res.message);
                  return;
                }
                setTastes(new Set(res.tastes));
                setReapplied(true);
              });
            }}
          >
            Réappliquer mes goûts (
            {rememberedTastes.map(tasteLabel).join(", ")})
          </button>
        ) : null}
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="tastes-label">
          {TASTE_CHIPS.map((chip) => {
            const selected = tastes.has(chip.key);
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(chip.key)}
                className={`inline-flex min-h-tap-min items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                  selected
                    ? "bg-accent text-ink-primary"
                    : "bg-surface-raised/50 text-ink-secondary"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {error ? (
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="text-sm text-ink-secondary">{error}</p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary disabled:opacity-60"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Commander"}
        </button>
      )}
    </form>
  );
}
