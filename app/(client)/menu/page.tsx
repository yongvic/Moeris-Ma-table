export const dynamic = "force-dynamic";

import Link from "next/link";
import { SessionStep } from "@prisma/client";
import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { getActiveSession } from "@/domain/session/get-current";
import { listPublishedMenu } from "@/domain/menu/queries";
import { updateSessionStepAction } from "@/domain/session/update-step";
import { MenuCard } from "@/components/client/menu-card";
import { Reveal } from "@/components/ui/reveal";

export default async function MenuPage() {
  const session = await getActiveSession();
  const items = await listPublishedMenu();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <ForkKnife size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[24px] font-semibold text-ink-primary">
          La carte t&apos;attend
        </h1>
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour ouvrir ta session.{" "}
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

  if (session.step === SessionStep.WELCOME) {
    await updateSessionStepAction({ step: SessionStep.MENU });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-7 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2" as="section">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          Résidence Moeris
        </span>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[40px]">
          La carte
        </h1>
        <p className="max-w-md text-[16px] text-ink-secondary">
          Choisis ce qui te fait envie. Un tap ouvre le plat, un autre l&apos;envoie
          en cuisine.
        </p>
      </Reveal>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-10 text-center">
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            La carte se prépare
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Reviens dans un instant, la cuisine met la dernière main.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} as="li" index={i} y={22}>
              <MenuCard item={item} />
            </Reveal>
          ))}
        </ul>
      )}
    </main>
  );
}
