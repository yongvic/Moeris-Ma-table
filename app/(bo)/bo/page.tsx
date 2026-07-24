export default function BoHomePage() {
  return (
    <main className="flex flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-3">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Back-office
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Shell salle
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          Espace staff minimal — menu, commandes et service seront branchés
          plus tard.
        </p>
      </header>

      {/* Primary CTA: accent + ink-primary text (never white) — AC #4 */}
      <button
        type="button"
        className="inline-flex min-h-tap-min min-w-tap-min items-center justify-center rounded-md bg-accent px-5 text-base leading-5 font-bold text-ink-primary"
      >
        Ouvrir le menu
      </button>
    </main>
  );
}
