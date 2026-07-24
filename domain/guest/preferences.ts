import { prisma } from "@/infra/prisma/client";

const MAX_PREFS = 5;

/**
 * Ranking V1 (AD-20): frequency of MenuItem in Guest-linked OrderLines,
 * then recency; cap 5.
 */
export async function recomputePreferencesForGuest(
  guestId: string,
): Promise<void> {
  const sessions = await prisma.session.findMany({
    where: { guestId },
    select: { id: true },
  });
  const sessionIds = sessions.map((s) => s.id);
  if (sessionIds.length === 0) return;

  const orders = await prisma.order.findMany({
    where: { sessionId: { in: sessionIds } },
    include: { lines: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = new Map<
    string,
    { count: number; label: string; lastAt: number }
  >();

  for (const order of orders) {
    for (const line of order.lines) {
      const prev = counts.get(line.menuItemId);
      counts.set(line.menuItemId, {
        count: (prev?.count ?? 0) + line.qty,
        label: line.nameSnapshot,
        lastAt: Math.max(prev?.lastAt ?? 0, order.createdAt.getTime()),
      });
    }
  }

  const ranked = [...counts.entries()]
    .sort((a, b) => {
      if (b[1].count !== a[1].count) return b[1].count - a[1].count;
      return b[1].lastAt - a[1].lastAt;
    })
    .slice(0, MAX_PREFS);

  await prisma.$transaction(async (tx) => {
    await tx.preference.deleteMany({ where: { guestId } });
    if (ranked.length === 0) return;
    await tx.preference.createMany({
      data: ranked.map(([menuItemId, meta], index) => ({
        guestId,
        menuItemId,
        label: meta.label,
        rank: index + 1,
      })),
    });
  });

  // Remember last order tastes for 1-tap reapply (5.3)
  const lastWithTastes = orders.find((o) => {
    const t = o.tastesJson;
    return Array.isArray(t) && t.length > 0;
  });
  if (lastWithTastes) {
    await prisma.guest.update({
      where: { id: guestId },
      data: {
        rememberedTastes: lastWithTastes.tastesJson ?? [],
        lastInteractionAt: new Date(),
      },
    });
  }
}

export async function listPreferencesForGuest(guestId: string): Promise<
  { menuItemId: string; label: string; rank: number }[]
> {
  const rows = await prisma.preference.findMany({
    where: { guestId },
    orderBy: { rank: "asc" },
    take: MAX_PREFS,
  });
  return rows.map((r) => ({
    menuItemId: r.menuItemId,
    label: r.label,
    rank: r.rank,
  }));
}
