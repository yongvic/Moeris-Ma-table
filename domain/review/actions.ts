"use server";

import { prisma } from "@/infra/prisma/client";
import { getActiveSession } from "@/domain/session/get-current";
import { sessionHasReceivedOrder } from "@/domain/order/queries";
import { SessionStep } from "@prisma/client";

export type ReviewResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

export async function canFinishExperience(
  sessionId: string,
): Promise<boolean> {
  return sessionHasReceivedOrder(sessionId);
}

export async function submitReviewAction(input: {
  stars: number;
  dishEmoji?: string;
}): Promise<ReviewResult> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Session expirée.",
    };
  }

  const allowed = await canFinishExperience(session.sessionId);
  if (!allowed) {
    return {
      ok: false,
      code: "GATE",
      message: "Envoie d’abord une commande.",
    };
  }

  const stars = Math.floor(input.stars);
  if (stars < 1 || stars > 5) {
    return { ok: false, code: "VALIDATION", message: "Choisis 1 à 5 étoiles." };
  }

  const lastOrder = await prisma.order.findFirst({
    where: { sessionId: session.sessionId },
    orderBy: { createdAt: "desc" },
  });

  await prisma.review.upsert({
    where: { sessionId: session.sessionId },
    create: {
      sessionId: session.sessionId,
      orderId: lastOrder?.id ?? null,
      stars,
      dishEmoji: input.dishEmoji?.slice(0, 8) || null,
    },
    update: {
      stars,
      dishEmoji: input.dishEmoji?.slice(0, 8) || null,
      orderId: lastOrder?.id ?? null,
    },
  });

  await prisma.session.update({
    where: { id: session.sessionId },
    data: { step: SessionStep.END },
  });

  return { ok: true };
}

export async function getSessionReview(sessionId: string) {
  return prisma.review.findUnique({ where: { sessionId } });
}
