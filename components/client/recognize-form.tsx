"use client";

import { useState, useTransition } from "react";
import { recognizeByContactAction } from "@/domain/guest/memory-actions";
import Link from "next/link";

type Channel = "phone" | "email";

export function RecognizeForm({ sessionId: _sessionId }: { sessionId: string }) {
  const [channel, setChannel] = useState<Channel>("phone");
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    preferences: { menuItemId: string; label: string; rank: number }[];
    rememberedTastes: string[];
  } | null>(null);

  if (result) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <p className="font-semibold text-ink-primary">✓ Retrouvé !</p>
        {result.preferences.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-secondary">Tes préférés :</p>
            <ul className="flex flex-wrap gap-2">
              {result.preferences.map((p) => (
                <li key={p.menuItemId}>
                  <Link
                    href={`/menu/${p.menuItemId}`}
                    className="inline-flex min-h-tap-min items-center rounded-full bg-accent-soft px-4 text-sm font-semibold text-ink-primary"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-ink-secondary">
            Pas encore de préférés — ils apparaîtront après ta première commande.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await recognizeByContactAction({ channel, value });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          setResult({
            preferences: res.preferences,
            rememberedTastes: res.rememberedTastes,
          });
        });
      }}
    >
      <div className="flex gap-2" role="radiogroup" aria-label="Canal">
        {(["phone", "email"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={channel === c}
            onClick={() => { setChannel(c); setValue(""); }}
            className={`min-h-tap-min rounded-full px-4 text-sm font-semibold ${
              channel === c
                ? "bg-accent text-ink-primary"
                : "bg-surface-raised/50 text-ink-secondary"
            }`}
          >
            {c === "phone" ? "Téléphone" : "Email"}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
        {channel === "phone" ? "Numéro" : "Email"}
        <input
          type={channel === "phone" ? "tel" : "email"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          placeholder={channel === "phone" ? "+221 7X XXX XX XX" : "toi@exemple.com"}
          className="min-h-tap-min rounded-md border border-border bg-surface-base px-3 text-base font-normal text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>
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
        {pending ? "Recherche…" : "Me retrouver"}
      </button>
    </form>
  );
}
