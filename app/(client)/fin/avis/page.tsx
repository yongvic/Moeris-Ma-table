export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience } from "@/domain/review/actions";
import { AvisForm } from "@/components/client/avis-form";
import { Reveal } from "@/components/ui/reveal";

export default async function AvisPage() {
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
    redirect("/menu");
  }

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-6 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          Presque fini
        </span>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[40px]">
          Ton avis
        </h1>
        <p className="text-[16px] text-ink-secondary">
          Une minute, pas plus — et ça aide vraiment l&apos;équipe Moeris.
        </p>
      </Reveal>
      <Reveal index={1}>
        <AvisForm />
      </Reveal>
    </main>
  );
}
