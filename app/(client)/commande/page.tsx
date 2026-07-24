export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { ForkKnife, HandWaving, Check } from "@phosphor-icons/react/dist/ssr";
import { getActiveSession } from "@/domain/session/get-current";
import {
  getLatestSessionOrder,
  orderStatusLabelFr,
  sessionHasReceivedOrder,
} from "@/domain/order/queries";
import { Illustration } from "@/components/ui/illustration";
import { ButtonPrimary } from "@/components/client/button-primary";
import { ButtonSecondary } from "@/components/client/button-secondary";
import { Reveal } from "@/components/ui/reveal";

const FLOW: OrderStatus[] = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.SERVED,
];

export default async function CommandePage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const order = await getLatestSessionOrder(session.sessionId);
  const canFinish = await sessionHasReceivedOrder(session.sessionId);

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <ForkKnife size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[26px] font-semibold text-ink-primary">
          Pas encore de commande
        </h1>
        <p className="text-ink-secondary">
          Choisis un plat sur la carte — un tap suffit pour l&apos;envoyer.
        </p>
        <ButtonPrimary href="/menu" className="sm:w-auto">
          Voir la carte
        </ButtonPrimary>
      </main>
    );
  }

  const currentIdx = FLOW.indexOf(order.status);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center gap-7 px-margin-mobile py-8 text-center md:px-7">
      <Reveal className="flex flex-col items-center gap-4">
        <Illustration variant="commande" priority className="max-w-[260px]" />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[32px] font-semibold leading-[1.1] text-ink-primary sm:text-[38px]">
            C&apos;est parti.
          </h1>
          <p className="max-w-md text-[16px] text-ink-secondary">
            Ta commande est enregistrée — l&apos;équipe s&apos;en occupe. Détends-toi.
          </p>
        </div>
      </Reveal>

      <Reveal className="w-full" index={1}>
        <section
          className="flex w-full flex-col gap-5 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-5 text-left shadow-card sm:p-6"
          aria-label="Résumé de commande"
        >
          {/* status timeline */}
          <ol className="flex items-center justify-between gap-1" aria-label="Suivi">
            {FLOW.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={`grid size-8 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                      done
                        ? "bg-accent text-ink-onaccent"
                        : "bg-surface-sunk text-ink-secondary"
                    }`}
                  >
                    {i < currentIdx ? <Check size={15} weight="bold" /> : i + 1}
                  </span>
                  <span
                    className={`text-center text-[11px] font-semibold leading-3 ${
                      done ? "text-ink-primary" : "text-ink-secondary"
                    }`}
                  >
                    {orderStatusLabelFr(s)}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[18px] font-semibold text-ink-primary">
              Table {order.tableId}
            </p>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-ink-primary">
              {orderStatusLabelFr(order.status)}
            </span>
          </div>

          <ul className="flex flex-col gap-1 text-[16px] text-ink-primary">
            {order.lines.map((line, i) => (
              <li key={`${order.id}-${i}`} className="flex items-center gap-2">
                <span className="tnum font-bold text-accent-deep">{line.qty}×</span>
                {line.name}
              </li>
            ))}
          </ul>

          {order.tasteLabels.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              Goûts :{" "}
              <span className="font-semibold text-ink-primary">
                {order.tasteLabels.join(", ")}
              </span>
            </p>
          ) : null}
        </section>
      </Reveal>

      <Reveal className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center" index={2}>
        <ButtonSecondary href="/menu" icon={<ForkKnife size={18} weight="fill" />}>
          Un autre plat
        </ButtonSecondary>
        <ButtonSecondary href="/service" icon={<HandWaving size={18} weight="fill" />}>
          Besoin de service
        </ButtonSecondary>
        {canFinish ? (
          <ButtonPrimary href="/fin">Terminer</ButtonPrimary>
        ) : null}
      </Reveal>
    </main>
  );
}
