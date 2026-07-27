"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import {
  CookingPot,
  ArrowRight,
  Check,
  Note,
  Funnel,
} from "@phosphor-icons/react/dist/ssr";
import { advanceOrderStatusAction } from "@/domain/order/actions";
import { orderStatusLabelFr, type OrderBoView } from "@/domain/order/queries";

type StatusFilter = "all" | "RECEIVED" | "PREPARING";

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tableFilter, setTableFilter] = useState("");
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

  const filtered = useMemo(() => {
    const tableQ = tableFilter.trim().toLowerCase();
    return orders
      .filter((o) => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false;
        if (tableQ && !o.tableId.toLowerCase().includes(tableQ)) return false;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, statusFilter, tableFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-deep opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-sage-deep" />
          </span>
          En direct · {filtered.length} affichée{filtered.length > 1 ? "s" : ""}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-ink-secondary">
            <Funnel size={14} weight="bold" />
            Filtres
          </span>
          <div
            className="inline-flex rounded-full border border-border bg-surface-raised/60 p-1"
            role="radiogroup"
            aria-label="Filtrer par statut"
          >
            {(
              [
                ["all", "Toutes"],
                [OrderStatus.RECEIVED, "Reçues"],
                [OrderStatus.PREPARING, "En préparation"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={statusFilter === value}
                onClick={() => setStatusFilter(value)}
                className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                  statusFilter === value
                    ? "bg-accent text-ink-onaccent shadow-soft"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            placeholder="Table…"
            aria-label="Filtrer par table"
            className="min-h-[36px] w-[120px] rounded-full border border-border bg-surface-base px-3 text-sm font-medium text-ink-primary placeholder:text-ink-secondary/60 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-12 text-center">
          <CookingPot size={34} weight="duotone" className="text-ink-secondary" />
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            {orders.length === 0 ? "Rien en cuisine" : "Aucune commande pour ce filtre"}
          </p>
          <p className="text-sm text-ink-secondary">
            {orders.length === 0
              ? "Les nouvelles commandes apparaissent ici, les plus récentes en premier."
              : "Essaie un autre statut ou une autre table."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-display text-[18px] font-semibold text-ink-primary">
                    Table {order.tableId}
                  </p>
                  <time
                    className="text-xs font-semibold text-ink-secondary"
                    dateTime={order.createdAt}
                  >
                    {new Intl.DateTimeFormat("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Africa/Dakar",
                    }).format(new Date(order.createdAt))}
                  </time>
                </div>
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
              {order.note ? (
                <p className="flex items-start gap-1.5 rounded-[var(--radius-md)] border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ink-primary">
                  <Note size={16} weight="fill" className="mt-0.5 shrink-0 text-ember" />
                  <span>{order.note}</span>
                </p>
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
