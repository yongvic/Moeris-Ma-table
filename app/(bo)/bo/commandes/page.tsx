import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";

export default async function BoCommandesPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");
  redirect("/bo/avis");
}
