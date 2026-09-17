export function ModalSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto space-y-5 animate-pulse p-6">
      {/* Hero skeleton */}
      <div className="flex gap-4 rounded-2xl border border-border/40 bg-card p-4">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-muted" />
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded-md bg-muted" />
            <div className="h-5 w-44 rounded-md bg-muted" />
          </div>
          <div className="h-4 w-28 rounded-md bg-muted" />
        </div>
      </div>

      {/* Info block skeleton */}
      <div className="rounded-2xl border border-border/40 bg-card space-y-3 p-4">
        <div className="h-3 w-28 rounded-md bg-muted" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 rounded-lg bg-muted/60" />
          <div className="h-10 rounded-lg bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
