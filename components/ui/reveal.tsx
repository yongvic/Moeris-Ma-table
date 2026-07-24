"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index (0-based) — cascades entrance for lists. */
  index?: number;
  /** Entrance offset in px (default 18). */
  y?: number;
  /** Delay in seconds, added on top of index stagger. */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Warm entrance: fade + gentle rise, honoring reduced motion.
 * Content is visible by default (initial only applied when motion is allowed).
 */
export function Reveal({
  children,
  className = "",
  index = 0,
  y = 18,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: delay + index * 0.07, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
