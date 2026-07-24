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
 * Opt-in contact (4.4) — upsert by phone XOR email (AD-15, AD-19).
 * Soft device key: never reuse another Guest's key (B7).
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
    const softKey = await allocateSoftDeviceKey();
    guest = await prisma.guest.create({
      data: {
        phoneE164: phone,
        emailLower: email,
        softDeviceKey: softKey,
        lastInteractionAt: new Date(),
      },
    });
    await writeSoftDeviceKey(softKey);
  } else {
    let softKey = guest.softDeviceKey;
    if (!softKey) {
      softKey = await allocateSoftDeviceKey();
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
          lastInteractionAt: new Date(),
          softDeviceKey: softKey,
        },
      });
    } else {
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: { lastInteractionAt: new Date() },
      });
    }
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

/**
 * Find-only recognition (5.2) — never INSERT a Guest.
 */
export async function findGuestByContact(input: {
  phone?: string;
  email?: string;
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

  const guest = phone
    ? await prisma.guest.findUnique({ where: { phoneE164: phone } })
    : await prisma.guest.findUnique({ where: { emailLower: email! } });

  if (!guest) {
    return {
      ok: false,
      code: "GUEST_NOT_FOUND",
      message: "Aucun souvenir trouvé avec ce contact.",
    };
  }

  return { ok: true, guestId: guest.id };
}

/** Fresh soft key that does not collide with an existing Guest. */
async function allocateSoftDeviceKey(): Promise<string> {
  const existingCookie = await readSoftDeviceKey();
  if (existingCookie) {
    const owner = await prisma.guest.findUnique({
      where: { softDeviceKey: existingCookie },
    });
    // Cookie free: no Guest owns it yet → safe to assign on create
    if (!owner) return existingCookie;
  }

  for (let i = 0; i < 5; i++) {
    const candidate = crypto.randomUUID();
    const clash = await prisma.guest.findUnique({
      where: { softDeviceKey: candidate },
    });
    if (!clash) return candidate;
  }
  return crypto.randomUUID();
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
