export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { SessionStep } from "@prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { listPublishedMenu, formatPriceFr } from "@/domain/menu/queries";
import { updateSessionStepAction } from "@/domain/session/update-step";

export default async function MenuPage() {
  const session = await getActiveSession();
  const items = await listPublishedMenu();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Menu
        </h1>
        <p className="text-base text-ink-secondary">
          Scanne le QR Ma table pour ouvrir ta session.{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  if (session.step === SessionStep.WELCOME) {
    await updateSessionStepAction({ step: SessionStep.MENU });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Résidence Moeris
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          La carte
        </h1>
      </header>

      {items.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-raised/30 p-6 text-ink-secondary">
          La carte est vide pour l&apos;instant — reviens bientôt.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/menu/${item.id}`}
                className="flex flex-col overflow-hidden rounded-md border border-border bg-surface-base shadow-[var(--elevation-soft)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {item.photoUrl ? (
                  <div className="relative h-40 w-full overflow-hidden bg-surface-raised">
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width:640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center bg-surface-raised/50">
                    <span className="text-4xl" aria-hidden>
                      🍽
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1 p-4">
                  <p className="font-display text-lg font-semibold text-ink-primary">
                    {item.name}
                  </p>
                  <p className="text-sm text-ink-secondary">
                    {formatPriceFr(item.priceCents)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
