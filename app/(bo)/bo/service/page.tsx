import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";
import { listOpenServiceRequests } from "@/domain/service/queries";
import { BoServicePanel } from "@/components/bo/bo-service-panel";
import { getPublicPusherConfig } from "@/infra/pusher/publish";

export const dynamic = "force-dynamic";

export default async function BoServicePage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const requests = await listOpenServiceRequests();
  const pusher = getPublicPusherConfig();

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Service
        </h1>
        <p className="max-w-lg text-base text-ink-secondary">
          Micro-missions clients — un tap pour marquer fait.
        </p>
      </header>
      <BoServicePanel initialRequests={requests} pusher={pusher} />
    </main>
  );
}
