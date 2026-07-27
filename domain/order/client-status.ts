"use server";

import { OrderStatus } from "@prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { getLatestSessionOrder } from "@/domain/order/queries";

/** Polling léger pour le suivi client de commande. */
export async function pollSessionOrderStatus(): Promise<{
  orderId: string;
  status: OrderStatus;
} | null> {
  const session = await getActiveSession();
  if (!session) return null;

  const order = await getLatestSessionOrder(session.sessionId);
  if (!order) return null;

  return { orderId: order.id, status: order.status };
}
