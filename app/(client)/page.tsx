import { redirect } from "next/navigation";

/** Client root → Accueil (parcours séjour). */
export default function ClientRootPage() {
  redirect("/accueil");
}
