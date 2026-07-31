export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

/** Entrée plateforme → avis. */
export default function AccueilPage() {
  redirect("/avis");
}
