"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ServiceRequestType } from "@prisma/client";
import {
  HandWaving,
  Drop,
  Receipt,
  DotsThreeOutline,
  Check,
  BellSlash,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { completeServiceRequestAction } from "@/domain/service/actions";
import {
  serviceTypeLabelFr,
  type ServiceBoView,
} from "@/domain/service/queries";

const ICONS: Record<ServiceRequestType, Icon> = {
  WAITER: HandWaving,
  WATER: Drop,
  BILL: Receipt,
  OTHER: DotsThreeOutline,
};

export function BoServicePanel({
  initialRequests,
  pusher,
}: {
  initialRequests: ServiceBoView[];
  pusher: { key: string; cluster: string } | null;
}) {
  const router = useRouter();
  const items = initialRequests;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => router.refresh(), [router]);

  useEffect(() => {
    const id = setInterval(refresh, 12000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!pusher) return;
    let cancelled = false;
    let channel: { unbind_all?: () => void; unsubscribe?: () => void } | null =
      null;
    let client: { disconnect?: () => void } | null = null;

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;
      client = new Pusher(pusher.key, { cluster: pusher.cluster });
      channel = (
        client as unknown as { subscribe: (c: string) => typeof channel }
      ).subscribe("bo-floor");
      (
        channel as unknown as { bind: (e: string, cb: () => void) => void }
      ).bind("floor-update", () => refresh());
    });

    return () => {
      cancelled = true;
      channel?.unbind_all?.();
      channel?.unsubscribe?.();
      client?.disconnect?.();
    };
  }, [pusher, refresh]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-deep opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-sage-deep" />
        </span>
        En direct · {items.length} ouverte{items.length > 1 ? "s" : ""}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-12 text-center">
          <BellSlash size={34} weight="duotone" className="text-ink-secondary" />
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            Salle tranquille
          </p>
          <p className="text-sm text-ink-secondary">
            Aucune demande ouverte pour le moment.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((req) => {
            const IconCmp = ICONS[req.type] ?? DotsThreeOutline;
            return (
              <li
                key={req.id}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent-deep">
                    <IconCmp size={22} weight="fill" />
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-semibold text-ink-primary">
                      Table {req.tableId}
                    </p>
                    <p className="text-sm text-ink-secondary">
                      {serviceTypeLabelFr(req.type)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  className="inline-flex min-h-tap-min items-center gap-2 rounded-full bg-accent px-5 font-bold text-ink-onaccent shadow-glow transition-colors hover:bg-accent-deep disabled:opacity-60"
                  onClick={() => {
                    startTransition(async () => {
                      const res = await completeServiceRequestAction(req.id);
                      if (!res.ok) setError(res.message);
                      else {
                        setError(null);
                        refresh();
                      }
                    });
                  }}
                >
                  <Check size={17} weight="bold" />
                  Fait
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
