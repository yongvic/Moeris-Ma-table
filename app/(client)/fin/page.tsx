export const dynamic = "force-dynamic";

import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience } from "@/domain/review/actions";
import { SessionStep } from "@prisma/client";
import { ForkKnife, Heart } from "@phosphor-icons/react/dist/ssr";
import { updateSessionStepAction } from "@/domain/session/update-step";
import { Illustration } from "@/components/ui/illustration";
import { ButtonPrimary } from "@/components/client/button-primary";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export default async function FinPage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-margin-mobile py-12 text-center">
        <p className="text-ink-secondary">
          Scanne le QR Ma table d&apos;abord.{" "}
          <Link
            href="/t/t-1"
            className="font-semibold text-accent-deep underline underline-offset-4"
          >
            démo
          </Link>
        </p>
      </main>
    );
  }

  const can = await canFinishExperience(session.sessionId);

  if (!can) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <ForkKnife size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[26px] font-semibold text-ink-primary">
          Encore un instant
        </h1>
        <p className="text-ink-secondary">
          Envoie d&apos;abord une commande — on t&apos;ouvrira le mot de la fin
          ensuite.
        </p>
        <ButtonPrimary href="/menu" className="sm:w-auto">
          Voir la carte
        </ButtonPrimary>
      </main>
    );
  }

  if (session.step !== SessionStep.END) {
    await updateSessionStepAction({ step: SessionStep.END });
  }

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center gap-6 px-margin-mobile py-10 text-center md:px-7">
      <Reveal className="flex flex-col items-center gap-5">
        <Illustration variant="memoire" priority className="max-w-[260px]" />
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center justify-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-accent-deep">
            <Heart size={14} weight="fill" /> Fin de séjour
          </span>
          <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[38px]">
            Le mot de la fin
          </h1>
          <p className="max-w-md text-[16px] text-ink-secondary">
            Un petit avis avant de partir&nbsp;? Ça prend une minute et ça fait
            grandir la maison Moeris.
          </p>
        </div>
      </Reveal>
      <Reveal index={1}>
        <ButtonPrimary href="/fin/avis" className="sm:w-auto">
          Donner mon avis
        </ButtonPrimary>
      </Reveal>
    </main>
  );
}
