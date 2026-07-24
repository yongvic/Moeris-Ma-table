import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  SessionStatus,
  SessionStep,
  type PrismaClient,
  type Session,
  type Table,
} from "@prisma/client";
import { openOrResumeSession } from "./open-or-resume";

type Store = {
  tables: Map<string, Table>;
  sessions: Map<string, Session>;
};

function createMemoryPrisma(store: Store): PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api: any = {
    table: {
      findUnique: async ({ where: { id } }: { where: { id: string } }) =>
        store.tables.get(id) ?? null,
    },
    session: {
      findUnique: async ({
        where: { opaqueKey },
      }: {
        where: { opaqueKey: string };
      }) =>
        [...store.sessions.values()].find((s) => s.opaqueKey === opaqueKey) ??
        null,
      findFirst: async ({
        where,
      }: {
        where: {
          tableId: string;
          status: SessionStatus;
          expiresAt: { gt: Date };
        };
        orderBy?: unknown;
      }) => {
        const match = [...store.sessions.values()]
          .filter(
            (s) =>
              s.tableId === where.tableId &&
              s.status === where.status &&
              s.expiresAt.getTime() > where.expiresAt.gt.getTime(),
          )
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return match[0] ?? null;
      },
      create: async ({
        data,
      }: {
        data: {
          tableId: string;
          opaqueKey: string;
          status: SessionStatus;
          step: SessionStep;
          cartJson: unknown;
          expiresAt: Date;
        };
      }) => {
        const now = new Date();
        const session: Session = {
          id: randomUUID(),
          tableId: data.tableId,
          opaqueKey: data.opaqueKey,
          status: data.status,
          step: data.step,
          cartJson: data.cartJson as Session["cartJson"],
          expiresAt: data.expiresAt,
          createdAt: now,
          updatedAt: now,
          guestId: null,
        };
        store.sessions.set(session.id, session);
        return session;
      },
      update: async ({
        where: { id },
        data,
      }: {
        where: { id: string };
        data: { status: SessionStatus; updatedAt: Date };
      }) => {
        const session = store.sessions.get(id);
        if (!session) throw new Error("not found");
        session.status = data.status;
        session.updatedAt = data.updatedAt;
        return session;
      },
      updateMany: async ({
        where,
        data,
      }: {
        where: {
          tableId: string;
          status: SessionStatus;
          id?: { not: string };
        };
        data: { status: SessionStatus; updatedAt: Date };
      }) => {
        let count = 0;
        for (const session of store.sessions.values()) {
          if (session.tableId !== where.tableId) continue;
          if (session.status !== where.status) continue;
          if (where.id?.not && session.id === where.id.not) continue;
          session.status = data.status;
          session.updatedAt = data.updatedAt;
          count += 1;
        }
        return { count };
      },
    },
    $transaction: async <T>(fn: (tx: typeof api) => Promise<T>) => fn(api),
  };

  return api as unknown as PrismaClient;
}

describe("openOrResumeSession", () => {
  let store: Store;
  let prisma: PrismaClient;

  beforeEach(() => {
    store = {
      tables: new Map([
        [
          "t-1",
          { id: "t-1", label: "Table 1", createdAt: new Date() },
        ],
      ]),
      sessions: new Map(),
    };
    prisma = createMemoryPrisma(store);
  });

  it("creates a session when no cookie and no active session", async () => {
    const result = await openOrResumeSession(prisma, { tableId: "t-1" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.resumed, false);
    assert.equal(result.tableId, "t-1");
    assert.equal(result.step, SessionStep.WELCOME);
    assert.equal(store.sessions.size, 1);
  });

  it("resumes the same session on rescan without creating a second active", async () => {
    const first = await openOrResumeSession(prisma, { tableId: "t-1" });
    assert.equal(first.ok, true);
    if (!first.ok) return;

    const second = await openOrResumeSession(prisma, {
      tableId: "t-1",
      opaqueKey: first.opaqueKey,
    });
    assert.equal(second.ok, true);
    if (!second.ok) return;

    assert.equal(second.resumed, true);
    assert.equal(second.sessionId, first.sessionId);
    const actives = [...store.sessions.values()].filter(
      (s) => s.status === SessionStatus.ACTIVE,
    );
    assert.equal(actives.length, 1);
  });

  it("binds cookie to existing active session on rescan without cookie", async () => {
    const first = await openOrResumeSession(prisma, { tableId: "t-1" });
    assert.equal(first.ok, true);
    if (!first.ok) return;

    const second = await openOrResumeSession(prisma, { tableId: "t-1" });
    assert.equal(second.ok, true);
    if (!second.ok) return;

    assert.equal(second.resumed, true);
    assert.equal(second.sessionId, first.sessionId);
    assert.equal(second.opaqueKey, first.opaqueKey);
  });

  it("returns TABLE_NOT_FOUND for unknown table", async () => {
    const result = await openOrResumeSession(prisma, { tableId: "t-missing" });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, "TABLE_NOT_FOUND");
  });

  it("creates a new session when previous active is expired", async () => {
    const first = await openOrResumeSession(prisma, { tableId: "t-1" });
    assert.equal(first.ok, true);
    if (!first.ok) return;

    const session = store.sessions.get(first.sessionId);
    assert.ok(session);
    session.expiresAt = new Date(Date.now() - 1000);

    const second = await openOrResumeSession(prisma, {
      tableId: "t-1",
      opaqueKey: first.opaqueKey,
    });
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.resumed, false);
    assert.notEqual(second.sessionId, first.sessionId);
    assert.equal(session.status, SessionStatus.EXPIRED);
    assert.equal(second.step, SessionStep.WELCOME);
  });
});
