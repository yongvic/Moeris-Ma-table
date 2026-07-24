import Image from "next/image";
import Link from "next/link";
import { ForkKnife, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { formatPriceFr, type MenuItemView } from "@/domain/menu/queries";

/** Carte plat — photo héroïque, prix en pastille, lift au survol. */
export function MenuCard({ item }: { item: MenuItemView }) {
  return (
    <Link
      href={`/menu/${item.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border/70 bg-surface-base shadow-card transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="relative grid h-full w-full place-items-center">
            <div className="pattern-wash opacity-70" aria-hidden />
            <ForkKnife
              size={44}
              weight="duotone"
              className="relative text-accent-deep"
            />
          </div>
        )}
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface-base/85 text-ink-primary opacity-0 shadow-soft backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} weight="bold" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="font-display text-[18px] font-semibold leading-6 text-ink-primary">
          {item.name}
        </p>
        <span className="tnum shrink-0 rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-ink-primary">
          {formatPriceFr(item.priceCents)}
        </span>
      </div>
    </Link>
  );
}
