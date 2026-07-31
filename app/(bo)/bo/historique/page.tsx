import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";

export default async function BoHistoriquePage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");
  redirect("/bo/avis");
}
