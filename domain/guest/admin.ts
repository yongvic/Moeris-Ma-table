import { prisma } from "@/infra/prisma/client";
import { tasteLabel } from "@/domain/order/tastes";

export type GuestAdminView = {
  id: string;
  phone: string | null;
  email: string | null;
  tastes: string[];
  visits: number;
  createdAt: string;
  lastInteractionAt: string;
};

/** Base contacts clientèle (opt-in) pour l'espace équipe. */
export async function listGuestsForAdmin(): Promise<GuestAdminView[]> {
  const guests = await prisma.guest.findMany({
    orderBy: { lastInteractionAt: "desc" },
    include: { _count: { select: { sessions: true } } },
  });

  return guests.map((g) => ({
    id: g.id,
    phone: g.phoneE164,
    email: g.emailLower,
    tastes: Array.isArray(g.rememberedTastes)
      ? g.rememberedTastes
          .filter((t): t is string => typeof t === "string")
          .map(tasteLabel)
      : [],
    visits: g._count.sessions,
    createdAt: g.createdAt.toISOString(),
    lastInteractionAt: g.lastInteractionAt.toISOString(),
  }));
}

const CSV_HEADERS = [
  "Contact",
  "Type",
  "Gouts memorises",
  "Visites",
  "Premiere visite",
  "Derniere interaction",
] as const;

function csvCell(value: string): string {
  if (/[";\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function frDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Africa/Dakar",
  }).format(new Date(iso));
}

/**
 * Sérialise les contacts en CSV Excel-compatible (séparateur `;`, BOM UTF-8).
 * Le `;` est le séparateur attendu par Excel en locale FR.
 */
export function guestsToCsv(rows: GuestAdminView[]): string {
  const lines = [CSV_HEADERS.join(";")];

  for (const row of rows) {
    const contact = row.phone ?? row.email ?? "";
    const type = row.phone ? "Telephone" : row.email ? "Email" : "";
    lines.push(
      [
        csvCell(contact),
        csvCell(type),
        csvCell(row.tastes.join(", ")),
        csvCell(String(row.visits)),
        csvCell(frDateTime(row.createdAt)),
        csvCell(frDateTime(row.lastInteractionAt)),
      ].join(";"),
    );
  }

  // BOM pour que Excel lise l'UTF-8 (accents) correctement.
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
