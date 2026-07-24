import { cookies } from "next/headers";

const COOKIE = "mt_device";
const MAX_AGE = 60 * 60 * 24 * 400; // ~400 days

export async function readSoftDeviceKey(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function writeSoftDeviceKey(key: string): Promise<void> {
  const jar = await cookies();
  const secure =
    process.env.VERCEL === "1" || process.env.COOKIE_SECURE === "true";
  jar.set(COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure,
  });
}

export async function clearSoftDeviceKey(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
