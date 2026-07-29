"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatEmptyStateProps {
  title?: string;
  description?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatEmptyState({
  title = "Nenhuma conversa ainda",
  description = "Quando falar com um provedor\na conversa aparecerá aqui",
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16">
      {/* Illustration */}
      <div className="relative flex items-center justify-center">
        {/* Decorative dots */}
        <span className="absolute -top-6 -left-6 text-primary/30 text-lg font-bold select-none">+</span>
        <span className="absolute -top-4 right-0 h-1.5 w-1.5 rounded-full bg-primary/20" />
        <span className="absolute bottom-0 -right-5 text-primary/30 text-sm font-bold select-none">+</span>
        <span className="absolute -bottom-2 left-2 h-1 w-1 rounded-full bg-primary/20" />

        {/* Bubble stack */}
        <div className="relative">
          {/* Background bubble */}
          <div className="absolute -top-2 left-4 flex h-16 w-20 items-center justify-center rounded-2xl rounded-tl-sm bg-primary/15">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="h-2 w-2 rounded-full bg-primary/60" />
            </div>
          </div>

          {/* Foreground bubble */}
          <div className="relative z-10 mt-10 flex h-12 w-24 items-center justify-center rounded-2xl rounded-bl-sm bg-white shadow-md ring-1 ring-border">
            <div className="flex gap-1 px-2">
              <span className="h-1.5 w-8 rounded-full bg-muted-foreground/30" />
              <span className="h-1.5 w-4 rounded-full bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="mt-2 flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
