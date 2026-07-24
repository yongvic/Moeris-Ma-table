export function StatusPillBo({
  available,
}: {
  available: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        available
          ? "bg-accent-soft text-ink-primary"
          : "bg-border text-ink-secondary"
      }`}
    >
      {available ? "Disponible" : "Indisponible"}
    </span>
  );
}
