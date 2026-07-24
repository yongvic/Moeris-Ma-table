export function StatusPillBo({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        available
          ? "bg-sage/15 text-sage-deep"
          : "bg-surface-sunk text-ink-secondary"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          available ? "bg-sage-deep" : "bg-ink-secondary/60"
        }`}
      />
      {available ? "Disponible" : "Indisponible"}
    </span>
  );
}
