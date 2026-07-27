import { BanniereReprise } from "@/components/client/banniere-reprise";
import { BarreProgressionSejour } from "@/components/client/barre-progression-sejour";
import { ClientNav } from "@/components/client/client-nav";
import { CookieHygiene } from "@/components/client/cookie-hygiene";
import { getActiveSession } from "@/domain/session/get-current";
import {
  getStepLabelFr,
  resolveResumeTarget,
} from "@/domain/session/steps";
import { sessionHasReceivedOrder } from "@/domain/order/queries";

/**
 * Client shell — fil léger Menu|Service(+Terminer si AD-13) + "le fil" + reprise.
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
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <CookieHygiene />
      {session ? <ClientNav canFinish={canFinish} /> : null}
      {session ? <BarreProgressionSejour step={session.step} /> : null}
      {session ? (
        <BanniereReprise
          stepLabel={getStepLabelFr(session.step)}
          continueHref={resolveResumeTarget(session.step)}
        />
      ) : null}

      <div
        className={`relative z-[1] flex flex-1 flex-col ${
          session ? "pb-28 sm:pb-10" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
