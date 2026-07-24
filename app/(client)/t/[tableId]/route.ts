import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_MAX_AGE_SEC,
  SESSION_COOKIE_NAME,
} from "@/domain/session/constants";
import { openOrResumeSession } from "@/domain/session/open-or-resume";
import { resolveResumeTarget } from "@/domain/session/steps";
import { prisma } from "@/infra/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ tableId: string }>;
};

/**
 * QR Ma table entry — URL: /t/<tableId>
 * Opens/resumes Session and restores step route; `?reprise=1` when resumed.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { tableId } = await context.params;
  const opaqueFromCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const result = await openOrResumeSession(prisma, {
    tableId,
    opaqueKey: opaqueFromCookie,
  });

  if (!result.ok) {
    const errorUrl = new URL("/accueil", request.url);
    errorUrl.searchParams.set("error", result.code);
    errorUrl.searchParams.set("message", result.message);
    return NextResponse.redirect(errorUrl);
  }

  const target = new URL(resolveResumeTarget(result.step), request.url);
  if (result.resumed) {
    target.searchParams.set("reprise", "1");
  }

  const response = NextResponse.redirect(target);
  const secure =
    process.env.VERCEL === "1" || process.env.COOKIE_SECURE === "true";

  response.cookies.set(SESSION_COOKIE_NAME, result.opaqueKey, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SEC,
  });

  return response;
}
