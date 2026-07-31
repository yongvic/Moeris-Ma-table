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
  Storefront,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { submitReviewAction } from "@/domain/review/actions";

const HIGHLIGHTS: { token: string; label: string; icon: Icon }[] = [
  { token: "cuisine", label: "La cuisine", icon: ForkKnife },
  { token: "accueil", label: "L'accueil", icon: HandHeart },
  { token: "ambiance", label: "L'ambiance", icon: Sparkle },
  { token: "chef", label: "Le chef", icon: Crown },
  { token: "cadre", label: "Le cadre", icon: Storefront },
];

const STAR_HINTS = ["", "Bof", "Moyen", "Bien", "Très bien", "Parfait"];

function RatingRow({
  label,
  icon: IconCmp,
  value,
  onChange,
}: {
  label: string;
  icon: Icon;
  value: number;
  onChange: (n: number) => void;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(0);
  const displayed = hovered || value;

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border/70 bg-surface-base p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[15px] font-bold text-ink-primary">
          <IconCmp size={18} weight="fill" className="text-accent-deep" />
          {label}
        </span>
        <span className="h-4 text-xs font-bold text-accent-deep">
          {STAR_HINTS[displayed] ?? ""}
        </span>
      </div>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={`${label} : note sur 5 étoiles`}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= displayed;
          return (
            <motion.button
              key={n}
              type="button"
              aria-label={`${label} : ${n} étoile${n > 1 ? "s" : ""}`}
              aria-pressed={value === n}
              onMouseEnter={() => setHovered(n)}
              onClick={() => onChange(n)}
              whileTap={reduce ? undefined : { scale: 0.85 }}
              className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <Star
                size={32}
                weight={on ? "fill" : "regular"}
                className={on ? "text-accent" : "text-border-strong"}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function AvisForm() {
  const router = useRouter();
  const [starsMeal, setStarsMeal] = useState(0);
  const [starsService, setStarsService] = useState(0);
  const [starsPlace, setStarsPlace] = useState(0);
  const [comment, setComment] = useState("");
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleHighlight(token: string) {
    setHighlights((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });
  }

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!starsMeal || !starsService || !starsPlace) {
          setError("Note le repas, le service et le restaurant avant d'envoyer.");
          return;
        }
        setError(null);
        startTransition(async () => {
          const res = await submitReviewAction({
            starsMeal,
            starsService,
            starsPlace,
            comment,
            highlights: [...highlights],
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          router.push("/merci");
        });
      }}
    >
      <section aria-label="Notes" className="flex flex-col gap-3">
        <p className="font-display text-[20px] font-semibold text-ink-primary">
          Comment était ta soirée&nbsp;?
        </p>
        <div className="flex flex-col gap-3">
          <RatingRow
            label="Le repas"
            icon={ForkKnife}
            value={starsMeal}
            onChange={setStarsMeal}
          />
          <RatingRow
            label="Le service"
            icon={HandHeart}
            value={starsService}
            onChange={setStarsService}
          />
          <RatingRow
            label="Le restaurant"
            icon={Storefront}
            value={starsPlace}
            onChange={setStarsPlace}
          />
        </div>
      </section>

      <section aria-label="Coups de cœur" className="flex flex-col gap-3">
        <p className="text-[15px] font-bold text-ink-primary">
          Tes coups de cœur&nbsp;?{" "}
          <span className="font-normal text-ink-secondary">
            (plusieurs possibles)
          </span>
        </p>
        <div className="flex flex-wrap gap-2.5" role="group">
          {HIGHLIGHTS.map(({ token, label, icon: IconCmp }) => {
            const active = highlights.has(token);
            return (
              <button
                key={token}
                type="button"
                aria-pressed={active}
                onClick={() => toggleHighlight(token)}
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

      <section aria-labelledby="comment-label" className="flex flex-col gap-2">
        <label
          id="comment-label"
          htmlFor="review-comment"
          className="text-[15px] font-bold text-ink-primary"
        >
          Un mot pour l&apos;équipe&nbsp;?{" "}
          <span className="font-normal text-ink-secondary">(optionnel)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          rows={3}
          maxLength={500}
          placeholder="Ce qui t'a plu, ce qu'on peut améliorer…"
          className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface-base px-4 py-3 text-[16px] leading-6 text-ink-primary placeholder:text-ink-secondary/60 transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span className="self-end text-xs text-ink-secondary">
          {comment.length}/500
        </span>
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
