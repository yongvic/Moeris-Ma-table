import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";
import { MoerisMark } from "@/components/ui/moeris-mark";
import { ConnexionForm } from "@/components/bo/connexion-form";

export default async function BoConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/bo/menu");
  }

  const params = await searchParams;
  const showError = params.error === "CredentialsSignin" || params.error === "1";

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-margin-mobile py-12">
      <div className="pattern-wash opacity-40" aria-hidden />
      <div
        className="sun-glow -top-24 right-0 size-72 motion-safe:animate-sun"
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-md rounded-[var(--radius-xl)] border border-border/70 bg-surface-base/90 p-7 shadow-card backdrop-blur-sm sm:p-9">
        <div className="mb-7 flex flex-col gap-4">
          <MoerisMark href="/bo/connexion" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
              Espace équipe
            </span>
            <h1 className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink-primary">
              Connexion
            </h1>
            <p className="text-[15px] leading-6 text-ink-secondary">
              Accès réservé au personnel Moeris — pas d&apos;inscription
              publique.
            </p>
          </div>
        </div>
        <ConnexionForm showError={showError} />
      </div>
    </main>
  );
}
