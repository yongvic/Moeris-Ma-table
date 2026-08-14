"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
  MagnifyingGlassPlus,
  Funnel,
  Hamburger,
  ForkKnife,
  Crown,
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

  // Helper Icônes Phosphor pour chaque catégorie
  const renderCategoryIcon = (iconName: string, isActive: boolean) => {
    const weight = isActive ? "fill" : "bold";
    const size = 18;
    if (iconName === "hamburger") return <Hamburger size={size} weight={weight} />;
    if (iconName === "fork-knife") return <ForkKnife size={size} weight={weight} />;
    if (iconName === "crown") return <Crown size={size} weight={weight} />;
    return <Sparkle size={size} weight={weight} />;
  };

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      {/* Barre de Sélection des Catégories (Univers) — 100% Responsive */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
          <Sparkle size={14} weight="fill" className="text-accent-dark" />
          <span>Univers culinaire</span>
        </div>

        {/* Grille responsive sur mobile & desktop */}
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border/80 bg-surface-raised/60 p-1.5 shadow-inner sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:bg-transparent sm:p-0 sm:border-0 sm:shadow-none">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = pages.filter((p) => p.category === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-2 text-center text-xs font-bold transition-all duration-300 sm:flex-row sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "bg-accent text-ink-onaccent shadow-lift ring-2 ring-accent/60"
                    : "bg-surface-base text-ink-secondary hover:bg-surface-raised hover:text-ink-primary sm:border sm:border-border/80"
                }`}
              >
                <div className="flex items-center gap-1">
                  {renderCategoryIcon(cat.iconName, isActive)}
                  <span className="truncate">{cat.label}</span>
                </div>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold sm:px-2 sm:py-0.5 sm:text-[11px] ${
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
        </div>

        {/* Bouton secondaire Tout Voir */}
        <div className="flex items-center justify-between gap-2">
          {currentCategoryInfo ? (
            <p className="truncate text-xs font-medium text-ink-secondary">
              {currentCategoryInfo.description}
            </p>
          ) : (
            <p className="text-xs font-medium text-ink-secondary">
              Toutes les cartes consultables
            </p>
          )}

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === "all" ? "fast_food" : "all")}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
              activeCategory === "all"
                ? "bg-accent text-ink-onaccent"
                : "bg-surface-raised text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Funnel size={13} weight="bold" />
            <span>{activeCategory === "all" ? "Filtrer" : `Tout (${pages.length})`}</span>
          </button>
        </div>
      </div>

      {/* En-tête carrousel : Titre page + Compteur + Boutons de navigation */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-sm font-bold text-ink-primary sm:text-base">
            {filteredPages[index]?.title || "Menu Moeris"}
          </p>
          <p className="text-xs font-medium text-ink-secondary">
            Page {index + 1} sur {total}
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Page précédente"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className="grid size-9 place-items-center rounded-full border border-border bg-surface-base text-ink-primary shadow-soft transition-colors hover:bg-surface-raised disabled:opacity-40 sm:size-10"
          >
            <CaretLeft size={16} weight="bold" className="sm:size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Page suivante"
            disabled={index === total - 1}
            onClick={() => goTo(index + 1)}
            className="grid size-9 place-items-center rounded-full border border-border bg-surface-base text-ink-primary shadow-soft transition-colors hover:bg-surface-raised disabled:opacity-40 sm:size-10"
          >
            <CaretRight size={16} weight="bold" className="sm:size-[18px]" />
          </button>
        </div>
      </div>

      {/* Carrousel d'Images (sans stickers/tags) */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
        role="region"
        aria-label="Pages de la carte"
      >
        {filteredPages.map((page, i) => (
          <div
            key={page.id}
            onClick={() => openLightboxAt(i)}
            className="group relative w-[min(100%,26rem)] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-border/80 bg-surface-base shadow-card transition-all duration-300 hover:border-accent hover:shadow-lift sm:w-[min(100%,30rem)]"
          >
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
                sizes="(max-width: 640px) 100vw, 480px"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Pied de Carte avec Titre & CTA Grand Écran */}
            <div className="flex items-center justify-between border-t border-border/60 bg-surface-base/95 p-3 backdrop-blur-sm sm:p-3.5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-ink-primary sm:text-[13px]">
                  {page.title}
                </span>
                <span className="text-[11px] font-medium text-ink-secondary">
                  Touche pour ouvrir en grand écran
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-ink-primary group-hover:bg-accent group-hover:text-ink-onaccent sm:px-3 sm:py-1.5 sm:text-xs">
                <MagnifyingGlassPlus size={14} weight="bold" />
                <span>Grand écran</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation par puces (Dots) */}
      <div
        className="flex flex-wrap items-center justify-center gap-1.5"
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
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-7 bg-accent"
                : "w-2 bg-border-strong hover:bg-ink-secondary/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-secondary">
        Astuce : Glisse pour tourner les pages ou clique sur une photo pour l'afficher en grand écran.
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
