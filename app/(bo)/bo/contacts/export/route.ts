import { NextResponse } from "next/server";
import { auth } from "@/infra/auth/auth";
import { listGuestsForAdmin, guestsToCsv } from "@/domain/guest/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const rows = await listGuestsForAdmin();
  const csv = guestsToCsv(rows);

  const today = new Date().toISOString().slice(0, 10);
  const filename = `contacts-moeris-${today}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
