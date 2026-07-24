import Pusher from "pusher";

export type FloorEvent = {
  kind: "order" | "service";
  id: string;
  tableId: string;
  status: string;
  at: string;
};

let client: Pusher | null | undefined;

function getPusher(): Pusher | null {
  if (client !== undefined) return client;

  const {
    PUSHER_APP_ID,
    PUSHER_KEY,
    PUSHER_SECRET,
    PUSHER_CLUSTER,
  } = process.env;

  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    client = null;
    return null;
  }

  client = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
  return client;
}

/** Publish to `bo-floor` after Neon commit (AD-7). No-op if unconfigured. */
export async function publishFloorEvent(event: FloorEvent): Promise<void> {
  const pusher = getPusher();
  if (!pusher) {
    console.info("[pusher] skip (unconfigured)", event.kind, event.id);
    return;
  }
  try {
    await pusher.trigger("bo-floor", "floor-update", event);
  } catch (error) {
    console.error("[pusher] publish failed", error);
  }
}

export function getPublicPusherConfig(): {
  key: string;
  cluster: string;
} | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.PUSHER_KEY;
  const cluster =
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER;
  if (!key || !cluster) return null;
  return { key, cluster };
}
