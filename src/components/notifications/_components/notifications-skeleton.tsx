export function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-3">
          {/* Header skeleton */}
          <div className="h-3 w-16 rounded-md bg-muted" />

          {/* Cards skeleton */}
          {[1, 2].map((card) => (
            <div
              key={card}
              className="flex items-start gap-3.5 rounded-xl border border-border/40 bg-card/60 p-3.5"
            >
              {/* Avatar skeleton */}
              <div className="h-12 w-12 shrink-0 rounded-full bg-muted" />

              {/* Text skeleton */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-36 rounded-md bg-muted" />
                  <div className="h-3 w-10 rounded-md bg-muted" />
                </div>
                <div className="h-3 w-28 rounded-md bg-muted/70" />
                <div className="h-3 w-full rounded-md bg-muted/50" />
                <div className="h-3 w-4/5 rounded-md bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
