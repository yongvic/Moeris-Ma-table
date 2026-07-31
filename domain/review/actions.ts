"use server";

import { prisma } from "@/infra/prisma/client";
import { isAvisContactMode } from "@/domain/app-mode";
import { getActiveSession } from "@/domain/session/get-current";
import { sessionHasReceivedOrder } from "@/domain/order/queries";
import { SessionStep } from "@prisma/client";
import {
  readReviewCookieId,
  writeReviewCookieId,
} from "@/domain/review/cookie";

export type ReviewResult =
  | { ok: true; reviewId: string }
  | { ok: false; code: string; message: string };

export async function canFinishExperience(
  sessionId: string,
): Promise<boolean> {
  return sessionHasReceivedOrder(sessionId);
}

function validateStars(input: {
  starsMeal: number;
  starsService: number;
  starsPlace: number;
}):
  | { ok: true; stars: number; starsService: number; starsPlace: number }
  | { ok: false; message: string } {
  const inRange = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 5;

  const stars = Math.floor(input.starsMeal);
  const starsService = Math.floor(input.starsService);
  const starsPlace = Math.floor(input.starsPlace);

  if (!inRange(stars) || !inRange(starsService) || !inRange(starsPlace)) {
    return {
      ok: false,
      message: "Note le repas, le service et le restaurant (1 à 5 étoiles).",
    };
  }
  return { ok: true, stars, starsService, starsPlace };
}

export async function submitReviewAction(input: {
  starsMeal: number;
  starsService: number;
  starsPlace: number;
  comment?: string;
  highlights?: string[];
}): Promise<ReviewResult> {
  const validated = validateStars(input);
  if (!validated.ok) {
    return { ok: false, code: "VALIDATION", message: validated.message };
  }

  const { stars, starsService, starsPlace } = validated;

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

  // ——— Mode avis → contact (sans table / commande) ———
  if (isAvisContactMode()) {
    const existingId = await readReviewCookieId();
    if (existingId) {
      const existing = await prisma.review.findUnique({
        where: { id: existingId },
      });
      if (existing) {
        const updated = await prisma.review.update({
          where: { id: existing.id },
          data: { stars, starsService, starsPlace, comment, highlights },
        });
        await writeReviewCookieId(updated.id);
        return { ok: true, reviewId: updated.id };
      }
    }

    const created = await prisma.review.create({
      data: {
        stars,
        starsService,
        starsPlace,
        comment,
        highlights,
      },
    });
    await writeReviewCookieId(created.id);
    return { ok: true, reviewId: created.id };
  }

  // ——— Legacy tables (sourdine) ———
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

  const lastOrder = await prisma.order.findFirst({
    where: { sessionId: session.sessionId },
    orderBy: { createdAt: "desc" },
  });

  const review = await prisma.review.upsert({
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

  return { ok: true, reviewId: review.id };
}

export async function getSessionReview(sessionId: string) {
  return prisma.review.findUnique({ where: { sessionId } });
}

export async function getReviewByCookie() {
  const id = await readReviewCookieId();
  if (!id) return null;
  return prisma.review.findUnique({ where: { id } });
}
