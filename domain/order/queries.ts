import { OrderStatus } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { tasteLabel } from "./tastes";

export type OrderBoView = {
  id: string;
  tableId: string;
  status: OrderStatus;
  createdAt: string;
  tastes: string[];
  tasteLabels: string[];
  lines: { name: string; qty: number; priceCents: number }[];
};

export async function listOpenOrders(): Promise<OrderBoView[]> {
  const rows = await prisma.order.findMany({
    where: {
      status: { in: [OrderStatus.RECEIVED, OrderStatus.PREPARING] },
    },
    include: { lines: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toView);
}

export async function listRecentOrders(): Promise<OrderBoView[]> {
  const rows = await prisma.order.findMany({
    include: { lines: true },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return rows.map(toView);
}

export async function sessionHasReceivedOrder(
  sessionId: string,
): Promise<boolean> {
  const count = await prisma.order.count({
    where: {
      sessionId,
      status: {
        in: [OrderStatus.RECEIVED, OrderStatus.PREPARING, OrderStatus.SERVED],
      },
    },
  });
  return count > 0;
}

/** Latest order for a client session (post-commande surface). */
export async function getLatestSessionOrder(
  sessionId: string,
): Promise<OrderBoView | null> {
  const row = await prisma.order.findFirst({
    where: { sessionId },
    include: { lines: true },
    orderBy: { createdAt: "desc" },
  });
  return row ? toView(row) : null;
}

function toView(row: {
  id: string;
  tableId: string;
  status: OrderStatus;
  createdAt: Date;
  tastesJson: unknown;
  lines: { nameSnapshot: string; qty: number; priceCents: number }[];
}): OrderBoView {
  const tastes = Array.isArray(row.tastesJson)
    ? row.tastesJson.filter((t): t is string => typeof t === "string")
    : [];
  return {
    id: row.id,
    tableId: row.tableId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    tastes,
    tasteLabels: tastes.map(tasteLabel),
    lines: row.lines.map((l) => ({
      name: l.nameSnapshot,
      qty: l.qty,
      priceCents: l.priceCents,
    })),
  };
}

export function orderStatusLabelFr(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.RECEIVED:
      return "Reçue";
    case OrderStatus.PREPARING:
      return "En préparation";
    case OrderStatus.SERVED:
      return "Servie";
    default:
      return status;
  }
}
