import { cookies } from "next/headers";

export const REVIEW_COOKIE_NAME = "mt_review";
const REVIEW_COOKIE_MAX_AGE_SEC = 60 * 60 * 24; // 24h — enchaîne avis → contact

function cookieSecure(): boolean {
  return process.env.VERCEL === "1" || process.env.COOKIE_SECURE === "true";
}

export async function readReviewCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  const value = jar.get(REVIEW_COOKIE_NAME)?.value?.trim();
  return value || undefined;
}

export async function writeReviewCookieId(reviewId: string): Promise<void> {
  const jar = await cookies();
  jar.set(REVIEW_COOKIE_NAME, reviewId, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: REVIEW_COOKIE_MAX_AGE_SEC,
  });
}

export async function clearReviewCookieId(): Promise<void> {
  const jar = await cookies();
  jar.delete(REVIEW_COOKIE_NAME);
}
