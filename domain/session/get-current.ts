import { SessionStatus, type Session, type SessionStep } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import {
  clearSessionOpaqueKey,
  readSessionOpaqueKey,
} from "./cookie";

export type ActiveSessionView = {
  sessionId: string;
  tableId: string;
  step: SessionStep;
  expiresAt: Date;
};

/**
 * Active séjour session from opaque cookie (AD-5).
 * Expired rows are marked EXPIRED and cookie cleared — no silent ghost session.
 */
export async function getActiveSession(): Promise<ActiveSessionView | null> {
  const opaqueKey = await readSessionOpaqueKey();
  if (!opaqueKey) return null;

  const session = await prisma.session.findUnique({
    where: { opaqueKey },
  });

  if (!session) return null;

  if (isExpired(session)) {
    await prisma.session.update({
      where: { id: session.id },
      data: { status: SessionStatus.EXPIRED },
    });
    await clearSessionOpaqueKey();
    return null;
  }

  if (session.status !== SessionStatus.ACTIVE) {
    await clearSessionOpaqueKey();
    return null;
  }

  return {
    sessionId: session.id,
    tableId: session.tableId,
    step: session.step,
    expiresAt: session.expiresAt,
  };
}

/** @deprecated Prefer getActiveSession — kept as alias for 1.2/1.3 call sites. */
export async function getCurrentSession(): Promise<ActiveSessionView | null> {
  return getActiveSession();
}

function isExpired(session: Session): boolean {
  return session.expiresAt.getTime() <= Date.now();
}
