"use client";

import { useState } from "react";
import { RecognizeForm } from "@/components/client/recognize-form";

/** Accueil — entry 5.2 when soft cookie absent. */
export function AccueilRecognizePrompt({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <p className="text-sm text-ink-secondary">
        <button
          type="button"
          className="font-semibold text-ink-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          onClick={() => setOpen(true)}
        >
          Déjà venu·e ?
        </button>{" "}
        Retrouve tes préférés avec ton téléphone ou email.
      </p>
    );
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-md border border-border bg-surface-raised/30 p-4"
      aria-label="Ressaisie de contact"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink-primary">
          Retrouve-toi
        </h2>
        <button
          type="button"
          className="min-h-tap-min text-sm text-ink-secondary underline"
          onClick={() => setOpen(false)}
        >
          Fermer
        </button>
      </div>
      <RecognizeForm sessionId={sessionId} />
    </section>
  );
}
