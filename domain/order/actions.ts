"use server";

import { OrderStatus } from "@prisma/client";
import { requireStaff } from "@/infra/auth/require-staff";
import { prisma } from "@/infra/prisma/client";
import { publishFloorEvent } from "@/infra/pusher/publish";

export type OrderActionResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

const NEXT: Record<OrderStatus, OrderStatus | null> = {
  RECEIVED: OrderStatus.PREPARING,
  PREPARING: OrderStatus.SERVED,
  SERVED: null,
};

export async function advanceOrderStatusAction(
  orderId: string,
): Promise<OrderActionResult> {
  const gate = await requireStaff();
  if (!gate.ok) return gate;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { ok: false, code: "NOT_FOUND", message: "Commande introuvable." };
  }

  const next = NEXT[order.status];
  if (!next) {
    return { ok: false, code: "DONE", message: "Commande déjà servie." };
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: next },
  });

  await publishFloorEvent({
    kind: "order",
    id: updated.id,
    tableId: updated.tableId,
    status: updated.status,
    sessionId: updated.sessionId,
    at: new Date().toISOString(),
  });

  return { ok: true };
}
