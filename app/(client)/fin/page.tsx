export const dynamic = "force-dynamic";

import Link from "next/link";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience } from "@/domain/review/actions";
import { SessionStep } from "@prisma/client";
import { updateSessionStepAction } from "@/domain/session/update-step";

export default async function FinPage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Fin
        </h1>
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
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
            Terminer mon expérience
          </h1>
          <p className="max-w-md text-base text-ink-secondary">
            Envoie d'abord une commande — le bouton s'activera ensuite.
          </p>
        </header>
        <Link
          href="/menu"
          className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary"
        >
          Voir la carte
        </Link>
      </main>
    );
  }

  if (session.step !== SessionStep.END) {
    await updateSessionStepAction({ step: SessionStep.END });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Fin de séjour
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Terminer mon expérience
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          Laisse un avis rapide — ça aide l'équipe Moeris à s'améliorer.
        </p>
      </header>
      <Link
        href="/fin/avis"
        className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary"
      >
        Donner mon avis
      </Link>
      <Link
        href="/fin/merci"
        className="inline-flex min-h-tap-min items-center justify-center rounded-md border border-border px-5 text-base font-bold text-ink-primary"
      >
        Passer directement
      </Link>
    </main>
  );
}
