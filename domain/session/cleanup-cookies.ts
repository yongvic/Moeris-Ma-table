"use server";

import { SessionStatus } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import {
  clearSessionOpaqueKey,
  readSessionOpaqueKey,
} from "@/domain/session/cookie";
import {
  clearSoftDeviceKey,
  readSoftDeviceKey,
} from "@/domain/guest/soft-device";

/**
 * Nettoie les cookies client obsolètes (mt_session, mt_device).
 * Doit s'exécuter dans une Server Action — jamais pendant le rendu RSC.
 */
export async function cleanupStaleClientCookiesAction(): Promise<void> {
  const opaqueKey = await readSessionOpaqueKey();
  if (opaqueKey) {
    const session = await prisma.session.findUnique({
      where: { opaqueKey },
    });

    const shouldClear =
      !session ||
      session.expiresAt.getTime() <= Date.now() ||
      session.status !== SessionStatus.ACTIVE;

    if (shouldClear) {
      if (
        session &&
        session.status === SessionStatus.ACTIVE &&
        session.expiresAt.getTime() <= Date.now()
      ) {
        await prisma.session.update({
          where: { id: session.id },
          data: { status: SessionStatus.EXPIRED },
        });
      }
      await clearSessionOpaqueKey();
    }
  }

  const softKey = await readSoftDeviceKey();
  if (softKey) {
    const guest = await prisma.guest.findUnique({
      where: { softDeviceKey: softKey },
    });
    if (!guest) {
      await clearSoftDeviceKey();
    }
  }
}
