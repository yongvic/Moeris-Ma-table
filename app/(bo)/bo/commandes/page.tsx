import { redirect } from "next/navigation";
import { CookingPot } from "@phosphor-icons/react/dist/ssr";
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
      <header className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
          <CookingPot size={22} weight="fill" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[26px] font-semibold leading-8 text-ink-primary">
            Commandes
          </h1>
          <p className="max-w-lg text-[15px] text-ink-secondary">
            Suivi salle — reçue → en préparation → servie.
          </p>
        </div>
      </header>
      <BoOrdersPanel initialOrders={orders} pusher={pusher} />
    </main>
  );
}
