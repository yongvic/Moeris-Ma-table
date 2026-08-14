import { ClientNav } from "@/components/client/client-nav";
import { ClientFooter } from "@/components/client/client-footer";
import { CookieHygiene } from "@/components/client/cookie-hygiene";

/**
 * Shell client — nav figée en haut au scroll, contenu central, footer.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <CookieHygiene />
      <ClientNav />
      {/* Espace sous la navbar figée */}
      <div className="relative z-[1] flex flex-1 flex-col pt-[58px] sm:pt-[66px]">
        {children}
      </div>
      <ClientFooter />
    </div>
  );
}
