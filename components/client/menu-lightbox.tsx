"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  X,
  ArrowsOutSimple,
  MagnifyingGlassPlus,
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

    // Empêcher le scroll du body quand la modale est ouverte
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  // Gestes Swipe mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Seuil de swipe 50px
    if (diff > 50) {
      goNext();
    } else if (diff < -50) {
      goPrev();
    }

    setTouchStartX(null);
  };

  if (!isOpen || !currentPage) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex flex-col justify-between bg-black/92 p-3 text-white backdrop-blur-md transition-opacity duration-300 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Affichage grand écran du menu"
    >
      {/* Barre supérieure Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 pt-1">
        <div className="flex items-center gap-2 overflow-hidden">
          {currentPage.tag ? (
            <span className="shrink-0 rounded-full bg-accent/90 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-black">
              {currentPage.tag}
            </span>
          ) : null}
          <h2 className="truncate font-display text-[15px] font-semibold text-white sm:text-[18px]">
            {currentPage.title}
          </h2>
          <span className="shrink-0 text-xs text-white/60">
            ({index + 1} / {total})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed((z) => !z)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            title={isZoomed ? "Réduire" : "Agrandir"}
            aria-label={isZoomed ? "Réduire la taille" : "Zoomer la taille"}
          >
            {isZoomed ? <ArrowsOutSimple size={20} /> : <MagnifyingGlassPlus size={20} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            aria-label="Fermer le grand écran"
          >
            <X size={22} weight="bold" />
          </button>
        </div>
      </div>

      {/* Zone Image Centrale */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-auto py-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Bouton Précédent Desktop/Mobile */}
        {index > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/90 sm:left-4 sm:size-12"
            aria-label="Photo précédente"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
        ) : null}

        {/* Image Principale */}
        <div
          className={`relative transition-all duration-300 ${
            isZoomed
              ? "h-auto w-full max-w-none cursor-zoom-out"
              : "flex max-h-[80vh] w-full max-w-4xl justify-center cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((z) => !z)}
        >
          <Image
            src={currentPage.src}
            alt={currentPage.alt}
            width={1200}
            height={1700}
            priority
            sizes="100vw"
            className="max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl"
          />
        </div>

        {/* Bouton Suivant Desktop/Mobile */}
        {index < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/90 sm:right-4 sm:size-12"
            aria-label="Photo suivante"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        ) : null}
      </div>

      {/* Barre d'onglets / vignettes en bas */}
      <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setIsZoomed(false);
              }}
              className={`relative h-12 w-10 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === index
                  ? "scale-105 border-accent ring-2 ring-accent/50"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-center text-[11px] text-white/50">
          Utilise les flèches ou glisse vers la gauche/droite pour défiler. Touche pour zoomer.
        </p>
      </div>
    </div>
  );
}
