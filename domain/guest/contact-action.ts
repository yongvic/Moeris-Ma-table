"use server";

import { upsertGuestContact } from "@/domain/guest/upsert";
import { isAvisContactMode } from "@/domain/app-mode";
import { getActiveSession } from "@/domain/session/get-current";
import {
  clearReviewCookieId,
  readReviewCookieId,
} from "@/domain/review/cookie";
import { prisma } from "@/infra/prisma/client";

export async function submitContactAction(input: {
  channel: "phone" | "email";
  value: string;
}): Promise<
  { ok: true; guestId: string } | { ok: false; code: string; message: string }
> {
  if (isAvisContactMode()) {
    const reviewId = await readReviewCookieId();
    if (!reviewId) {
      return {
        ok: false,
        code: "NO_REVIEW",
        message: "Laisse d’abord un avis — on te propose le contact juste après.",
      };
    }

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      await clearReviewCookieId();
      return {
        ok: false,
        code: "NO_REVIEW",
        message: "Laisse d’abord un avis — on te propose le contact juste après.",
      };
    }

    const result = await upsertGuestContact({
      phone: input.channel === "phone" ? input.value : undefined,
      email: input.channel === "email" ? input.value : undefined,
    });

    if (!result.ok) return result;

    await prisma.review.update({
      where: { id: review.id },
      data: { guestId: result.guestId },
    });

    await clearReviewCookieId();
    return result;
  }

  // Legacy tables (sourdine)
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Session expirée.",
    };
  }

  return upsertGuestContact({
    phone: input.channel === "phone" ? input.value : undefined,
    email: input.channel === "email" ? input.value : undefined,
    sessionId: session.sessionId,
  });
}
