"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
  MagnifyingGlassPlus,
  Funnel,
  Sparkle,
} from "@phosphor-icons/react";
import {
  MENU_CATEGORIES,
  type MenuCategoryKey,
  type MenuPageImage,
} from "@/domain/menu/image-menu";
import { MenuLightbox } from "@/components/client/menu-lightbox";

type Props = {
  pages: MenuPageImage[];
};

export function MenuImageViewer({ pages }: Props) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey | "all">("fast_food");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Filtrer les pages par catégorie sélectionnée
  const filteredPages = activeCategory === "all"
    ? pages
    : pages.filter((p) => p.category === activeCategory);

  const currentCategoryInfo = MENU_CATEGORIES.find((c) => c.key === activeCategory);

  const total = filteredPages.length;

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

  // Re-synchroniser l'index au changement de catégorie
  useEffect(() => {
    setIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

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

  const openLightboxAt = (i: number) => {
    setSelectedPageIndex(i);
    setLightboxOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Barre de Sélection des Catégories (Onglets 3 ordres) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
            <Sparkle size={14} weight="fill" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
            Choisis ton univers
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = pages.filter((p) => p.category === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`group flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-ink-onaccent shadow-lift ring-2 ring-accent/60"
                    : "border border-border/80 bg-surface-base text-ink-secondary hover:border-border-strong hover:bg-surface-raised hover:text-ink-primary"
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    isActive
                      ? "bg-black/15 text-black"
                      : "bg-surface-raised text-ink-secondary"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-[13px] font-bold transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-accent text-ink-onaccent shadow-lift"
                : "border border-border/80 bg-surface-base text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
            }`}
          >
            <Funnel size={15} weight="bold" />
            <span>Tout voir ({pages.length})</span>
          </button>
        </div>

        {/* Description de la catégorie active */}
        {currentCategoryInfo ? (
          <div className="flex items-center justify-between rounded-xl bg-surface-raised/60 px-4 py-2 text-xs text-ink-secondary border border-border/50">
            <span>{currentCategoryInfo.description}</span>
            <span className="font-semibold text-accent-dark">
              {currentCategoryInfo.badge}
            </span>
          </div>
        ) : null}
      </div>

      {/* En-tête carrousel : Titre page + Compteur + Boutons de navigation */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-base font-bold text-ink-primary">
            {filteredPages[index]?.title || "Menu Moeris"}
          </p>
          <p className="text-xs font-semibold text-ink-secondary">
            Page {index + 1} sur {total} — Cliquer pour le Grand Écran
          </p>
        </div>

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

      {/* Carrousel d'Images avec Action Clic pour Grand Écran */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Pages de la carte"
      >
        {filteredPages.map((page, i) => (
          <div
            key={page.id}
            onClick={() => openLightboxAt(i)}
            className="group relative w-[min(100%,28rem)] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-border/80 bg-surface-base shadow-card transition-all duration-300 hover:border-accent hover:shadow-lift sm:w-[min(100%,32rem)]"
          >
            {/* Tag Badge */}
            {page.tag ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black shadow-md backdrop-blur-sm">
                {page.tag}
              </span>
            ) : null}

            {/* Bouton Agrandir Overlay */}
            <div className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-black">
              <ArrowsOutSimple size={18} weight="bold" />
            </div>

            {/* Image du Menu */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-raised">
              <Image
                src={page.src}
                alt={page.alt}
                width={900}
                height={1200}
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, 512px"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Pied de Carte avec Titre & CTA Grand Écran */}
            <div className="flex items-center justify-between border-t border-border/60 bg-surface-base/95 p-3.5 backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-ink-primary">
                  {page.title}
                </span>
                <span className="text-[11px] font-medium text-ink-secondary">
                  Touche pour ouvrir en grand écran
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-ink-primary group-hover:bg-accent group-hover:text-ink-onaccent">
                <MagnifyingGlassPlus size={15} weight="bold" />
                <span>Grand écran</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation par puces (Dots) */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Puces de navigation"
      >
        {filteredPages.map((page, i) => (
          <button
            key={page.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Aller à ${page.title}`}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-8 bg-accent"
                : "w-2.5 bg-border-strong hover:bg-ink-secondary/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-secondary">
        💡 Astuce : Fais glisser pour tourner les pages ou clique sur une photo pour l'afficher en plein écran.
      </p>

      {/* Modale Grand Écran */}
      <MenuLightbox
        pages={filteredPages}
        initialIndex={selectedPageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
