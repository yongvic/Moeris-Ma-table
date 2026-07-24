import { BanniereReprise } from "@/components/client/banniere-reprise";
import { BarreProgressionSejour } from "@/components/client/barre-progression-sejour";
import { ClientNav } from "@/components/client/client-nav";
import { getActiveSession } from "@/domain/session/get-current";
import {
  getStepLabelFr,
  resolveResumeTarget,
} from "@/domain/session/steps";
import { sessionHasReceivedOrder } from "@/domain/order/queries";

/**
 * Client shell — nav Menu|Service(+Terminer si gate AD-13) + progress + reprise.
 */
export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getActiveSession();
  const canFinish = session
    ? await sessionHasReceivedOrder(session.sessionId)
    : false;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {session ? <ClientNav canFinish={canFinish} /> : null}
      {session ? <BarreProgressionSejour step={session.step} /> : null}
      {session ? (
        <BanniereReprise
          stepLabel={getStepLabelFr(session.step)}
          continueHref={resolveResumeTarget(session.step)}
        />
      ) : null}
      <div
        className={`flex flex-1 flex-col ${
          session ? "pb-20 sm:pb-0" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
