"use server";

import {
  ServiceRequestType,
  ServiceStatus,
  SessionStatus,
} from "@prisma/client";
import { prisma } from "@/infra/prisma/client";
import { publishFloorEvent } from "@/infra/pusher/publish";
import { getActiveSession } from "@/domain/session/get-current";
import { requireStaff } from "@/infra/auth/require-staff";

export type ServiceActionResult =
  | { ok: true; id?: string }
  | { ok: false; code: string; message: string };

const ALLOWED = new Set<string>(Object.values(ServiceRequestType));

export async function createServiceRequestAction(
  type: string,
): Promise<ServiceActionResult> {
  const session = await getActiveSession();
  if (!session) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Scanne le QR Ma table d’abord.",
    };
  }

  if (!ALLOWED.has(type)) {
    return { ok: false, code: "VALIDATION", message: "Demande inconnue." };
  }

  const full = await prisma.session.findUnique({
    where: { id: session.sessionId },
  });
  if (!full || full.status !== SessionStatus.ACTIVE) {
    return {
      ok: false,
      code: "NO_SESSION",
      message: "Session expirée — rescane le QR.",
    };
  }

  const created = await prisma.serviceRequest.create({
    data: {
      sessionId: session.sessionId,
      tableId: session.tableId,
      type: type as ServiceRequestType,
      status: ServiceStatus.OPEN,
    },
  });

  await publishFloorEvent({
    kind: "service",
    id: created.id,
    tableId: created.tableId,
    status: created.status,
    at: new Date().toISOString(),
  });

  return { ok: true, id: created.id };
}

export async function completeServiceRequestAction(
  id: string,
): Promise<ServiceActionResult> {
  const gate = await requireStaff();
  if (!gate.ok) return gate;

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: { status: ServiceStatus.DONE },
  });

  await publishFloorEvent({
    kind: "service",
    id: updated.id,
    tableId: updated.tableId,
    status: updated.status,
    at: new Date().toISOString(),
  });

  return { ok: true, id };
}
