"use server";

import {
  OrderStatus,
  SessionStep,
  SessionStatus,
} from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { publishFloorEvent } from "@/infra/pusher/publish";
import { getActiveSession } from "@/domain/session/get-current";
import { emptyCart, parseCart } from "@/domain/session/cart";
import { recomputePreferencesForGuest } from "@/domain/guest/preferences";

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; code: string; message: string };

/**
 * Client-only INSERT Order at status RECEIVED (AD-12).
 * Snapshots tastes from session cart; publishes Pusher post-commit (AD-7).
 */
export async function placeOrderAction(input: {
  menuItemId: string;
  tastes: string[];
  note?: string;
  qty?: number;
}): Promise<PlaceOrderResult> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Scanne le QR Ma table pour commander.",
    };
  }

  const menuItemId = String(input.menuItemId ?? "").trim();
  const qty = Math.max(1, Math.floor(input.qty ?? 1));
  const tastes = Array.isArray(input.tastes)
    ? input.tastes.filter((t) => typeof t === "string").slice(0, 8)
    : [];
  const note =
    typeof input.note === "string" && input.note.trim()
      ? input.note.trim().slice(0, 280)
      : null;

  if (!menuItemId) {
    return { ok: false, code: "VALIDATION", message: "Plat manquant." };
  }

  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
  if (!item || !item.available) {
    return {
      ok: false,
      code: "UNAVAILABLE",
      message: "Ce plat n’est plus disponible.",
    };
  }

  const full = await prisma.session.findUnique({
    where: { id: session.sessionId },
  });
  if (!full || full.status !== SessionStatus.ACTIVE) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Session expirée — rescane le QR.",
    };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          sessionId: session.sessionId,
          tableId: session.tableId,
          status: OrderStatus.RECEIVED,
          tastesJson: tastes,
          note,
          lines: {
            create: [
              {
                menuItemId: item.id,
                nameSnapshot: item.name,
                priceCents: item.priceCents,
                qty,
              },
            ],
          },
        },
      });

      await tx.session.update({
        where: { id: session.sessionId },
        data: {
          step: SessionStep.ORDER,
          cartJson: emptyCart(),
        },
      });

      return created;
    });

    await publishFloorEvent({
      kind: "order",
      id: order.id,
      tableId: order.tableId,
      status: order.status,
      sessionId: order.sessionId,
      at: new Date().toISOString(),
    });

    if (full.guestId) {
      void recomputePreferencesForGuest(full.guestId).catch((err) =>
        console.error("[prefs]", err),
      );
    }

    return { ok: true, orderId: order.id };
  } catch (error) {
    console.error("[placeOrder]", error);
    return {
      ok: false,
      code: "ORDER_FAILED",
      message: "Envoi impossible. Réessaie.",
    };
  }
}

/** Persist tastes/lines into session cart before optional multi-step (AD-18). */
export async function saveCartDraftAction(input: {
  menuItemId: string;
  tastes: string[];
}): Promise<PlaceOrderResult | { ok: true }> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Scanne le QR Ma table pour commander.",
    };
  }

  const cart = parseCart({
    lines: [{ menuItemId: input.menuItemId, qty: 1 }],
    tastes: input.tastes,
  });

  await prisma.session.update({
    where: { id: session.sessionId },
    data: { cartJson: cart },
  });

  return { ok: true };
}
