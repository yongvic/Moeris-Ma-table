import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Normalize any international phone input to E.164 (+…). */
export function normalizePhoneE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed?.isValid()) return null;

  return parsed.format("E.164");
}

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}
