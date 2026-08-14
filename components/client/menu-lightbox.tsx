"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  X,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import type { MenuPageImage } from "@/domain/menu/image-menu";

type MenuLightboxProps = {
  pages: MenuPageImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export function MenuLightbox({
  pages,
  initialIndex,
  isOpen,
  onClose,
}: MenuLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  const total = pages.length;
  const currentPage = pages[index];

  const goNext = useCallback(() => {
    if (index < total - 1) {
      setIndex((prev) => prev + 1);
      setIsZoomed(false);
    }
  }, [index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setIsZoomed(false);
    }
  }, [index]);

  // Raccourcis clavier (Flèches & Échap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };

    // Bloquer le défilement du fond
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  // Support des gestes Swipe mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40) {
      goNext();
    } else if (diff < -40) {
      goPrev();
    }

    setTouchStartX(null);
  };

  if (!isOpen || !currentPage) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex flex-col justify-between bg-black/96 p-2.5 text-white backdrop-blur-xl transition-opacity duration-300 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Affichage grand écran du menu"
    >
      {/* En-tête Modale (Mobile & Desktop) */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 pt-1 px-1">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent-light">
            {index + 1} / {total}
          </span>
          <h2 className="truncate font-display text-sm font-semibold text-white sm:text-base">
            {currentPage.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed((z) => !z)}
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 sm:size-10"
            aria-label={isZoomed ? "Réduire l'image" : "Agrandir l'image"}
          >
            {isZoomed ? <MagnifyingGlassMinus size={18} /> : <MagnifyingGlassPlus size={18} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-accent text-ink-onaccent transition-all hover:bg-accent-dark active:scale-95 sm:size-10"
            aria-label="Fermer le grand écran"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Zone Image Centrale Principale */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-auto py-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Bouton Flèche Précédent */}
        {index > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 active:scale-95 sm:left-4 sm:size-12"
            aria-label="Page précédente"
          >
            <CaretLeft size={22} weight="bold" />
          </button>
        ) : null}

        {/* Image du menu */}
        <div
          className={`relative transition-all duration-300 ${
            isZoomed
              ? "h-auto w-full max-w-none cursor-zoom-out overflow-auto"
              : "flex max-h-[82vh] w-full max-w-3xl items-center justify-center cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((z) => !z)}
        >
          <Image
            src={currentPage.src}
            alt={currentPage.alt}
            width={1000}
            height={1400}
            priority
            sizes="100vw"
            className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
          />
        </div>

        {/* Bouton Flèche Suivant */}
        {index < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 active:scale-95 sm:right-4 sm:size-12"
            aria-label="Page suivante"
          >
            <CaretRight size={22} weight="bold" />
          </button>
        ) : null}
      </div>

      {/* Barre Inférieure */}
      <div className="flex flex-col gap-2 border-t border-white/10 pt-2.5">
        {/* Navigation Vignettes sur Desktop */}
        <div className="hidden items-center justify-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setIsZoomed(false);
              }}
              className={`relative h-11 w-9 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === index
                  ? "scale-105 border-accent ring-2 ring-accent/50"
                  : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Puces de navigation sur Mobile */}
        <div className="flex items-center justify-center gap-1.5 sm:hidden">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Aller à ${p.title}`}
              onClick={() => {
                setIndex(i);
                setIsZoomed(false);
              }}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-white/60">
          Glisse vers la gauche ou la droite pour changer de page · Touche pour zoomer
        </p>
      </div>
    </div>
  );
}
