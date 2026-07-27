export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { getActiveSession } from "@/domain/session/get-current";
import {
  getLatestSessionOrder,
  sessionHasReceivedOrder,
} from "@/domain/order/queries";
import { getPublicPusherConfig } from "@/infra/pusher/publish";
import { CommandeLive } from "@/components/client/commande-live";
import { ButtonPrimary } from "@/components/client/button-primary";

export default async function CommandePage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const order = await getLatestSessionOrder(session.sessionId);
  const canFinish = await sessionHasReceivedOrder(session.sessionId);
  const pusher = getPublicPusherConfig();

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-margin-mobile py-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <ForkKnife size={30} weight="fill" />
        </span>
        <h1 className="font-display text-[26px] font-semibold text-ink-primary">
          Pas encore de commande
        </h1>
        <p className="text-ink-secondary">
          Choisis un plat sur la carte — un tap suffit pour l&apos;envoyer.
        </p>
        <ButtonPrimary href="/menu" className="sm:w-auto">
          Voir la carte
        </ButtonPrimary>
      </main>
    );
  }

  return (
    <CommandeLive
      initialOrder={order}
      sessionId={session.sessionId}
      pusher={pusher}
      canFinish={canFinish}
    />
  );
}
