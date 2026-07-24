"use server";

import { getActiveSession } from "@/domain/session/get-current";
import {
  findGuestByContact,
  linkSessionToGuest,
  resolveGuestFromSoftDevice,
} from "@/domain/guest/upsert";
import { writeSoftDeviceKey } from "@/domain/guest/soft-device";
import { listPreferencesForGuest } from "@/domain/guest/preferences";
import { prisma } from "@/infra/prisma/client";
import { parseCart } from "@/domain/session/cart";

export async function dismissMemoryAction(): Promise<void> {
  // Client-only dismiss; soft cookie kept for later soirées.
}

/**
 * 5.2 — find-only. Never creates Guest (use opt-in upsert for 4.4).
 */
export async function recognizeByContactAction(input: {
  channel: "phone" | "email";
  value: string;
}): Promise<
  | {
      ok: true;
      guestId: string;
      preferences: { menuItemId: string; label: string; rank: number }[];
      rememberedTastes: string[];
    }
  | { ok: false; code: string; message: string }
> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Scanne le QR Ma table d’abord.",
    };
  }

  const found = await findGuestByContact({
    phone: input.channel === "phone" ? input.value : undefined,
    email: input.channel === "email" ? input.value : undefined,
  });
  if (!found.ok) return found;

  await linkSessionToGuest(session.sessionId, found.guestId);

  const guest = await prisma.guest.findUnique({
    where: { id: found.guestId },
  });
  if (guest?.softDeviceKey) {
    await writeSoftDeviceKey(guest.softDeviceKey);
  } else if (guest) {
    const key = crypto.randomUUID();
    await prisma.guest.update({
      where: { id: guest.id },
      data: { softDeviceKey: key, lastInteractionAt: new Date() },
    });
    await writeSoftDeviceKey(key);
  }

  const preferences = await listPreferencesForGuest(found.guestId);
  const rememberedTastes = Array.isArray(guest?.rememberedTastes)
    ? guest!.rememberedTastes.filter((t): t is string => typeof t === "string")
    : [];

  return {
    ok: true,
    guestId: found.guestId,
    preferences,
    rememberedTastes,
  };
}

export async function attachSoftGuestToSessionAction(): Promise<{
  guestId: string | null;
  preferences: { menuItemId: string; label: string; rank: number }[];
  rememberedTastes: string[];
}> {
  const session = await getActiveSession();
  const soft = await resolveGuestFromSoftDevice();
  if (!session || !soft) {
    return { guestId: null, preferences: [], rememberedTastes: [] };
  }

  await linkSessionToGuest(session.sessionId, soft.guestId);
  const preferences = await listPreferencesForGuest(soft.guestId);
  return {
    guestId: soft.guestId,
    preferences,
    rememberedTastes: soft.rememberedTastes,
  };
}

/** Apply remembered tastes into session cart (5.3). */
export async function reapplyRememberedTastesAction(): Promise<
  { ok: true; tastes: string[] } | { ok: false; code: string; message: string }
> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Session expirée.",
    };
  }

  const full = await prisma.session.findUnique({
    where: { id: session.sessionId },
    include: { guest: true },
  });

  const tastes = Array.isArray(full?.guest?.rememberedTastes)
    ? full!.guest!.rememberedTastes.filter(
        (t): t is string => typeof t === "string",
      )
    : [];

  if (tastes.length === 0) {
    return {
      ok: false,
      code: "EMPTY",
      message: "Aucun goût mémorisé pour l’instant.",
    };
  }

  const cart = parseCart(full?.cartJson);
  cart.tastes = tastes;
  await prisma.session.update({
    where: { id: session.sessionId },
    data: { cartJson: cart },
  });

  return { ok: true, tastes };
}
