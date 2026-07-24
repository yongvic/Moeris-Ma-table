import { cookies } from "next/headers";
import {
  SESSION_COOKIE_MAX_AGE_SEC,
  SESSION_COOKIE_NAME,
} from "./constants";

export async function readSessionOpaqueKey(): Promise<string | undefined> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE_NAME)?.value?.trim();
  return value || undefined;
}

export async function writeSessionOpaqueKey(opaqueKey: string): Promise<void> {
  const jar = await cookies();
  // Secure only on real HTTPS deploy (Vercel) — local `next start` is HTTP
  const secure =
    process.env.VERCEL === "1" || process.env.COOKIE_SECURE === "true";

  jar.set(SESSION_COOKIE_NAME, opaqueKey, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SEC,
  });
}

export async function clearSessionOpaqueKey(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
}
