import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";
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
    <main className="flex flex-1 flex-col justify-center gap-6 px-margin-mobile py-10 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Espace équipe
        </p>
        <h1 className="font-display text-[28px] leading-[34px] font-semibold text-ink-primary">
          Connexion
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          Accès réservé au staff provisionné — pas d’inscription publique.
        </p>
      </header>
      <ConnexionForm showError={showError} />
    </main>
  );
}
