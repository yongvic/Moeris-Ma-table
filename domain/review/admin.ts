"use server";

import { prisma } from "@/infra/prisma/client";

export type AdminReviewRow = {
  id: string;
  stars: number;
  starsService: number | null;
  starsPlace: number | null;
  comment: string | null;
  highlights: string[];
  createdAt: Date;
  guest: {
    id: string;
    phoneE164: string | null;
    emailLower: string | null;
  } | null;
};

export async function listReviewsForAdmin(
  limit = 100,
): Promise<AdminReviewRow[]> {
  const rows = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      guest: {
        select: { id: true, phoneE164: true, emailLower: true },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    stars: r.stars,
    starsService: r.starsService,
    starsPlace: r.starsPlace,
    comment: r.comment,
    highlights: Array.isArray(r.highlights)
      ? r.highlights.filter((h): h is string => typeof h === "string")
      : [],
    createdAt: r.createdAt,
    guest: r.guest,
  }));
}
