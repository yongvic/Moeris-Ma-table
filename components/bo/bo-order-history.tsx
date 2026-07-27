"use client";

import {
  Phone,
  EnvelopeSimple,
  UserCircle,
  Note,
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
  if (orders.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-raised/50 py-16 text-center">
        <p className="text-[15px] text-ink-secondary">
          Aucune commande enregistrée pour l&apos;instant.
        </p>
      </div>
    );
  }

  const grouped = groupByDay(orders);

  return (
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
                      <li key={`${order.id}-l-${i}`} className="flex justify-between gap-3">
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
                      <Note size={16} weight="fill" className="mt-0.5 shrink-0 text-ember" />
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
  );
}
