export const dynamic = "force-dynamic";

import { MenuCard } from "@/components/client/menu-card";
import { MenuImageViewer } from "@/components/client/menu-image-viewer";
import { Reveal } from "@/components/ui/reveal";
import { listPublishedMenu } from "@/domain/menu/queries";
import {
  MENU_PAGE_IMAGES,
  USE_IMAGE_MENU,
} from "@/domain/menu/image-menu";

export default async function MenuPage() {
  // ——— Mode carte images (actif) ———
  if (USE_IMAGE_MENU) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 px-margin-mobile py-6 md:px-7 md:py-8">
        <Reveal className="flex flex-col gap-1.5" as="section">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
            Résidence Moeris
          </span>
          <h1 className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[36px]">
            La carte
          </h1>
        </Reveal>

        <MenuImageViewer pages={MENU_PAGE_IMAGES} />
      </main>
    );
  }

  // ——— Ancienne logique interactive (sourdine) ———
  const items = await listPublishedMenu();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-7 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2" as="section">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          Résidence Moeris
        </span>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[36px]">
          La carte
        </h1>
      </Reveal>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-10 text-center">
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            La carte se prépare
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} as="li" index={i} y={22}>
              <MenuCard item={item} />
            </Reveal>
          ))}
        </ul>
      )}
    </main>
  );
}
