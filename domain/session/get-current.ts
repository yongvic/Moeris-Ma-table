import { SessionStatus, type Session, type SessionStep } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { readSessionOpaqueKey } from "./cookie";

export type ActiveSessionView = {
  sessionId: string;
  tableId: string;
  step: SessionStep;
  expiresAt: Date;
};

/**
 * Active séjour session from opaque cookie (AD-5).
 * Lecture seule — le nettoyage cookie se fait via cleanupStaleClientCookiesAction.
 */
export async function getActiveSession(): Promise<ActiveSessionView | null> {
  const opaqueKey = await readSessionOpaqueKey();
  if (!opaqueKey) return null;

  const session = await prisma.session.findUnique({
    where: { opaqueKey },
  });

  if (!session) return null;
  if (isExpired(session)) return null;
  if (session.status !== SessionStatus.ACTIVE) return null;

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
