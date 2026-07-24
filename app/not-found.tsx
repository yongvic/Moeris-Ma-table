import Link from "next/link";
import { Compass } from "@phosphor-icons/react/dist/ssr";
import { MoerisMark } from "@/components/ui/moeris-mark";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-margin-mobile py-16 text-center">
      <div className="pattern-wash opacity-[0.22]" aria-hidden />
      <div className="sun-glow -top-16 size-64 motion-safe:animate-sun" aria-hidden />
      <div className="relative z-[1] flex flex-col items-center gap-6">
        <MoerisMark href="/accueil" />
        <span className="grid size-20 place-items-center rounded-full bg-accent-soft text-accent-deep shadow-soft">
          <Compass size={40} weight="fill" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] text-ink-primary">
            Page introuvable
          </h1>
          <p className="max-w-sm text-[16px] text-ink-secondary">
            On dirait que cette page a quitté la table. Reviens à l&apos;accueil,
            on t&apos;attend.
          </p>
        </div>
        <Link
          href="/accueil"
          className="inline-flex min-h-tap-min items-center gap-3 rounded-full bg-accent pl-6 pr-2 text-[16px] font-bold text-ink-onaccent shadow-glow transition-colors hover:bg-accent-deep"
        >
          Retour à l&apos;accueil
          <span className="grid size-9 place-items-center rounded-full bg-surface-base/45">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
