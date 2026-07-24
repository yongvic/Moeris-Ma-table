"use server";

import { prisma } from "@/infra/prisma/client";
import { mirrorGuestToSheet } from "@/infra/sheets/mirror";
import {
  clearSoftDeviceKey,
  readSoftDeviceKey,
  writeSoftDeviceKey,
} from "./soft-device";
import { normalizeEmail, normalizePhoneE164 } from "./normalize";
import { recomputePreferencesForGuest } from "./preferences";

export type GuestResult =
  | { ok: true; guestId: string }
  | { ok: false; code: string; message: string };

/**
 * Upsert Guest by phone XOR email (AD-15, AD-19).
 */
export async function upsertGuestContact(input: {
  phone?: string;
  email?: string;
  sessionId?: string;
}): Promise<GuestResult> {
  const phone = input.phone ? normalizePhoneE164(input.phone) : null;
  const email = input.email ? normalizeEmail(input.email) : null;

  if ((phone && email) || (!phone && !email)) {
    return {
      ok: false,
      code: "XOR",
      message: "Indique un téléphone ou un email — pas les deux.",
    };
  }

  let guest = phone
    ? await prisma.guest.findUnique({ where: { phoneE164: phone } })
    : await prisma.guest.findUnique({
        where: { emailLower: email! },
      });

  if (!guest) {
    const soft = await readSoftDeviceKey();
    guest = await prisma.guest.create({
      data: {
        phoneE164: phone,
        emailLower: email,
        softDeviceKey: soft ?? crypto.randomUUID(),
        lastInteractionAt: new Date(),
      },
    });
    if (!soft && guest.softDeviceKey) {
      await writeSoftDeviceKey(guest.softDeviceKey);
    }
  } else {
    guest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        lastInteractionAt: new Date(),
        softDeviceKey: guest.softDeviceKey ?? crypto.randomUUID(),
      },
    });
    if (guest.softDeviceKey) {
      await writeSoftDeviceKey(guest.softDeviceKey);
    }
  }

  if (input.sessionId) {
    await prisma.session.update({
      where: { id: input.sessionId },
      data: { guestId: guest.id },
    });
  }

  void mirrorGuestToSheet({
    id: guest.id,
    phoneE164: guest.phoneE164,
    emailLower: guest.emailLower,
  }).catch((e) => console.error("[sheets]", e));

  void recomputePreferencesForGuest(guest.id).catch((e) =>
    console.error("[prefs]", e),
  );

  return { ok: true, guestId: guest.id };
}

/** Resolve Guest from soft device cookie (Epic 5). */
export async function resolveGuestFromSoftDevice(): Promise<{
  guestId: string;
  rememberedTastes: string[];
} | null> {
  const key = await readSoftDeviceKey();
  if (!key) return null;

  const guest = await prisma.guest.findUnique({
    where: { softDeviceKey: key },
  });
  if (!guest) {
    await clearSoftDeviceKey();
    return null;
  }

  const tastes = Array.isArray(guest.rememberedTastes)
    ? guest.rememberedTastes.filter((t): t is string => typeof t === "string")
    : [];

  return { guestId: guest.id, rememberedTastes: tastes };
}

export async function linkSessionToGuest(
  sessionId: string,
  guestId: string,
): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { guestId },
  });
}
