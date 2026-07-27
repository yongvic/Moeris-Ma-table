"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { OrderStatus } from "@prisma/client";
import {
  ForkKnife,
  HandWaving,
  CookingPot,
  Confetti,
  Receipt,
} from "@phosphor-icons/react/dist/ssr";
import {
  orderStatusClientMessage,
  type OrderBoView,
} from "@/domain/order/queries";
import { pollSessionOrders } from "@/domain/order/client-status";
import { OrderStatusCard } from "@/components/client/order-status-card";
import { ButtonPrimary } from "@/components/client/button-primary";
import { ButtonSecondary } from "@/components/client/button-secondary";
import { Reveal } from "@/components/ui/reveal";

type PusherCfg = { key: string; cluster: string } | null;

export function MesCommandesLive({
  initialOrders,
  sessionId,
  pusher,
  canFinish,
}: {
  initialOrders: OrderBoView[];
  sessionId: string;
  pusher: PusherCfg;
  canFinish: boolean;
}) {
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState(initialOrders);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatuses = useRef(
    new Map(initialOrders.map((o) => [o.id, o.status])),
  );

  const applyOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const prev = prevStatuses.current.get(orderId);
      if (prev === status) return;
      prevStatuses.current.set(orderId, status);

      const msg = orderStatusClientMessage(status);
      if (msg && prev) setToast(msg);

      setOrders((list) =>
        list.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    },
    [],
  );

  const refresh = useCallback(async () => {
    const next = await pollSessionOrders();
    for (const row of next) {
      applyOrderStatus(row.orderId, row.status);
    }
  }, [applyOrderStatus]);

  useEffect(() => {
    const id = setInterval(refresh, pusher ? 15000 : 8000);
    return () => clearInterval(id);
  }, [refresh, pusher]);

  useEffect(() => {
    if (!pusher) return;
    let cancelled = false;
    let channel: { unbind_all?: () => void; unsubscribe?: () => void } | null =
      null;
    let client: { disconnect?: () => void } | null = null;

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;
      client = new Pusher(pusher.key, { cluster: pusher.cluster });
      channel = (
        client as unknown as { subscribe: (c: string) => typeof channel }
      ).subscribe(`client-session-${sessionId}`);
      (
        channel as unknown as {
          bind: (
            e: string,
            cb: (data: { orderId: string; status: OrderStatus }) => void,
          ) => void;
        }
      ).bind("order-status", (data) => {
        if (data.orderId && data.status) {
          applyOrderStatus(data.orderId, data.status);
        }
      });
    });

    return () => {
      cancelled = true;
      channel?.unbind_all?.();
      channel?.unsubscribe?.();
      client?.disconnect?.();
    };
  }, [pusher, sessionId, applyOrderStatus]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const activeCount = orders.filter(
    (o) => o.status !== OrderStatus.SERVED,
  ).length;

  if (orders.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <Receipt size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[26px] font-semibold text-ink-primary">
          Pas encore de commande
        </h1>
        <p className="text-ink-secondary">
          Tes commandes de la soirée apparaîtront ici — tu pourras suivre
          l&apos;avancement à tout moment.
        </p>
        <ButtonPrimary href="/menu" className="sm:w-auto">
          Voir la carte
        </ButtonPrimary>
      </main>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-3 z-[var(--z-toast)] mx-auto flex max-w-md items-start gap-3 rounded-[var(--radius-lg)] border border-accent-soft bg-surface-base px-4 py-3 shadow-lift mx-margin-mobile sm:mx-auto"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-ink-onaccent">
              <CookingPot size={20} weight="fill" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5 pt-0.5">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent-deep">
                Mise à jour
              </span>
              <p className="text-[15px] font-semibold leading-5 text-ink-primary">
                {toast}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fermer la notification"
              onClick={() => setToast(null)}
              className="shrink-0 text-sm font-bold text-ink-secondary hover:text-ink-primary"
            >
              ✕
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-7 px-margin-mobile py-8 md:px-7">
        <Reveal className="flex flex-col gap-2">
          <h1 className="font-display text-[32px] font-semibold leading-[1.1] text-ink-primary sm:text-[36px]">
            Mes commandes
          </h1>
          <p className="max-w-lg text-[16px] text-ink-secondary">
            {activeCount > 0
              ? `${activeCount} commande${activeCount > 1 ? "s" : ""} en cours — on te prévient dès que ça avance.`
              : "Toutes tes commandes sont servies. Bon appétit !"}
          </p>
        </Reveal>

        <div className="flex flex-col gap-4">
          {orders.map((order, i) => (
            <Reveal key={order.id} index={i}>
              <OrderStatusCard
                order={order}
                highlight={i === 0 && order.status !== OrderStatus.SERVED}
              />
            </Reveal>
          ))}
        </div>

        <Reveal
          className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
          index={orders.length}
        >
          <ButtonSecondary
            href="/menu"
            icon={<ForkKnife size={18} weight="fill" />}
          >
            Commander encore
          </ButtonSecondary>
          <ButtonSecondary
            href="/service"
            icon={<HandWaving size={18} weight="fill" />}
          >
            Besoin de service
          </ButtonSecondary>
          {canFinish ? (
            <ButtonPrimary href="/fin" icon={<Confetti size={18} weight="fill" />}>
              Terminer
            </ButtonPrimary>
          ) : null}
        </Reveal>
      </main>
    </>
  );
}
