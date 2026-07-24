"use server";

import { prisma } from "@/infra/prisma/client";
import { readSessionOpaqueKey, writeSessionOpaqueKey } from "./cookie";
import { openOrResumeSession } from "./open-or-resume";
import type { ActionResult } from "./types";
import type { OpenOrResumeData } from "./open-or-resume";

/**
 * Server Action — open or resume table session (AD-4).
 * Sets httpOnly `mt_session` cookie with opaque key only (AD-5).
 */
export async function openOrResumeSessionAction(input: {
  tableId: string;
}): Promise<ActionResult<OpenOrResumeData>> {
  const opaqueKey = await readSessionOpaqueKey();
  const result = await openOrResumeSession(prisma, {
    tableId: input.tableId,
    opaqueKey,
  });

  if (!result.ok) {
    return result;
  }

  await writeSessionOpaqueKey(result.opaqueKey);
  return result;
}
