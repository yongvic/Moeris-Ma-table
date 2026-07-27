import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/infra/auth/auth";
import {
  listGuestsForAdmin,
  guestsToCsv,
  guestsToXlsxBuffer,
} from "@/domain/guest/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? "csv";
  const rows = await listGuestsForAdmin();
  const today = new Date().toISOString().slice(0, 10);

  if (format === "xlsx" || format === "excel") {
    const buffer = guestsToXlsxBuffer(rows);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="contacts-moeris-${today}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const csv = guestsToCsv(rows);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contacts-moeris-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
