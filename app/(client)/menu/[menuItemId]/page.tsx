import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { getMenuItemById, formatPriceFr } from "@/domain/menu/queries";
import { prisma } from "@/infra/prisma/client";
import { parseCart } from "@/domain/session/cart";
import { FicheCommande } from "@/components/client/fiche-commande";

export const dynamic = "force-dynamic";

export default async function FichePlatPage({
  params,
}: {
  params: Promise<{ menuItemId: string }>;
}) {
  const { menuItemId } = await params;
  const item = await getMenuItemById(menuItemId);

  if (!item || !item.available) notFound();

  const session = await getActiveSession();
  let initialTastes: string[] = [];
  let rememberedTastes: string[] = [];

  if (session) {
    const full = await prisma.session.findUnique({
      where: { id: session.sessionId },
      include: { guest: true },
    });
    if (full) {
      const cart = parseCart(full.cartJson);
      initialTastes = cart.tastes;
      if (Array.isArray(full.guest?.rememberedTastes)) {
        rememberedTastes = full.guest.rememberedTastes.filter(
          (t): t is string => typeof t === "string",
        );
      }
    }
  }

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-margin-mobile py-7 md:px-7">
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour commander.{" "}
          <Link href="/t/t-1" className="underline text-ink-primary">
            /t/t-1
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col md:px-7">
      {item.photoUrl ? (
        <div className="relative h-56 w-full overflow-hidden bg-surface-raised sm:h-72 sm:rounded-t-md">
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(max-width:768px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center bg-surface-raised/50 sm:rounded-t-md">
          <span className="text-5xl" aria-hidden>
            🍽
          </span>
        </div>
      )}
      <p className="px-margin-mobile pt-2 text-sm text-ink-secondary md:px-0">
        {formatPriceFr(item.priceCents)}
      </p>
      <FicheCommande
        item={item}
        initialTastes={initialTastes}
        rememberedTastes={rememberedTastes}
      />
    </main>
  );
}
