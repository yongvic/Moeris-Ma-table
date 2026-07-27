import { OrderStatus } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { tasteLabel } from "./tastes";

export type OrderGuestView = {
  id: string;
  phone: string | null;
  email: string | null;
};

export type OrderBoView = {
  id: string;
  sessionId: string;
  tableId: string;
  status: OrderStatus;
  createdAt: string;
  tastes: string[];
  tasteLabels: string[];
  note: string | null;
  guest: OrderGuestView | null;
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

export async function listRecentOrders(limit = 80): Promise<OrderBoView[]> {
  const rows = await prisma.order.findMany({
    include: {
      lines: true,
      session: {
        include: {
          guest: {
            select: { id: true, phoneE164: true, emailLower: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
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
  sessionId: string;
  tableId: string;
  status: OrderStatus;
  createdAt: Date;
  tastesJson: unknown;
  note?: string | null;
  lines: { nameSnapshot: string; qty: number; priceCents: number }[];
  session?: {
    guest: {
      id: string;
      phoneE164: string | null;
      emailLower: string | null;
    } | null;
  } | null;
}): OrderBoView {
  const tastes = Array.isArray(row.tastesJson)
    ? row.tastesJson.filter((t): t is string => typeof t === "string")
    : [];
  const guest = row.session?.guest;
  return {
    id: row.id,
    sessionId: row.sessionId,
    tableId: row.tableId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    tastes,
    tasteLabels: tastes.map(tasteLabel),
    note: row.note ?? null,
    guest: guest
      ? {
          id: guest.id,
          phone: guest.phoneE164,
          email: guest.emailLower,
        }
      : null,
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
