export const TASTE_CHIPS = [
  { key: "no_chili", label: "Sans piment" },
  { key: "well_done", label: "Bien cuit" },
  { key: "extra_sauce", label: "Plus de sauce" },
  { key: "less_salt", label: "Moins salé" },
] as const;

export type TasteKey = (typeof TASTE_CHIPS)[number]["key"];

export function tasteLabel(key: string): string {
  return TASTE_CHIPS.find((t) => t.key === key)?.label ?? key;
}
