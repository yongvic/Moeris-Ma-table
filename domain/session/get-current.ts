import { SessionStatus, type Session, type SessionStep } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { readSessionOpaqueKey } from "./cookie";

export type CurrentSessionView = {
  sessionId: string;
  tableId: string;
  step: SessionStep;
  expiresAt: Date;
};

/**
 * Resolve current séjour session from opaque cookie (no mutation).
 */
export async function getCurrentSession(): Promise<CurrentSessionView | null> {
  const opaqueKey = await readSessionOpaqueKey();
  if (!opaqueKey) return null;

  const session = await prisma.session.findUnique({
    where: { opaqueKey },
  });

  if (!session || !isUsable(session)) return null;

  return {
    sessionId: session.id,
    tableId: session.tableId,
    step: session.step,
    expiresAt: session.expiresAt,
  };
}

function isUsable(session: Session): boolean {
  return (
    session.status === SessionStatus.ACTIVE &&
    session.expiresAt.getTime() > Date.now()
  );
}
