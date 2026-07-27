import { redirect } from "next/navigation";
import { ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/infra/auth/auth";
import { listRecentOrders } from "@/domain/order/queries";
import { BoOrderHistory } from "@/components/bo/bo-order-history";

export const dynamic = "force-dynamic";

export default async function BoHistoriquePage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const orders = await listRecentOrders(80);

  const withGuest = orders.filter((o) => o.guest).length;
  const anonymous = orders.length - withGuest;

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
          <ClockCounterClockwise size={22} weight="fill" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[26px] font-semibold leading-8 text-ink-primary">
            Historique des commandes
          </h1>
          <p className="max-w-xl text-[15px] text-ink-secondary">
            {orders.length > 0
              ? `${orders.length} commande${orders.length > 1 ? "s" : ""} récente${orders.length > 1 ? "s" : ""} — ${withGuest} client${withGuest > 1 ? "s" : ""} identifié${withGuest > 1 ? "s" : ""}, ${anonymous} anonyme${anonymous > 1 ? "s" : ""}.`
              : "Les commandes passées apparaîtront ici, avec le client quand il a laissé son contact."}
          </p>
        </div>
      </header>

      <BoOrderHistory orders={orders} />
    </main>
  );
}
