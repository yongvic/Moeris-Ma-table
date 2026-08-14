"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
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

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const total = pages.length;
  const currentPage = pages[index];

  const goNext = useCallback(() => {
    if (index < total - 1) setIndex((prev) => prev + 1);
  }, [index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) setIndex((prev) => prev - 1);
  }, [index]);

  // Raccourcis clavier (Flèches & Échap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };

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

    if (diff > 40) goNext();
    else if (diff < -40) goPrev();

    setTouchStartX(null);
  };

  if (!isOpen || !currentPage) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/95 p-3 backdrop-blur-md transition-opacity duration-300 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Affichage grand écran"
      onClick={onClose}
    >
      {/* Bouton Fermer X fixe en haut à droite */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed right-4 top-4 z-30 flex size-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 hover:bg-black/80 hover:scale-105"
        aria-label="Fermer"
      >
        <X size={24} weight="bold" />
      </button>

      {/* Flèche Précédent */}
      {index > 0 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="fixed left-3 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 hover:bg-black/80 sm:left-6 sm:size-12"
          aria-label="Photo précédente"
        >
          <CaretLeft size={26} weight="bold" />
        </button>
      ) : null}

      {/* Conteneur de l'image cliquée en grand */}
      <div
        className="relative flex max-h-[92vh] max-w-[95vw] items-center justify-center overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentPage.src}
          alt={currentPage.alt}
          width={1200}
          height={1600}
          priority
          sizes="100vw"
          className="max-h-[90vh] w-auto max-w-[95vw] rounded-lg object-contain shadow-2xl"
        />
      </div>

      {/* Flèche Suivant */}
      {index < total - 1 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="fixed right-3 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 hover:bg-black/80 sm:right-6 sm:size-12"
          aria-label="Photo suivante"
        >
          <CaretRight size={26} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
