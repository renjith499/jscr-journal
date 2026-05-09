export default function Loading() {
  return (
    <main className="bg-paper py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5">
        <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-80 animate-pulse rounded-lg bg-white shadow-card dark:bg-slate-900" />
          ))}
        </div>
      </div>
    </main>
  );
}
