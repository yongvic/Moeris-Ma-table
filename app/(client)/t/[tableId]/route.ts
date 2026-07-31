import { redirect } from "next/navigation";

/** Legacy QR table — sourdine → avis. */
export async function GET() {
  redirect("/avis");
}
