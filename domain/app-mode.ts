/**
 * Mode produit actuel.
 * - `avis_contact` : avis → contact, carte images, pas de tables/commandes
 * - `legacy_tables` : ancien fil QR table + commandes (sourdine)
 */
export const APP_MODE = "avis_contact" as const;

export type AppMode = typeof APP_MODE | "legacy_tables";

export function isAvisContactMode(): boolean {
  return APP_MODE === "avis_contact";
}
