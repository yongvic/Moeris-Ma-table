export const dynamic = "force-dynamic";

import Link from "next/link";
import { SessionStep } from "@prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { updateSessionStepAction } from "@/domain/session/update-step";

/** Fin stub — sets step END for resume (epic 4 later). */
export default async function FinPage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Fin
        </h1>
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour ouvrir ta session.{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  if (session.step !== SessionStep.END) {
    await updateSessionStepAction({ step: SessionStep.END });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
      <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
        Fin
      </h1>
      <p className="max-w-md text-base leading-6 text-ink-secondary">
        Bientôt — avis, merci chef et contact arriveront ici.
      </p>
      <Link
        href="/accueil"
        className="text-base font-bold text-ink-primary underline underline-offset-2"
      >
        Retour à l’accueil
      </Link>
    </main>
  );
}
