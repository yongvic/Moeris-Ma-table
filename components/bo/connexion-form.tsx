"use client";

import { useActionState } from "react";
import { staffLoginAction } from "@/domain/staff/login-action";

export function ConnexionForm({ showError }: { showError: boolean }) {
  const [state, formAction, pending] = useActionState(staffLoginAction, {
    error: showError,
  });

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="min-h-tap-min rounded-md border border-border bg-surface-base px-3 text-base font-normal text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="min-h-tap-min rounded-md border border-border bg-surface-base px-3 text-base font-normal text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-ink-secondary" role="alert">
          Email ou mot de passe incorrect.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
