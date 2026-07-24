export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCurrentSession } from "@/domain/session/get-current";

/**
 * Service stub — micro-missions arrive in story 3.3.
 */
export default async function ServicePage() {
  const session = await getCurrentSession();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Service
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

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
      <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
        Service
      </h1>
      <p className="max-w-md text-base leading-6 text-ink-secondary">
        Bientôt — un tap pour demander de l’eau, l’addition, et le reste.
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
