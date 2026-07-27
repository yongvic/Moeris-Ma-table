"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { OrderStatus } from "@prisma/client";
import {
  Check,
  ForkKnife,
  HandWaving,
  BellRinging,
  CookingPot,
  Confetti,
} from "@phosphor-icons/react/dist/ssr";
import {
  orderStatusLabelFr,
  orderStatusClientMessage,
  type OrderBoView,
} from "@/domain/order/queries";
import { pollSessionOrderStatus } from "@/domain/order/client-status";
import { ButtonPrimary } from "@/components/client/button-primary";
import { ButtonSecondary } from "@/components/client/button-secondary";
import { Illustration } from "@/components/ui/illustration";
import { Reveal } from "@/components/ui/reveal";

const FLOW: OrderStatus[] = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.SERVED,
];

type PusherCfg = { key: string; cluster: string } | null;

export function CommandeLive({
  initialOrder,
  sessionId,
  pusher,
  canFinish,
}: {
  initialOrder: OrderBoView;
  sessionId: string;
  pusher: PusherCfg;
  canFinish: boolean;
}) {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(initialOrder);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatus = useRef(initialOrder.status);

  const applyStatus = useCallback((status: OrderStatus) => {
    setOrder((prev) => {
      if (prev.status === status) return prev;
      const msg = orderStatusClientMessage(status);
      if (msg) setToast(msg);
      return { ...prev, status };
    });
  }, []);

  const refresh = useCallback(async () => {
    const next = await pollSessionOrderStatus();
    if (!next || next.orderId !== order.id) return;
    if (next.status !== prevStatus.current) {
      prevStatus.current = next.status;
      applyStatus(next.status);
    }
  }, [order.id, applyStatus]);

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
            cb: (data: { status: OrderStatus }) => void,
          ) => void;
        }
      ).bind("order-status", (data) => {
        if (data.status && data.status !== prevStatus.current) {
          prevStatus.current = data.status;
          applyStatus(data.status);
        }
      });
    });

    return () => {
      cancelled = true;
      channel?.unbind_all?.();
      channel?.unsubscribe?.();
      client?.disconnect?.();
    };
  }, [pusher, sessionId, applyStatus]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const currentIdx = FLOW.indexOf(order.status);

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
              {order.status === OrderStatus.SERVED ? (
                <Confetti size={20} weight="fill" />
              ) : (
                <CookingPot size={20} weight="fill" />
              )}
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

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center gap-7 px-margin-mobile py-8 text-center md:px-7">
        <Reveal className="flex flex-col items-center gap-4">
          <Illustration variant="commande" priority className="max-w-[260px]" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[32px] font-semibold leading-[1.1] text-ink-primary sm:text-[38px]">
              C&apos;est parti.
            </h1>
            <p className="max-w-md text-[16px] text-ink-secondary">
              Ta commande est enregistrée — l&apos;équipe s&apos;en occupe.
              Détends-toi.
            </p>
          </div>
        </Reveal>

        <Reveal className="w-full" index={1}>
          <section
            className="flex w-full flex-col gap-5 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-5 text-left shadow-card sm:p-6"
            aria-label="Résumé de commande"
          >
            <ol className="flex items-center justify-between gap-1" aria-label="Suivi">
              {FLOW.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
                    <motion.span
                      layout
                      className={`grid size-8 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                        done
                          ? "bg-accent text-ink-onaccent"
                          : "bg-surface-sunk text-ink-secondary"
                      } ${active && !reduce ? "ring-2 ring-accent-soft ring-offset-2" : ""}`}
                      animate={
                        active && !reduce
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {i < currentIdx ? (
                        <Check size={15} weight="bold" />
                      ) : (
                        i + 1
                      )}
                    </motion.span>
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-ink-primary">
                <BellRinging size={14} weight="fill" className="text-accent-deep" />
                {orderStatusLabelFr(order.status)}
              </span>
            </div>

            <ul className="flex flex-col gap-1 text-[16px] text-ink-primary">
              {order.lines.map((line, i) => (
                <li key={`${order.id}-${i}`} className="flex items-center gap-2">
                  <span className="tnum font-bold text-accent-deep">
                    {line.qty}×
                  </span>
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

            {order.note ? (
              <p className="rounded-[var(--radius-md)] bg-surface-sunk px-3 py-2 text-sm text-ink-secondary">
                Ta note :{" "}
                <span className="font-semibold text-ink-primary">
                  {order.note}
                </span>
              </p>
            ) : null}
          </section>
        </Reveal>

        <Reveal
          className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          index={2}
        >
          <ButtonSecondary
            href="/menu"
            icon={<ForkKnife size={18} weight="fill" />}
          >
            Un autre plat
          </ButtonSecondary>
          <ButtonSecondary
            href="/service"
            icon={<HandWaving size={18} weight="fill" />}
          >
            Besoin de service
          </ButtonSecondary>
          {canFinish ? (
            <ButtonPrimary href="/fin">Terminer</ButtonPrimary>
          ) : null}
        </Reveal>
      </main>
    </>
  );
}
