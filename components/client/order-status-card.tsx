"use client";

import { OrderStatus } from "@prisma/client";
import { Check, BellRinging } from "@phosphor-icons/react/dist/ssr";
import { orderStatusLabelFr } from "@/domain/order/queries";
import { formatPriceFr } from "@/domain/menu/queries";
import type { OrderBoView } from "@/domain/order/queries";

const FLOW: OrderStatus[] = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.SERVED,
];

function frTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Dakar",
  }).format(new Date(iso));
}

export function OrderStatusCard({
  order,
  highlight = false,
}: {
  order: OrderBoView;
  highlight?: boolean;
}) {
  const currentIdx = FLOW.indexOf(order.status);
  const total = order.lines.reduce(
    (sum, l) => sum + l.priceCents * l.qty,
    0,
  );
  const active = order.status !== OrderStatus.SERVED;

  return (
    <article
      className={`flex flex-col gap-4 rounded-[var(--radius-lg)] border bg-surface-base p-5 shadow-card sm:p-6 ${
        highlight && active
          ? "border-accent/50 ring-1 ring-accent-soft"
          : "border-border/70"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-[18px] font-semibold text-ink-primary">
              Table {order.tableId}
            </h2>
            {active ? (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-accent-deep">
                En cours
              </span>
            ) : null}
          </div>
          <time
            className="text-sm font-semibold text-ink-secondary"
            dateTime={order.createdAt}
          >
            Commandé à {frTime(order.createdAt)}
          </time>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-ink-primary">
          <BellRinging size={14} weight="fill" className="text-accent-deep" />
          {orderStatusLabelFr(order.status)}
        </span>
      </div>

      <ol className="flex items-center justify-between gap-1" aria-label="Suivi">
        {FLOW.map((s, i) => {
          const done = i <= currentIdx;
          const stepActive = i === currentIdx;
          return (
            <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`grid size-8 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                  done
                    ? "bg-accent text-ink-onaccent"
                    : "bg-surface-sunk text-ink-secondary"
                } ${stepActive && active ? "ring-2 ring-accent-soft ring-offset-2" : ""}`}
              >
                {i < currentIdx ? <Check size={15} weight="bold" /> : i + 1}
              </span>
              <span
                className={`text-center text-[10px] font-semibold leading-3 sm:text-[11px] ${
                  done ? "text-ink-primary" : "text-ink-secondary"
                }`}
              >
                {orderStatusLabelFr(s)}
              </span>
            </li>
          );
        })}
      </ol>

      <ul className="flex flex-col gap-1 text-[16px] text-ink-primary">
        {order.lines.map((line, i) => (
          <li key={`${order.id}-${i}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="tnum font-bold text-accent-deep">{line.qty}×</span>
              {line.name}
            </span>
            <span className="tnum shrink-0 text-sm font-semibold text-ink-secondary">
              {formatPriceFr(line.priceCents * line.qty)}
            </span>
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
          <span className="font-semibold text-ink-primary">{order.note}</span>
        </p>
      ) : null}

      <p className="tnum border-t border-border/50 pt-3 text-right text-sm font-bold text-ink-primary">
        Total {formatPriceFr(total)}
      </p>
    </article>
  );
}
