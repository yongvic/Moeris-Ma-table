"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Check,
  ArrowClockwise,
  PaperPlaneTilt,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { placeOrderAction } from "@/domain/order/place-order";
import { TASTE_CHIPS, tasteLabel } from "@/domain/order/tastes";
import { reapplyRememberedTastesAction } from "@/domain/guest/memory-actions";
import { Illustration } from "@/components/ui/illustration";

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
  const reduce = useReducedMotion();
  const [tastes, setTastes] = useState<Set<string>>(new Set(initialTastes));
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reapplied, setReapplied] = useState(false);

  function toggle(key: string) {
    setTastes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (success) {
    return (
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center"
        aria-live="polite"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Illustration variant="commande" className="max-w-[260px]" priority />
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-display text-[26px] font-semibold text-ink-primary">
            C&apos;est parti.
          </h2>
          <p className="max-w-sm text-[16px] text-ink-secondary">
            Ta commande est en cuisine. On s&apos;occupe de tout, détends-toi.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/menu")}
            className="inline-flex min-h-tap-min items-center justify-center rounded-full border border-border bg-surface-raised px-6 text-[16px] font-bold text-ink-primary shadow-soft transition-transform active:scale-[0.98]"
          >
            Retour à la carte
          </button>
          <button
            type="button"
            onClick={() => router.push("/mes-commandes")}
            className="inline-flex min-h-tap-min items-center justify-center rounded-full bg-accent px-6 text-[16px] font-bold text-ink-onaccent shadow-glow transition-transform hover:bg-accent-deep active:scale-[0.98]"
          >
            Voir ma commande
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      className="flex flex-1 flex-col gap-7 pt-7"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await placeOrderAction({
            menuItemId: item.id,
            tastes: [...tastes],
            note,
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
      <section aria-labelledby="tastes-label" className="flex flex-col gap-3">
        <div>
          <p id="tastes-label" className="font-display text-[18px] font-semibold text-ink-primary">
            Un goût particulier ?
          </p>
          <p className="text-sm text-ink-secondary">
            Optionnel — dis-nous comment tu l&apos;aimes.
          </p>
        </div>

        {rememberedTastes.length > 0 && !reapplied ? (
          <button
            type="button"
            disabled={pending}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-accent bg-accent-soft/60 px-4 py-2 text-sm font-bold text-ink-primary transition-colors hover:bg-accent-soft disabled:opacity-60"
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
            <Sparkle size={16} weight="fill" className="text-accent-deep" />
            Réappliquer mes goûts ({rememberedTastes.map(tasteLabel).join(", ")})
          </button>
        ) : null}

        <div
          className="flex flex-wrap gap-2.5"
          role="group"
          aria-labelledby="tastes-label"
        >
          {TASTE_CHIPS.map((chip) => {
            const selected = tastes.has(chip.key);
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(chip.key)}
                className={`inline-flex min-h-tap-min items-center gap-2 rounded-full px-4 text-[15px] font-bold transition-[background-color,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                  selected
                    ? "bg-accent text-ink-onaccent shadow-soft"
                    : "border border-border bg-surface-base text-ink-secondary hover:border-border-strong hover:text-ink-primary"
                }`}
              >
                {selected ? (
                  <Check size={16} weight="bold" />
                ) : null}
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="note-label" className="flex flex-col gap-2">
        <label
          id="note-label"
          htmlFor="order-note"
          className="font-display text-[18px] font-semibold text-ink-primary"
        >
          Une particularité&nbsp;?
        </label>
        <p className="-mt-1 text-sm text-ink-secondary">
          Allergie, cuisson, ou une envie qui n&apos;est pas dans la liste —
          dis-le en quelques mots.
        </p>
        <textarea
          id="order-note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          rows={3}
          maxLength={280}
          placeholder="Ex : sans arachide, bien épicé, sauce à part…"
          className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface-base px-4 py-3 text-[16px] leading-6 text-ink-primary placeholder:text-ink-secondary/60 transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span className="self-end text-xs text-ink-secondary">
          {note.length}/280
        </span>
      </section>

      {error ? (
        <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-ember/40 bg-ember/5 p-4" aria-live="polite">
          <p className="text-sm font-semibold text-ember">{error}</p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-fit min-h-tap-min items-center gap-2 rounded-full bg-accent px-5 text-[16px] font-bold text-ink-onaccent disabled:opacity-60"
          >
            <ArrowClockwise size={17} weight="bold" />
            Réessayer
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-[17px] font-bold text-ink-onaccent shadow-glow transition-[transform,background-color] duration-300 hover:bg-accent-deep active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:self-start"
        >
          <PaperPlaneTilt
            size={19}
            weight="fill"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
          {pending ? "Envoi…" : "Envoyer ma commande"}
        </button>
      )}
    </form>
  );
}
