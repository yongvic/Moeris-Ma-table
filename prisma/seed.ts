import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const tables = [
  { id: "t-1", label: "Table 1" },
  { id: "t-2", label: "Table 2" },
  { id: "t-3", label: "Table 3" },
  { id: "t-4", label: "Table 4" },
  { id: "t-5", label: "Table 5" },
] as const;

const menuSeed = [
  {
    name: "Thiéboudienne",
    priceCents: 4500,
    available: true,
    sortOrder: 1,
    photoUrl: "/menu/thieboudienne.png" as string | null,
  },
  {
    name: "Yassa poulet",
    priceCents: 4000,
    available: true,
    sortOrder: 2,
    photoUrl: "/menu/yassa-poulet.png",
  },
  {
    name: "Pastels (indispo)",
    priceCents: 1500,
    available: false,
    sortOrder: 3,
    photoUrl: "/menu/pastels.png",
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL required for seed");

  const adapter = new PrismaNeon({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const table of tables) {
      await prisma.table.upsert({
        where: { id: table.id },
        create: { id: table.id, label: table.label },
        update: { label: table.label },
      });
    }

    const staffEmail = (process.env.STAFF_EMAIL || "salle@moeris.local").toLowerCase();
    const staffPassword = process.env.STAFF_PASSWORD || "moeris-salle";
    const passwordHash = await bcrypt.hash(staffPassword, 10);
    await prisma.staff.upsert({
      where: { email: staffEmail },
      create: { email: staffEmail, passwordHash, role: "salle" },
      update: { passwordHash, role: "salle" },
    });

    const existingMenu = await prisma.menuItem.count();
    if (existingMenu === 0) {
      await prisma.menuItem.createMany({ data: menuSeed });
    }

    console.log(`Seeded tables ${tables.map((t) => t.id).join(", ")}`);
    console.log(`Staff: ${staffEmail} / (password from STAFF_PASSWORD or default)`);
    console.log(`Menu items: ${await prisma.menuItem.count()}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
