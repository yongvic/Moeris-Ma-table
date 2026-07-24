export default function MenuLoading() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-7 px-margin-mobile py-8 md:px-7">
      <div className="flex flex-col gap-2">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-9 w-48 rounded-lg" />
        <div className="skeleton h-4 w-72 rounded-full" />
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border/70 bg-surface-base shadow-soft"
          >
            <div className="skeleton aspect-[4/3] w-full" />
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
