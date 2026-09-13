import { TrendingUp } from "lucide-react";

const POPULAR_SEARCHES = [
  "Limpeza",
  "Elétrica",
  "Pintura",
  "Hidráulica",
  "Automação",
];

interface PopularSearchesProps {
  onSelect: (term: string) => void;
}

export function PopularSearches({ onSelect }: PopularSearchesProps) {
  return (
    <div className="p-3">
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Buscas populares
      </p>
      <div className="flex flex-col gap-0.5">
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(term);
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors group"
          >
            <TrendingUp className="size-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
