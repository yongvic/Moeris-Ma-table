import { randomUUID } from "node:crypto";
import type { PrismaClient, Session } from "@prisma/client";
import { SessionStatus, SessionStep } from "@prisma/client";
import { SESSION_TTL_MS } from "./constants";
import {
  SessionErrorCode,
  type ActionResult,
} from "./types";

export type OpenOrResumeInput = {
  tableId: string;
  /** Opaque key from `mt_session` cookie, if any. */
  opaqueKey?: string | null;
};

export type OpenOrResumeData = {
  sessionId: string;
  tableId: string;
  opaqueKey: string;
  step: SessionStep;
  resumed: boolean;
};

export type OpenOrResumeResult = ActionResult<OpenOrResumeData>;

function err(code: string, message: string): OpenOrResumeResult {
  return { ok: false, code, message };
}

function isActiveUsable(session: Session, now: Date): boolean {
  return (
    session.status === SessionStatus.ACTIVE && session.expiresAt.getTime() > now.getTime()
  );
}

/**
 * Open or resume at most one ACTIVE session per table within TTL (AD-5, AD-9).
 * Pure domain use-case — cookie I/O stays in actions / cookie helpers.
 */
export async function openOrResumeSession(
  prisma: PrismaClient,
  input: OpenOrResumeInput,
): Promise<OpenOrResumeResult> {
  const tableId = input.tableId?.trim();
  if (!tableId) {
    return err(
      SessionErrorCode.INVALID_INPUT,
      "Identifiant de table manquant.",
    );
  }

  const table = await prisma.table.findUnique({ where: { id: tableId } });
  if (!table) {
    return err(
      SessionErrorCode.TABLE_NOT_FOUND,
      "Cette table n’est pas reconnue. Vérifie le QR Ma table.",
    );
  }

  const now = new Date();
  const opaqueFromCookie = input.opaqueKey?.trim() || undefined;

  try {
    return await prisma.$transaction(async (tx) => {
      // 1) Cookie opaque → resume if ACTIVE + non-expired + same table
      if (opaqueFromCookie) {
        const byCookie = await tx.session.findUnique({
          where: { opaqueKey: opaqueFromCookie },
        });

        if (byCookie && byCookie.tableId === tableId) {
          // A finished séjour (END) is terminal — a rescan opens a fresh one.
          if (isActiveUsable(byCookie, now) && byCookie.step !== SessionStep.END) {
            await expireOtherActives(tx, tableId, byCookie.id, now);
            return {
              ok: true as const,
              sessionId: byCookie.id,
              tableId,
              opaqueKey: byCookie.opaqueKey,
              step: byCookie.step,
              resumed: true,
            };
          }

          // Cookie points at expired/closed séjour — mark EXPIRED, do not resume step
          if (
            byCookie.status === SessionStatus.ACTIVE &&
            byCookie.expiresAt.getTime() <= now.getTime()
          ) {
            await tx.session.update({
              where: { id: byCookie.id },
              data: { status: SessionStatus.EXPIRED, updatedAt: now },
            });
          }
        }
      }

      // 2) Rescan même table : Session ACTIVE non expirée et non terminée (END exclu)
      const existingActive = await tx.session.findFirst({
        where: {
          tableId,
          status: SessionStatus.ACTIVE,
          expiresAt: { gt: now },
          NOT: { step: SessionStep.END },
        },
        orderBy: { createdAt: "asc" },
      });

      if (existingActive) {
        await expireOtherActives(tx, tableId, existingActive.id, now);
        return {
          ok: true as const,
          sessionId: existingActive.id,
          tableId,
          opaqueKey: existingActive.opaqueKey,
          step: existingActive.step,
          resumed: true,
        };
      }

      // 3) Créer une Session anonyme (Accueil / WELCOME) — includes post-TTL path
      await expireAllActives(tx, tableId, now);

      const opaqueKey = randomUUID();
      const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

      const created = await tx.session.create({
        data: {
          tableId,
          opaqueKey,
          status: SessionStatus.ACTIVE,
          step: SessionStep.WELCOME,
          cartJson: {},
          expiresAt,
        },
      });

      return {
        ok: true as const,
        sessionId: created.id,
        tableId,
        opaqueKey: created.opaqueKey,
        step: created.step,
        resumed: false,
      };
    });
  } catch {
    return err(
      SessionErrorCode.SESSION_UNAVAILABLE,
      "Impossible d’ouvrir la session pour le moment. Réessaie dans un instant.",
    );
  }
}

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

async function expireOtherActives(
  tx: Tx,
  tableId: string,
  keepSessionId: string,
  now: Date,
): Promise<void> {
  await tx.session.updateMany({
    where: {
      tableId,
      status: SessionStatus.ACTIVE,
      id: { not: keepSessionId },
    },
    data: {
      status: SessionStatus.EXPIRED,
      updatedAt: now,
    },
  });
}

async function expireAllActives(
  tx: Tx,
  tableId: string,
  now: Date,
): Promise<void> {
  await tx.session.updateMany({
    where: {
      tableId,
      status: SessionStatus.ACTIVE,
    },
    data: {
      status: SessionStatus.EXPIRED,
      updatedAt: now,
    },
  });
}
