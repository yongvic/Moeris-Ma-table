/**
 * Best-effort Google Sheets mirror (AD-8).
 * Neon remains source of truth; failures never block client UX.
 */
export async function mirrorGuestToSheet(guest: {
  id: string;
  phoneE164: string | null;
  emailLower: string | null;
}): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    console.info("[sheets] skip mirror (GOOGLE_SHEETS_ID unset)", guest.id);
    return;
  }

  // V1: log intent; full Sheets API wiring when ops credentials land.
  console.info("[sheets] mirror queued", {
    guestId: guest.id,
    hasPhone: Boolean(guest.phoneE164),
    hasEmail: Boolean(guest.emailLower),
  });
}
