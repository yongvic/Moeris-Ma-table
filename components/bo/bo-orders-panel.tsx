"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  advanceOrderStatusAction,
} from "@/domain/order/actions";
import {
  orderStatusLabelFr,
  type OrderBoView,
} from "@/domain/order/queries";
import { StatusPillBo } from "./status-pill-bo";

export function BoOrdersPanel({
  initialOrders,
  pusher,
}: {
  initialOrders: OrderBoView[];
  pusher: { key: string; cluster: string } | null;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const id = setInterval(refresh, 12000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!pusher) return;
    let cancelled = false;
    let channel: { unbind_all?: () => void; unsubscribe?: () => void } | null =
      null;
    let client: { disconnect?: () => void } | null = null;

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;
      client = new Pusher(pusher.key, { cluster: pusher.cluster });
      channel = (client as unknown as { subscribe: (c: string) => typeof channel }).subscribe(
        "bo-floor",
      );
      (channel as unknown as { bind: (e: string, cb: () => void) => void }).bind(
        "floor-update",
        () => refresh(),
      );
    });

    return () => {
      cancelled = true;
      channel?.unbind_all?.();
      channel?.unsubscribe?.();
      client?.disconnect?.();
    };
  }, [pusher, refresh]);

  if (orders.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface-base p-6 text-ink-secondary">
        Aucune commande en cours.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex flex-col gap-3 rounded-md border border-border bg-surface-base p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-lg font-semibold text-ink-primary">
              Table {order.tableId}
            </p>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold">
              {orderStatusLabelFr(order.status)}
            </span>
          </div>
          <ul className="text-sm text-ink-secondary">
            {order.lines.map((l, i) => (
              <li key={`${order.id}-${i}`}>
                {l.qty}× {l.name}
              </li>
            ))}
          </ul>
          {order.tasteLabels.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              Goûts : {order.tasteLabels.join(", ")}
            </p>
          ) : null}
          <button
            type="button"
            disabled={pending}
            className="min-h-tap-min self-start rounded-md bg-accent px-4 font-bold text-ink-primary disabled:opacity-60"
            onClick={() => {
              startTransition(async () => {
                const res = await advanceOrderStatusAction(order.id);
                if (!res.ok) setError(res.message);
                else {
                  setError(null);
                  refresh();
                }
              });
            }}
          >
            {order.status === "RECEIVED"
              ? "Passer en préparation"
              : "Marquer servie"}
          </button>
        </li>
      ))}
      {error ? (
        <p className="text-sm text-ink-secondary" role="alert">
          {error}
        </p>
      ) : null}
      {/* StatusPillBo kept for menu reuse — silence unused in this file via comment */}
      {false ? <StatusPillBo available /> : null}
    </ul>
  );
}
