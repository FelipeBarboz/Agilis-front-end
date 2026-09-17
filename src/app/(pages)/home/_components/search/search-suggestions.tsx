import { Search } from "lucide-react";
import type { Service } from "@/lib/mocks/services";

interface SearchSuggestionsProps {
  query: string;
  suggestions: Service[];
  onSelect: (term: string) => void;
}

export function SearchSuggestions({
  query,
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  return (
    <div className="p-2">
      {suggestions.map((s) => (
        <button
          key={s.id}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(s.title);
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted transition-colors group"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <Search className="size-3.5" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {s.title}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {s.company} · {s.city}
            </span>
          </div>
          <span className="ml-auto shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
            {s.category}
          </span>
        </button>
      ))}

      <div className="mt-1 border-t border-border pt-1">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(query);
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <Search className="size-4" />
          Ver todos os resultados para &ldquo;{query}&rdquo;
        </button>
      </div>
    </div>
  );
}
