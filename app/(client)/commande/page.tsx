export const dynamic = "force-dynamic";

import Link from "next/link";
import { SessionStep } from "@prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { updateSessionStepAction } from "@/domain/session/update-step";

/** Commande stub — sets step ORDER for resume (epic 3 later). */
export default async function CommandePage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Commande
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

  if (session.step !== SessionStep.ORDER) {
    await updateSessionStepAction({ step: SessionStep.ORDER });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
      <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
        Commande
      </h1>
      <p className="max-w-md text-base leading-6 text-ink-secondary">
        Bientôt — ta commande se construira ici.
      </p>
      <Link
        href="/fin"
        className="text-base font-bold text-ink-primary underline underline-offset-2"
      >
        Aller à la fin (stub)
      </Link>
    </main>
  );
}
