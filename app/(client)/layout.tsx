import { ClientNav } from "@/components/client/client-nav";
import { CookieHygiene } from "@/components/client/cookie-hygiene";

/**
 * Shell client — mode avis_contact : nav Avis | La carte.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <CookieHygiene />
      <ClientNav />
      <div className="relative z-[1] flex flex-1 flex-col pb-10">
        {children}
      </div>
    </div>
  );
}
