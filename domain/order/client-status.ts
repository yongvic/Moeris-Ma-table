"use server";

import { OrderStatus } from "@prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { listSessionOrders } from "@/domain/order/queries";

/** Polling léger — statuts de toutes les commandes du séjour. */
export async function pollSessionOrders(): Promise<
  { orderId: string; status: OrderStatus }[]
> {
  const session = await getActiveSession();
  if (!session) return [];

  const orders = await listSessionOrders(session.sessionId);
  return orders.map((o) => ({ orderId: o.id, status: o.status }));
}

/** @deprecated Préférer pollSessionOrders — conservé pour compat. */
export async function pollSessionOrderStatus(): Promise<{
  orderId: string;
  status: OrderStatus;
} | null> {
  const all = await pollSessionOrders();
  return all[0] ?? null;
}
