"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { MenuPageImage } from "@/domain/menu/image-menu";

type Props = {
  pages: MenuPageImage[];
};

/** Carrousel horizontal des pages de carte (swipe + flèches). */
export function MenuImageViewer({ pages }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = pages.length;

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      const el = scrollerRef.current;
      if (!el) return;
      const child = el.children[next] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setIndex(next);
    },
    [total],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const center = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (total === 0) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-sm font-bold text-ink-secondary">
          {pages[index]?.title}
          <span className="ml-2 font-medium text-ink-secondary/70">
            {index + 1} / {total}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Page précédente"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className="grid size-10 place-items-center rounded-full border border-border bg-surface-base text-ink-primary shadow-soft transition-colors hover:bg-surface-raised disabled:opacity-40"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Page suivante"
            disabled={index === total - 1}
            onClick={() => goTo(index + 1)}
            className="grid size-10 place-items-center rounded-full border border-border bg-surface-base text-ink-primary shadow-soft transition-colors hover:bg-surface-raised disabled:opacity-40"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Pages de la carte"
        aria-roledescription="carrousel"
      >
        {pages.map((page, i) => (
          <figure
            key={page.src}
            className="relative w-[min(100%,28rem)] shrink-0 snap-center overflow-hidden rounded-[var(--radius-lg)] border border-border/70 bg-surface-base shadow-card sm:w-[min(100%,34rem)]"
            aria-hidden={i !== index}
          >
            <Image
              src={page.src}
              alt={page.alt}
              width={900}
              height={1270}
              priority={i === 0}
              sizes="(max-width: 640px) 100vw, 544px"
              className="h-auto w-full object-contain"
            />
          </figure>
        ))}
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Navigation pages"
      >
        {pages.map((page, i) => (
          <button
            key={page.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Aller à ${page.title}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-accent"
                : "w-2 bg-border-strong hover:bg-ink-secondary/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-secondary">
        Glisse pour tourner les pages · pour commander, appelle le serveur
      </p>
    </div>
  );
}
