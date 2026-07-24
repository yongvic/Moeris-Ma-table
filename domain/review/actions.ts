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
  /** Note du repas (1..5) — obligatoire, sert au ton du "Merci chef". */
  starsMeal: number;
  /** Note du service (1..5). */
  starsService: number;
  /** Note du restaurant (1..5). */
  starsPlace: number;
  /** Mini commentaire libre (optionnel). */
  comment?: string;
  /** Coups de cœur multiples (tokens). */
  highlights?: string[];
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

  const inRange = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 5;

  const stars = Math.floor(input.starsMeal);
  const starsService = Math.floor(input.starsService);
  const starsPlace = Math.floor(input.starsPlace);

  if (!inRange(stars) || !inRange(starsService) || !inRange(starsPlace)) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Note le repas, le service et le restaurant (1 à 5 étoiles).",
    };
  }

  const comment =
    typeof input.comment === "string" && input.comment.trim()
      ? input.comment.trim().slice(0, 500)
      : null;

  const highlights = Array.isArray(input.highlights)
    ? input.highlights
        .filter((h): h is string => typeof h === "string" && h.length > 0)
        .map((h) => h.slice(0, 40))
        .slice(0, 8)
    : [];

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
      starsService,
      starsPlace,
      comment,
      highlights,
    },
    update: {
      stars,
      starsService,
      starsPlace,
      comment,
      highlights,
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
