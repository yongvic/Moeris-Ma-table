"use server";

import { getActiveSession } from "@/domain/session/get-current";
import { upsertGuestContact } from "@/domain/guest/upsert";

export async function submitContactAction(input: {
  channel: "phone" | "email";
  value: string;
}): Promise<
  { ok: true; guestId: string } | { ok: false; code: string; message: string }
> {
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
