export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import {
  getLatestSessionOrder,
  orderStatusLabelFr,
  sessionHasReceivedOrder,
} from "@/domain/order/queries";
import { IllustrationPanel } from "@/components/client/illustration-panel";

/**
 * Étape Commande — reprise post-placeOrder (AD-12 / resume ORDER → /commande).
 */
export default async function CommandePage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const order = await getLatestSessionOrder(session.sessionId);
  const canFinish = await sessionHasReceivedOrder(session.sessionId);

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
        <header className="flex flex-col gap-2">
          <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
            Commande
          </p>
          <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
            Pas encore de commande
          </h1>
          <p className="max-w-md text-base text-ink-secondary">
            Choisis un plat sur la carte — un tap suffit pour envoyer.
          </p>
        </header>
        <Link
          href="/menu"
          className="inline-flex min-h-tap-min items-center justify-center self-start rounded-md bg-accent px-5 text-base font-bold text-ink-primary"
        >
          Voir la carte
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Commande
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          C&apos;est parti !
        </h1>
        <p className="max-w-md text-base text-ink-secondary">
          Ta commande est enregistrée — l&apos;équipe s&apos;en occupe.
        </p>
      </header>

      <IllustrationPanel className="max-w-[220px]" />

      <section
        className="flex flex-col gap-3 rounded-md border border-border bg-surface-raised/30 p-4"
        aria-label="Résumé de commande"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-lg font-semibold text-ink-primary">
            Table {order.tableId}
          </p>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink-primary">
            {orderStatusLabelFr(order.status)}
          </span>
        </div>
        <ul className="text-base text-ink-secondary">
          {order.lines.map((line, i) => (
            <li key={`${order.id}-${i}`}>
              {line.qty}× {line.name}
            </li>
          ))}
        </ul>
        {order.tasteLabels.length > 0 ? (
          <p className="text-sm text-ink-secondary">
            Goûts : {order.tasteLabels.join(", ")}
          </p>
        ) : null}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/menu"
          className="inline-flex min-h-tap-min items-center justify-center rounded-md border border-border px-5 text-base font-bold text-ink-primary"
        >
          Commander un autre plat
        </Link>
        <Link
          href="/service"
          className="inline-flex min-h-tap-min items-center justify-center rounded-md border border-border px-5 text-base font-bold text-ink-primary"
        >
          Besoin de service ?
        </Link>
        {canFinish ? (
          <Link
            href="/fin"
            className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-5 text-base font-bold text-ink-primary"
          >
            Terminer mon expérience
          </Link>
        ) : null}
      </div>
    </main>
  );
}
