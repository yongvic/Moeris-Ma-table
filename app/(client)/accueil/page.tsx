export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionStep } from "@prisma/client";
import { QrCode, Warning } from "@phosphor-icons/react/dist/ssr";
import { CardAccueil } from "@/components/client/card-accueil";
import { BlocMemoire } from "@/components/client/bloc-memoire";
import { AccueilRecognizePrompt } from "@/components/client/accueil-recognize-prompt";
import { MoerisMark } from "@/components/ui/moeris-mark";
import { getActiveSession } from "@/domain/session/get-current";
import { resolveResumeTarget } from "@/domain/session/steps";
import { attachSoftGuestToSessionAction } from "@/domain/guest/memory-actions";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

function InfoState({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-margin-mobile py-12 text-center">
      <MoerisMark href="/accueil" />
      <span className="mt-2 grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
        {icon}
      </span>
      <h1 className="font-display text-[28px] font-semibold leading-[34px] text-ink-primary">
        {title}
      </h1>
      <div className="text-[16px] leading-6 text-ink-secondary">{children}</div>
    </main>
  );
}

/**
 * Accueil — post-scan. Reprise R2 + mémoire soft + ressaisie.
 */
export default async function AccueilPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if (params.error) {
    return (
      <InfoState
        icon={<Warning size={30} weight="fill" />}
        title="Table introuvable"
      >
        {params.message ??
          "Cette table n'est pas reconnue. Vérifie le QR Ma table sur ta table."}
      </InfoState>
    );
  }

  const session = await getActiveSession();

  if (!session) {
    return (
      <InfoState icon={<QrCode size={30} weight="fill" />} title="Scanne ta table">
        <p>
          Pour commencer, scanne le QR <strong>Ma table</strong> posé sur ta
          table. Pas besoin de compte.
        </p>
        <p className="mt-4 text-sm">
          Démo :{" "}
          <Link
            href="/t/t-1"
            className="font-semibold text-accent-deep underline underline-offset-4"
          >
            ouvrir la table 1
          </Link>
        </p>
      </InfoState>
    );
  }

  // Resume mid-séjour (MENU/ORDER). WELCOME shows accueil; END is terminal —
  // never bounce a finished séjour back to /fin (that felt like a dead-end loop).
  if (
    session.step === SessionStep.MENU ||
    session.step === SessionStep.ORDER
  ) {
    redirect(`${resolveResumeTarget(session.step)}?reprise=1`);
  }

  const memory = await attachSoftGuestToSessionAction();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-6 px-margin-mobile py-8 md:px-7 lg:py-12">
      {memory.guestId ? (
        <BlocMemoire
          preferences={memory.preferences}
          rememberedTastes={memory.rememberedTastes}
        />
      ) : (
        <AccueilRecognizePrompt />
      )}

      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border/70 bg-gradient-to-b from-surface-raised/80 to-surface-base p-6 shadow-card sm:p-10 lg:p-12">
        <div className="pattern-wash opacity-[0.22]" aria-hidden />
        <div
          className="sun-glow -right-16 -top-16 size-64 motion-safe:animate-sun"
          aria-hidden
        />
        <div className="relative z-[1]">
          <CardAccueil />
        </div>
      </section>
    </main>
  );
}
