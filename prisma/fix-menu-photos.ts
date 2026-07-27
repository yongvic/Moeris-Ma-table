import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const PHOTOS: Record<string, string> = {
  "Thiéboudienne": "/menu/thieboudienne.png",
  "Yassa poulet": "/menu/yassa-poulet.png",
  "Pastels (indispo)": "/menu/pastels.png",
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL required");

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: url }),
  });

  try {
    const items = await prisma.menuItem.findMany({
      select: { id: true, name: true, photoUrl: true },
    });

    console.log("Avant :");
    for (const item of items) {
      console.log(`  ${item.name}: ${item.photoUrl ?? "(vide)"}`);
    }

    let updated = 0;
    for (const item of items) {
      const target = PHOTOS[item.name];
      if (!target) continue;
      if (item.photoUrl === target) continue;
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { photoUrl: target },
      });
      updated += 1;
    }

    console.log(`\n${updated} plat(s) mis à jour.`);

    const after = await prisma.menuItem.findMany({
      select: { name: true, photoUrl: true },
    });
    console.log("\nAprès :");
    for (const item of after) {
      console.log(`  ${item.name}: ${item.photoUrl ?? "(vide)"}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
