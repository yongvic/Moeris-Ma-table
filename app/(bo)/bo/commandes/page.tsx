import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";
import { listOpenOrders } from "@/domain/order/queries";
import { BoOrdersPanel } from "@/components/bo/bo-orders-panel";
import { getPublicPusherConfig } from "@/infra/pusher/publish";

export const dynamic = "force-dynamic";

export default async function BoCommandesPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const orders = await listOpenOrders();
  const pusher = getPublicPusherConfig();

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Commandes
        </h1>
        <p className="max-w-lg text-base text-ink-secondary">
          Suivi salle — reçue → en préparation → servie.
        </p>
      </header>
      <BoOrdersPanel initialOrders={orders} pusher={pusher} />
    </main>
  );
}
