"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Star,
  ForkKnife,
  HandHeart,
  Sparkle,
  Crown,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { submitReviewAction } from "@/domain/review/actions";

const HIGHLIGHTS: { token: string; label: string; icon: Icon }[] = [
  { token: "cuisine", label: "La cuisine", icon: ForkKnife },
  { token: "accueil", label: "L'accueil", icon: HandHeart },
  { token: "ambiance", label: "L'ambiance", icon: Sparkle },
  { token: "chef", label: "Le chef", icon: Crown },
];

const STAR_HINTS = ["", "Bof", "Moyen", "Bien", "Très bien", "Parfait"];

export function AvisForm() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const displayed = hoveredStar || stars;

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!stars) {
          setError("Choisis une note avant d'envoyer.");
          return;
        }
        setError(null);
        startTransition(async () => {
          const res = await submitReviewAction({
            stars,
            dishEmoji: highlight ?? undefined,
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          router.push("/fin/merci");
        });
      }}
    >
      <section
        aria-label="Note"
        className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-6 text-center shadow-card"
      >
        <p className="font-display text-[20px] font-semibold text-ink-primary">
          Comment était ton repas&nbsp;?
        </p>
        <div
          className="flex gap-1.5"
          role="radiogroup"
          aria-label="Note sur 5 étoiles"
          onMouseLeave={() => setHoveredStar(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= displayed;
            return (
              <motion.button
                key={n}
                type="button"
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                aria-pressed={stars === n}
                onMouseEnter={() => setHoveredStar(n)}
                onClick={() => setStars(n)}
                whileTap={reduce ? undefined : { scale: 0.85 }}
                animate={
                  reduce
                    ? undefined
                    : { scale: on && stars === n ? [1, 1.25, 1] : 1 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <Star
                  size={40}
                  weight={on ? "fill" : "regular"}
                  className={on ? "text-accent" : "text-border-strong"}
                />
              </motion.button>
            );
          })}
        </div>
        <p className="h-5 text-sm font-bold text-accent-deep" aria-live="polite">
          {STAR_HINTS[displayed] ?? ""}
        </p>
      </section>

      <section aria-label="Coup de cœur" className="flex flex-col gap-3">
        <p className="text-[15px] font-bold text-ink-primary">
          Un coup de cœur&nbsp;?{" "}
          <span className="font-normal text-ink-secondary">(optionnel)</span>
        </p>
        <div className="flex flex-wrap gap-2.5" role="group">
          {HIGHLIGHTS.map(({ token, label, icon: IconCmp }) => {
            const active = highlight === token;
            return (
              <button
                key={token}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setHighlight((prev) => (prev === token ? null : token))
                }
                className={`inline-flex min-h-tap-min items-center gap-2 rounded-full px-4 text-[15px] font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                  active
                    ? "bg-accent text-ink-onaccent shadow-soft"
                    : "border border-border bg-surface-base text-ink-secondary hover:border-border-strong hover:text-ink-primary"
                }`}
              >
                <IconCmp size={17} weight="fill" />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {error ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {error}
        </p>
      ) : null}

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
        {pending ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </form>
  );
}
