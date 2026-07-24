import { unstable_cache } from "next/cache";
import { prisma } from "@/infra/prisma/client";
import { MENU_CACHE_TAG } from "./constants";

export type MenuItemView = {
  id: string;
  name: string;
  priceCents: number;
  available: boolean;
  photoUrl: string | null;
  sortOrder: number;
};

/** BO: full catalogue including unavailable. */
export async function listMenuForBo(): Promise<MenuItemView[]> {
  const rows = await prisma.menuItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(toView);
}

/** Client: published catalogue (available only). Short-lived cache + tag (AD-16). */
export async function listPublishedMenu(): Promise<MenuItemView[]> {
  return unstable_cache(
    async () => {
      const rows = await prisma.menuItem.findMany({
        where: { available: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return rows.map(toView);
    },
    ["published-menu"],
    { tags: [MENU_CACHE_TAG], revalidate: 30 },
  )();
}

export async function getMenuItemById(
  id: string,
): Promise<MenuItemView | null> {
  const row = await prisma.menuItem.findUnique({ where: { id } });
  return row ? toView(row) : null;
}

function toView(row: {
  id: string;
  name: string;
  priceCents: number;
  available: boolean;
  photoUrl: string | null;
  sortOrder: number;
}): MenuItemView {
  return {
    id: row.id,
    name: row.name,
    priceCents: row.priceCents,
    available: row.available,
    photoUrl: row.photoUrl,
    sortOrder: row.sortOrder,
  };
}

export function formatPriceFr(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(cents);
}
