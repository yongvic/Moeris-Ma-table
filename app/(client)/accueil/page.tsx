export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCurrentSession } from "@/domain/session/get-current";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

/**
 * Accueil stub — enriched in story 1.3 (card-accueil / fil maison).
 * Reached after QR open/resume (story 1.2).
 */
export default async function AccueilPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = params.error ? null : await getCurrentSession();

  return (
    <main className="flex flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-3">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Ma table
        </p>
        <h1 className="font-display text-[28px] leading-[34px] font-semibold text-ink-primary">
          {params.error ? "Table introuvable" : "Accueil"}
        </h1>
        {params.error ? (
          <p className="max-w-md text-base leading-6 text-ink-secondary">
            {params.message ??
              "Cette table n’est pas reconnue. Vérifie le QR Ma table."}
          </p>
        ) : session ? (
          <p className="max-w-md text-base leading-6 text-ink-secondary">
            Session ouverte pour la table{" "}
            <span className="font-semibold text-ink-primary">{session.tableId}</span>
            . Le fil séjour arrive ensuite.
          </p>
        ) : (
          <p className="max-w-md text-base leading-6 text-ink-secondary">
            Aucune session active. Scanne le QR Ma table sur ta table pour
            commencer.
          </p>
        )}
      </header>

      {!params.error && session ? (
        <button
          type="button"
          className="inline-flex min-h-tap-min min-w-tap-min items-center justify-center rounded-md bg-accent px-5 text-base leading-5 font-bold text-ink-primary shadow-soft"
        >
          Continuer
        </button>
      ) : null}

      {!params.error && !session ? (
        <p className="text-sm text-ink-secondary">
          Exemple d’URL QR :{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      ) : null}
    </main>
  );
}
