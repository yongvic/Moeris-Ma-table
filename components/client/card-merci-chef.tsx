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

export function CardMerciChef({
  copy,
  stars,
}: {
  copy: MerciCopy;
  stars: number;
}) {
  const reduce = useReducedMotion();
  const celebrate = copy.tone === "super";

  return (
    <article className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-xl)] border border-accent-soft bg-gradient-to-b from-accent-soft/60 to-surface-base px-6 py-10 text-center shadow-card sm:py-14">
      <div className="pattern-wash opacity-40" aria-hidden />

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

        <div
          className="mt-1 flex gap-1"
          role="img"
          aria-label={`Note : ${stars} sur 5`}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={26}
              weight={n <= stars ? "fill" : "regular"}
              className={n <= stars ? "text-accent" : "text-border-strong"}
            />
          ))}
        </div>
      </motion.div>
    </article>
  );
}
