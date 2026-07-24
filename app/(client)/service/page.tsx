export const dynamic = "force-dynamic";

import Link from "next/link";
import { HandWaving } from "@phosphor-icons/react/dist/ssr";
import { getActiveSession } from "@/domain/session/get-current";
import { ServiceTiles } from "@/components/client/service-tiles";
import { Reveal } from "@/components/ui/reveal";

export default async function ServicePage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <HandWaving size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[24px] font-semibold text-ink-primary">
          Service
        </h1>
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour appeler l&apos;équipe.{" "}
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

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          À ton service
        </span>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[40px]">
          Besoin de quelque chose&nbsp;?
        </h1>
        <p className="max-w-md text-[16px] text-ink-secondary">
          Un seul tap et l&apos;équipe en salle est prévenue. Reste à table, on
          arrive.
        </p>
      </Reveal>
      <Reveal index={1}>
        <ServiceTiles />
      </Reveal>
    </main>
  );
}
