/** Normalize FR/SN-ish phone to E.164-ish digit string starting with +. */
export function normalizePhoneE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "").trim();
  if (!digits) return null;
  let n = digits;
  if (n.startsWith("00")) n = `+${n.slice(2)}`;
  if (!n.startsWith("+")) {
    // Assume Senegal local 7x… → +221
    if (/^[7]\d{8}$/.test(n)) n = `+221${n}`;
    else if (/^\d{9,15}$/.test(n)) n = `+${n}`;
    else return null;
  }
  if (!/^\+\d{8,15}$/.test(n)) return null;
  return n;
}

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}
