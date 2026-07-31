import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";

export default async function BoHomePage() {
  const session = await auth();
  redirect(session?.user ? "/bo/avis" : "/bo/connexion");
}
