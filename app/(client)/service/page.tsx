export const dynamic = "force-dynamic";

import Link from "next/link";
import { getActiveSession } from "@/domain/session/get-current";
import { ServiceTiles } from "@/components/client/service-tiles";

export default async function ServicePage() {
  const session = await getActiveSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Service
        </h1>
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour accéder au service.{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Service
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Besoin de quelque chose ?
        </h1>
      </header>
      <ServiceTiles />
    </main>
  );
}
