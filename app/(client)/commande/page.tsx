import { redirect } from "next/navigation";

/** Alias historique → espace « Mes commandes ». */
export default function CommandePage() {
  redirect("/mes-commandes");
}
