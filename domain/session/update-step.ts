"use server";

import { SessionStep } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { getCurrentSession } from "./get-current";
import type { ActionResult } from "./types";
import { SessionErrorCode } from "./types";

const ALLOWED = new Set<SessionStep>([
  SessionStep.WELCOME,
  SessionStep.MENU,
  SessionStep.ORDER,
  SessionStep.END,
]);

/**
 * Persist séjour step on Session (Neon). Used by stubs / future epics.
 * Does not advance Service (lateral path — never call this from /service).
 */
export async function updateSessionStepAction(input: {
  step: SessionStep;
}): Promise<ActionResult<{ step: SessionStep }>> {
  if (!ALLOWED.has(input.step)) {
    return {
      ok: false,
      code: SessionErrorCode.INVALID_INPUT,
      message: "Étape de séjour inconnue.",
    };
  }

  const current = await getCurrentSession();
  if (!current) {
    return {
      ok: false,
      code: SessionErrorCode.SESSION_UNAVAILABLE,
      message: "Aucune session active. Scanne le QR Ma table.",
    };
  }

  await prisma.session.update({
    where: { id: current.sessionId },
    data: { step: input.step },
  });

  return { ok: true, step: input.step };
}
