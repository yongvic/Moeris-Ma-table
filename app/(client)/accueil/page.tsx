export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

/** Entrée plateforme → menu. */
export default function AccueilPage() {
  redirect("/menu");
}
