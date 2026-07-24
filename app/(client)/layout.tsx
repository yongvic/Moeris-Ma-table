import { ClientNav } from "@/components/client/client-nav";
import { getCurrentSession } from "@/domain/session/get-current";

/**
 * Client shell — fil léger Menu | Service when session is active.
 * No "Terminer mon expérience" here (epic 4 / AD-13).
 */
export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {session ? <ClientNav /> : null}
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
