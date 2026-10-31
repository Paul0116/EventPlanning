export default function EventsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading events" className="grid gap-5">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        ))}
      </div>
    </div>
  );
}
