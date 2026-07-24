import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const tables = [
  { id: "t-1", label: "Table 1" },
  { id: "t-2", label: "Table 2" },
  { id: "t-3", label: "Table 3" },
  { id: "t-4", label: "Table 4" },
  { id: "t-5", label: "Table 5" },
] as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL required for seed");
  }

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
    console.log(`Seeded ${tables.length} tables: ${tables.map((t) => t.id).join(", ")}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
