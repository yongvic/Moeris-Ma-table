"use client";

import { useActionState } from "react";
import { Warning, SignIn } from "@phosphor-icons/react/dist/ssr";
import { staffLoginAction } from "@/domain/staff/login-action";
import { Field, inputClass } from "@/components/ui/form";

export function ConnexionForm({ showError }: { showError: boolean }) {
  const [state, formAction, pending] = useActionState(staffLoginAction, {
    error: showError,
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="salle@moeris.local"
          className={inputClass}
        />
      </Field>
      <Field label="Mot de passe">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>
      {state.error ? (
        <p
          className="flex items-center gap-2 rounded-[var(--radius-md)] border border-ember/40 bg-ember/5 px-3 py-2 text-sm font-semibold text-ember"
          role="alert"
        >
          <Warning size={17} weight="fill" />
          Email ou mot de passe incorrect.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex min-h-tap-min items-center justify-center gap-2 rounded-full bg-accent px-6 text-[16px] font-bold text-ink-onaccent shadow-glow transition-[transform,background-color] duration-300 hover:bg-accent-deep active:scale-[0.98] disabled:opacity-60"
      >
        <SignIn size={18} weight="bold" />
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
