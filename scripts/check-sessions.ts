import "dotenv/config";
import { PrismaClient, SessionStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
  });
  try {
    const actives = await p.session.findMany({
      where: { tableId: "t-1", status: SessionStatus.ACTIVE },
    });
    console.log("ACTIVE sessions for t-1:", actives.length);
    console.log(
      "opaqueKeys:",
      actives.map((s) => s.opaqueKey).join(","),
    );
  } finally {
    await p.$disconnect();
  }
}

main();
