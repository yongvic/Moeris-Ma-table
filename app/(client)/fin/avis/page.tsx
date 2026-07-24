export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience } from "@/domain/review/actions";
import { AvisForm } from "@/components/client/avis-form";

export default async function AvisPage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <p className="text-ink-secondary">
          Scanne le QR Ma table d'abord.{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  const can = await canFinishExperience(session.sessionId);
  if (!can) {
    redirect("/menu");
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Terminer mon expérience
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Ton avis
        </h1>
        <p className="text-base text-ink-secondary">
          Une minute — ça aide l'équipe Moeris.
        </p>
      </header>
      <AvisForm />
    </main>
  );
}
