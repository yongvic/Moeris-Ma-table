export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import {
  listSessionOrders,
  sessionHasReceivedOrder,
} from "@/domain/order/queries";
import { getPublicPusherConfig } from "@/infra/pusher/publish";
import { MesCommandesLive } from "@/components/client/mes-commandes-live";

export default async function MesCommandesPage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const orders = await listSessionOrders(session.sessionId);
  const canFinish = await sessionHasReceivedOrder(session.sessionId);
  const pusher = getPublicPusherConfig();

  return (
    <MesCommandesLive
      initialOrders={orders}
      sessionId={session.sessionId}
      pusher={pusher}
      canFinish={canFinish}
    />
  );
}
