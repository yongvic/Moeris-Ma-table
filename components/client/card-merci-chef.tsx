"use client";

import { motion, useReducedMotion } from "motion/react";
import { Star, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Illustration } from "@/components/ui/illustration";
import type { MerciCopy } from "@/domain/review/merci-tone";

const EASE = [0.16, 1, 0.3, 1] as const;

const SPARKS = [
  { top: "6%", left: "12%", size: 18, delay: 0.2 },
  { top: "14%", left: "82%", size: 24, delay: 0.35 },
  { top: "40%", left: "4%", size: 14, delay: 0.5 },
  { top: "48%", left: "92%", size: 20, delay: 0.45 },
  { top: "72%", left: "16%", size: 16, delay: 0.6 },
  { top: "80%", left: "80%", size: 22, delay: 0.3 },
];

function StarLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[14px] font-bold text-ink-primary">{label}</span>
      <span
        className="flex gap-0.5"
        role="img"
        aria-label={`${label} : ${value} sur 5`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={20}
            weight={n <= value ? "fill" : "regular"}
            className={n <= value ? "text-accent" : "text-border-strong"}
          />
        ))}
      </span>
    </div>
  );
}

export function CardMerciChef({
  copy,
  stars,
  starsService,
  starsPlace,
}: {
  copy: MerciCopy;
  stars: number;
  starsService?: number | null;
  starsPlace?: number | null;
}) {
  const reduce = useReducedMotion();
  const celebrate = copy.tone === "super";

  return (
    <article className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-xl)] border border-accent-soft bg-gradient-to-b from-accent-soft/60 to-surface-base px-6 py-10 text-center shadow-card sm:py-14">
      <div className="pattern-wash opacity-[0.22]" aria-hidden />

      {celebrate && !reduce
        ? SPARKS.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute text-accent"
              style={{ top: s.top, left: s.left }}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{
                opacity: [0, 1, 0.7, 1],
                scale: [0, 1.1, 0.9, 1],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            >
              <Sparkle size={s.size} weight="fill" />
            </motion.span>
          ))
        : null}

      <motion.div
        className="relative z-[1]"
        initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Illustration variant="merci" priority className="max-w-[300px]" />
      </motion.div>

      <motion.div
        className="relative z-[1] flex flex-col items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
      >
        <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent-deep">
          Merci chef
        </span>
        <h1 className="max-w-lg font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink-primary sm:text-[40px]">
          {copy.title}
        </h1>
        <p className="max-w-md text-[17px] leading-7 text-ink-secondary">
          {copy.body}
        </p>

        <div className="mt-2 flex w-full max-w-[280px] flex-col gap-2.5 rounded-[var(--radius-lg)] border border-accent-soft bg-surface-base/70 p-4">
          <StarLine label="Le repas" value={stars} />
          {typeof starsService === "number" ? (
            <StarLine label="Le service" value={starsService} />
          ) : null}
          {typeof starsPlace === "number" ? (
            <StarLine label="Le restaurant" value={starsPlace} />
          ) : null}
        </div>
      </motion.div>
    </article>
  );
}
