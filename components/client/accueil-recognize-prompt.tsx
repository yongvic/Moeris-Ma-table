"use client";

import { useState } from "react";
import { UserCircle, X } from "@phosphor-icons/react/dist/ssr";
import { RecognizeForm } from "@/components/client/recognize-form";

/** Accueil — ressaisie de contact quand le cookie soft est absent. */
export function AccueilRecognizePrompt() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[14px] text-ink-secondary sm:justify-start sm:text-left">
        <span className="inline-flex items-center gap-1.5">
          <UserCircle size={18} weight="fill" className="text-accent-deep" />
          Déjà venu·e ?
        </span>
        <button
          type="button"
          className="font-bold text-ink-primary underline underline-offset-4 decoration-accent transition-colors hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          onClick={() => setOpen(true)}
        >
          Retrouve tes préférés
        </button>
      </div>
    );
  }

  return (
    <section
      className="rounded-[var(--radius-lg)] border border-border bg-surface-raised/50 p-5 shadow-soft sm:p-6"
      aria-label="Ressaisie de contact"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-[20px] font-semibold text-ink-primary">
            Retrouve-toi
          </h2>
          <p className="text-sm text-ink-secondary">
            Ton téléphone ou ton email suffit — pas de mot de passe.
          </p>
        </div>
        <button
          type="button"
          aria-label="Fermer"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
          onClick={() => setOpen(false)}
        >
          <X size={18} weight="bold" />
        </button>
      </div>
      <RecognizeForm />
    </section>
  );
}
