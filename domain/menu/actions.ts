"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/infra/auth/require-staff";
import { uploadMenuPhoto } from "@/infra/blob/upload";
import { prisma } from "@/infra/prisma/client";
import { MENU_CACHE_TAG } from "./constants";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; code: string; message: string };

/** Price stored as integer FCFA (centimes field name = whole FCFA units). */
function parsePriceCents(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.round(raw);
  }
  const s = String(raw ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export async function createMenuItem(formData: FormData): Promise<ActionResult> {
  const gate = await requireStaff();
  if (!gate.ok) return gate;

  const name = String(formData.get("name") ?? "").trim();
  const priceCents = parsePriceCents(formData.get("price"));
  const available = formData.get("available") === "on" || formData.get("available") === "true";

  if (!name) {
    return { ok: false, code: "VALIDATION", message: "Le nom du plat est requis." };
  }
  if (priceCents === null) {
    return { ok: false, code: "VALIDATION", message: "Prix invalide." };
  }

  let photoUrl: string | null = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const up = await uploadMenuPhoto(file);
    if (!up.ok) return up;
    photoUrl = up.url;
  }

  const maxSort = await prisma.menuItem.aggregate({ _max: { sortOrder: true } });
  const item = await prisma.menuItem.create({
    data: {
      name,
      priceCents,
      available,
      photoUrl,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  revalidateMenu();
  return { ok: true, id: item.id };
}

export async function updateMenuItem(formData: FormData): Promise<ActionResult> {
  const gate = await requireStaff();
  if (!gate.ok) return gate;

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const priceCents = parsePriceCents(formData.get("price"));
  const available =
    formData.get("available") === "on" || formData.get("available") === "true";

  if (!id) return { ok: false, code: "VALIDATION", message: "Plat introuvable." };
  if (!name) {
    return { ok: false, code: "VALIDATION", message: "Le nom du plat est requis." };
  }
  if (priceCents === null) {
    return { ok: false, code: "VALIDATION", message: "Prix invalide." };
  }

  const data: {
    name: string;
    priceCents: number;
    available: boolean;
    photoUrl?: string | null;
  } = { name, priceCents, available };

  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const up = await uploadMenuPhoto(file);
    if (!up.ok) return up;
    data.photoUrl = up.url;
  }

  await prisma.menuItem.update({ where: { id }, data });
  revalidateMenu();
  return { ok: true, id };
}

export async function setMenuItemAvailability(
  id: string,
  available: boolean,
): Promise<ActionResult> {
  const gate = await requireStaff();
  if (!gate.ok) return gate;

  if (!id) return { ok: false, code: "VALIDATION", message: "Plat introuvable." };

  await prisma.menuItem.update({ where: { id }, data: { available } });
  revalidateMenu();
  return { ok: true, id };
}

function revalidateMenu() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (revalidateTag as unknown as (tag: string, ...args: any[]) => void)(MENU_CACHE_TAG);
  revalidatePath("/menu", "layout");
  revalidatePath("/bo/menu", "layout");
}
