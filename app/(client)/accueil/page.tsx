export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionStep } from "@prisma/client";
import { CardAccueil } from "@/components/client/card-accueil";
import { BlocMemoire } from "@/components/client/bloc-memoire";
import { AccueilRecognizePrompt } from "@/components/client/accueil-recognize-prompt";
import { getActiveSession } from "@/domain/session/get-current";
import { resolveResumeTarget } from "@/domain/session/steps";
import { attachSoftGuestToSessionAction } from "@/domain/guest/memory-actions";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

/**
 * Accueil — post-scan. Reprise R2 (1.4) + mémoire soft (5.1) + ressaisie (5.2).
 */
export default async function AccueilPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if (params.error) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[28px] leading-[34px] font-semibold text-ink-primary">
          Table introuvable
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          {params.message ??
            "Cette table n'est pas reconnue. Vérifie le QR Ma table."}
        </p>
      </main>
    );
  }

  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[28px] leading-[34px] font-semibold text-ink-primary">
          Scanne ton QR
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          Pour commencer, scanne le QR <strong>Ma table</strong> sur ta table —
          pas besoin de compte.
        </p>
        <p className="text-sm text-ink-secondary">
          Démo :{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  if (session.step !== SessionStep.WELCOME) {
    redirect(`${resolveResumeTarget(session.step)}?reprise=1`);
  }

  const memory = await attachSoftGuestToSessionAction();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap justify-center px-margin-mobile py-7 md:px-7 lg:py-10">
      {memory.guestId ? (
        <BlocMemoire
          preferences={memory.preferences}
          rememberedTastes={memory.rememberedTastes}
        />
      ) : (
        <AccueilRecognizePrompt sessionId={session.sessionId} />
      )}
      <div className="relative overflow-hidden rounded-lg bg-accent-soft/40 p-5 sm:p-7 lg:p-10">
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-[60%_40%_50%_50%] bg-pattern-a/30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-[40%_60%_45%_55%] bg-pattern-b/25"
          aria-hidden
        />
        <CardAccueil />
      </div>
    </main>
  );
}
