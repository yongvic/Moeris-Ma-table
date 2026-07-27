"use client";

import { useMemo, useState } from "react";
import {
  Phone,
  EnvelopeSimple,
  UserCircle,
  Note,
  Funnel,
} from "@phosphor-icons/react/dist/ssr";
import {
  orderStatusLabelFr,
  type OrderBoView,
} from "@/domain/order/queries";
import { formatPriceFr } from "@/domain/menu/queries";
import { OrderStatus } from "@prisma/client";

function frDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Dakar",
  }).format(new Date(iso));
}

function frTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Dakar",
  }).format(new Date(iso));
}

function statusClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.RECEIVED:
      return "bg-accent-soft text-accent-deep";
    case OrderStatus.PREPARING:
      return "bg-ember/15 text-ember";
    case OrderStatus.SERVED:
      return "bg-sage/15 text-sage-deep";
    default:
      return "bg-surface-sunk text-ink-secondary";
  }
}

function groupByDay(orders: OrderBoView[]): Map<string, OrderBoView[]> {
  const map = new Map<string, OrderBoView[]>();
  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    const bucket = map.get(key) ?? [];
    bucket.push(order);
    map.set(key, bucket);
  }
  return map;
}

function GuestBadge({ order }: { order: OrderBoView }) {
  if (order.guest?.phone) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent-deep">
        <Phone size={13} weight="fill" />
        {order.guest.phone}
      </span>
    );
  }
  if (order.guest?.email) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent-deep">
        <EnvelopeSimple size={13} weight="fill" />
        {order.guest.email}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunk px-2.5 py-0.5 text-xs font-semibold text-ink-secondary">
      <UserCircle size={13} weight="fill" />
      Client anonyme
    </span>
  );
}

export function BoOrderHistory({ orders }: { orders: OrderBoView[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [guestFilter, setGuestFilter] = useState<"all" | "identified" | "anonymous">("all");
  const [tableFilter, setTableFilter] = useState("");

  const filtered = useMemo(() => {
    const tableQ = tableFilter.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (guestFilter === "identified" && !o.guest) return false;
      if (guestFilter === "anonymous" && o.guest) return false;
      if (tableQ && !o.tableId.toLowerCase().includes(tableQ)) return false;
      return true;
    });
  }, [orders, statusFilter, guestFilter, tableFilter]);

  if (orders.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-raised/50 py-16 text-center">
        <p className="text-[15px] text-ink-secondary">
          Aucune commande enregistrée pour l&apos;instant.
        </p>
      </div>
    );
  }

  const grouped = groupByDay(filtered);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-ink-secondary">
          <Funnel size={14} weight="bold" />
          Filtres
        </span>
        <div
          className="inline-flex flex-wrap rounded-full border border-border bg-surface-raised/60 p-1"
          role="radiogroup"
          aria-label="Filtrer par statut"
        >
          {(
            [
              ["all", "Toutes"],
              [OrderStatus.RECEIVED, "Reçues"],
              [OrderStatus.PREPARING, "Préparation"],
              [OrderStatus.SERVED, "Servies"],
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
        <div
          className="inline-flex rounded-full border border-border bg-surface-raised/60 p-1"
          role="radiogroup"
          aria-label="Filtrer par client"
        >
          {(
            [
              ["all", "Tous"],
              ["identified", "Identifiés"],
              ["anonymous", "Anonymes"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={guestFilter === value}
              onClick={() => setGuestFilter(value)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                guestFilter === value
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
        <span className="ml-auto text-sm font-semibold text-ink-secondary">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-raised/50 py-12 text-center">
          <p className="text-[15px] text-ink-secondary">
            Aucune commande ne correspond à ces filtres.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {[...grouped.entries()].map(([dayKey, dayOrders]) => (
            <section key={dayKey} className="flex flex-col gap-3">
              <h2 className="font-display text-[18px] font-semibold capitalize text-ink-primary">
                {frDate(dayOrders[0]!.createdAt)}
              </h2>
              <ul className="flex flex-col gap-3">
                {dayOrders.map((order) => {
                  const total = order.lines.reduce(
                    (sum, l) => sum + l.priceCents * l.qty,
                    0,
                  );
                  return (
                    <li
                      key={order.id}
                      className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-[17px] font-semibold text-ink-primary">
                            Table {order.tableId}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClass(order.status)}`}
                          >
                            {orderStatusLabelFr(order.status)}
                          </span>
                          <GuestBadge order={order} />
                        </div>
                        <time
                          className="text-sm font-semibold text-ink-secondary"
                          dateTime={order.createdAt}
                        >
                          {frTime(order.createdAt)}
                        </time>
                      </div>

                      <ul className="flex flex-col gap-1 text-[15px] text-ink-primary">
                        {order.lines.map((line, i) => (
                          <li
                            key={`${order.id}-l-${i}`}
                            className="flex justify-between gap-3"
                          >
                            <span>
                              {line.qty > 1 ? `${line.qty}× ` : ""}
                              {line.name}
                            </span>
                            <span className="tnum shrink-0 font-semibold text-ink-secondary">
                              {formatPriceFr(line.priceCents * line.qty)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {order.tasteLabels.map((t, i) => (
                            <span
                              key={`${order.id}-t-${i}`}
                              className="rounded-full bg-surface-sunk px-2 py-0.5 text-xs font-semibold text-ink-secondary"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="tnum text-sm font-bold text-ink-primary">
                          Total {formatPriceFr(total)}
                        </span>
                      </div>

                      {order.note ? (
                        <p className="flex items-start gap-1.5 rounded-[var(--radius-md)] border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ink-primary">
                          <Note
                            size={16}
                            weight="fill"
                            className="mt-0.5 shrink-0 text-ember"
                          />
                          {order.note}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
