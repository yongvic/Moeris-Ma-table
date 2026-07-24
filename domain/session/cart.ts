export type CartLine = {
  menuItemId: string;
  qty: number;
};

export type SessionCart = {
  lines: CartLine[];
  tastes: string[];
};

export function emptyCart(): SessionCart {
  return { lines: [], tastes: [] };
}

export function parseCart(raw: unknown): SessionCart {
  if (!raw || typeof raw !== "object") return emptyCart();
  const obj = raw as { lines?: unknown; tastes?: unknown };
  const lines = Array.isArray(obj.lines)
    ? obj.lines
        .filter(
          (l): l is CartLine =>
            !!l &&
            typeof l === "object" &&
            typeof (l as CartLine).menuItemId === "string" &&
            typeof (l as CartLine).qty === "number",
        )
        .map((l) => ({
          menuItemId: l.menuItemId,
          qty: Math.max(1, Math.floor(l.qty)),
        }))
    : [];
  const tastes = Array.isArray(obj.tastes)
    ? obj.tastes.filter((t): t is string => typeof t === "string")
    : [];
  return { lines, tastes };
}
