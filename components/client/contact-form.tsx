"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitContactAction } from "@/domain/guest/contact-action";

type Channel = "phone" | "email";

export function ContactForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("phone");
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <p className="text-base font-semibold text-ink-primary">
          ✓ Merci, c'est noté !
        </p>
        <p className="text-sm text-ink-secondary">
          On te garde au courant des prochaines soirées Moeris.
        </p>
        <button
          type="button"
          className="inline-flex min-h-tap-min items-center rounded-md border border-border px-4 text-base font-bold text-ink-primary"
          onClick={() => router.push("/accueil")}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await submitContactAction({ channel, value });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          setDone(true);
        });
      }}
    >
      <p className="text-sm font-semibold text-ink-primary">
        Canal{" "}
        <span className="font-normal text-ink-secondary">
          — téléphone ou email (un seul)
        </span>
      </p>

      <div className="flex gap-2" role="radiogroup" aria-label="Canal de contact">
        {(["phone", "email"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={channel === c}
            onClick={() => { setChannel(c); setValue(""); }}
            className={`min-h-tap-min rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
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
        {channel === "phone" ? "Numéro de téléphone" : "Adresse email"}
        <input
          name="contact-value"
          type={channel === "phone" ? "tel" : "email"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={channel === "phone" ? "tel" : "email"}
          placeholder={channel === "phone" ? "+221 7X XXX XX XX" : "toi@exemple.com"}
          required
          className="min-h-tap-min rounded-md border border-border bg-surface-base px-3 text-base font-normal text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>

      <p className="text-xs text-ink-secondary">
        Finalité : soirées Moeris / Résidence. Données Neon staff-only.
        Pas de revente, pas de spam.
      </p>

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
        {pending ? "Enregistrement…" : "Rester en contact"}
      </button>

      <button
        type="button"
        className="text-sm text-ink-secondary underline underline-offset-2"
        onClick={() => router.push("/accueil")}
      >
        Non merci
      </button>
    </form>
  );
}
