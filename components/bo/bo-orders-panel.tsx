"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { CookingPot, ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { advanceOrderStatusAction } from "@/domain/order/actions";
import { orderStatusLabelFr, type OrderBoView } from "@/domain/order/queries";

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    RECEIVED: "bg-accent-soft text-ink-primary",
    PREPARING: "bg-ember/15 text-ember",
    SERVED: "bg-sage/15 text-sage-deep",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {orderStatusLabelFr(status)}
    </span>
  );
}

export function BoOrdersPanel({
  initialOrders,
  pusher,
}: {
  initialOrders: OrderBoView[];
  pusher: { key: string; cluster: string } | null;
}) {
  const router = useRouter();
  const orders = initialOrders;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
      channel = (
        client as unknown as { subscribe: (c: string) => typeof channel }
      ).subscribe("bo-floor");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-deep opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-sage-deep" />
        </span>
        En direct · {orders.length} en cours
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-12 text-center">
          <CookingPot size={34} weight="duotone" className="text-ink-secondary" />
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            Rien en cuisine
          </p>
          <p className="text-sm text-ink-secondary">
            Les nouvelles commandes apparaissent ici, en direct.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[18px] font-semibold text-ink-primary">
                  Table {order.tableId}
                </p>
                <OrderStatusPill status={order.status} />
              </div>
              <ul className="flex flex-col gap-0.5 text-[15px] text-ink-primary">
                {order.lines.map((l, i) => (
                  <li key={`${order.id}-${i}`} className="flex items-center gap-2">
                    <span className="tnum font-bold text-accent-deep">{l.qty}×</span>
                    {l.name}
                  </li>
                ))}
              </ul>
              {order.tasteLabels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {order.tasteLabels.map((t, i) => (
                    <span
                      key={`${order.id}-t-${i}`}
                      className="rounded-full bg-surface-sunk px-2.5 py-0.5 text-xs font-semibold text-ink-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                disabled={pending}
                className="mt-1 inline-flex min-h-tap-min items-center justify-center gap-2 self-start rounded-full bg-accent px-5 font-bold text-ink-onaccent shadow-glow transition-colors hover:bg-accent-deep disabled:opacity-60"
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
                {order.status === OrderStatus.RECEIVED ? (
                  <>
                    <CookingPot size={17} weight="fill" /> Passer en préparation
                  </>
                ) : (
                  <>
                    <Check size={17} weight="bold" /> Marquer servie
                  </>
                )}
                <ArrowRight size={15} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
