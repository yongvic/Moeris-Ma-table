"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReviewAction } from "@/domain/review/actions";

const DISH_EMOJIS = ["🥘", "🍛", "🐟", "🌶️", "👨‍🍳"];

export function AvisForm() {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const displayed = hoveredStar || stars;

  return (
    <form
      className="flex flex-col gap-section-gap"
      onSubmit={(e) => {
        e.preventDefault();
        if (!stars) {
          setError("Choisis une note avant d'envoyer.");
          return;
        }
        setError(null);
        startTransition(async () => {
          const res = await submitReviewAction({
            stars,
            dishEmoji: emoji ?? undefined,
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          router.push("/fin/merci");
        });
      }}
    >
      {/* Stars */}
      <section aria-label="Note" className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-ink-primary">
          Comment était ton repas ?
        </p>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-label="Note sur 5 étoiles"
          onMouseLeave={() => setHoveredStar(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              aria-pressed={stars === n}
              onMouseEnter={() => setHoveredStar(n)}
              onClick={() => setStars(n)}
              className="text-3xl transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {n <= displayed ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </section>

      {/* Emoji plat — optionnel */}
      <section aria-label="Plat préféré" className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-ink-primary">
          Un plat en particulier ?{" "}
          <span className="font-normal text-ink-secondary">(optionnel)</span>
        </p>
        <div className="flex flex-wrap gap-2" role="group">
          {DISH_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={emoji === e}
              onClick={() => setEmoji((prev) => (prev === e ? null : e))}
              className={`flex size-12 items-center justify-center rounded-full text-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                emoji === e
                  ? "bg-accent"
                  : "bg-surface-raised/50"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <p className="text-sm text-ink-secondary" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer mon avis"}
      </button>

      <button
        type="button"
        className="text-sm text-ink-secondary underline underline-offset-2"
        onClick={() => router.push("/fin/merci")}
      >
        Passer
      </button>
    </form>
  );
}
