import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ForkKnife } from "@phosphor-icons/react/dist/ssr";
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
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-margin-mobile py-12 text-center">
        <p className="text-ink-secondary">
          Scanne le QR Ma table pour commander.{" "}
          <Link
            href="/t/t-1"
            className="font-semibold text-accent-deep underline underline-offset-4"
          >
            démo
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[860px] flex-1 flex-col px-margin-mobile py-6 md:px-7">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border/70 bg-surface-raised shadow-card">
        <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt={item.name}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 860px"
              className="object-cover"
            />
          ) : (
            <div className="relative grid h-full w-full place-items-center">
              <div className="pattern-wash opacity-70" aria-hidden />
              <ForkKnife size={56} weight="duotone" className="relative text-accent-deep" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/70 via-surface-deep/10 to-transparent" />

          <Link
            href="/menu"
            aria-label="Retour à la carte"
            className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-surface-base/85 text-ink-primary shadow-soft backdrop-blur-sm transition-transform hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <ArrowLeft size={20} weight="bold" />
          </Link>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
            <h1 className="font-display text-[28px] font-semibold leading-[1.1] text-ink-oninverse drop-shadow-sm sm:text-[34px]">
              {item.name}
            </h1>
            <span className="tnum shrink-0 rounded-full bg-accent px-4 py-1.5 text-[16px] font-bold text-ink-onaccent shadow-glow">
              {formatPriceFr(item.priceCents)}
            </span>
          </div>
        </div>
      </div>

      <FicheCommande
        item={item}
        initialTastes={initialTastes}
        rememberedTastes={rememberedTastes}
      />
    </main>
  );
}
