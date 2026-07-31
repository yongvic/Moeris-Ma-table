import { AvisForm } from "@/components/client/avis-form";
import { Reveal } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";

export default function AvisPage() {
  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-6 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          Résidence Moeris
        </span>
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[38px]">
          Ton avis
        </h1>
        <p className="max-w-md text-[16px] text-ink-secondary">
          Une minute pour nous dire comment c&apos;était — ça fait grandir la
          maison Moeris.
        </p>
      </Reveal>
      <Reveal index={1}>
        <AvisForm />
      </Reveal>
    </main>
  );
}
