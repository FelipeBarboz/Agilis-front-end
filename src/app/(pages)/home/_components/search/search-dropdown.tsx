import type { Service } from "@/lib/mocks/services";
import { PopularSearches } from "./popular-searches";
import { SearchSuggestions } from "./search-suggestions";

interface SearchDropdownProps {
  query: string;
  suggestions: Service[];
  onSelect: (term: string) => void;
}

export function SearchDropdown({
  query,
  suggestions,
  onSelect,
}: SearchDropdownProps) {
  const showPopular = query.trim().length === 0;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
      {showPopular ? (
        <PopularSearches onSelect={onSelect} />
      ) : suggestions.length > 0 ? (
        <SearchSuggestions
          query={query}
          suggestions={suggestions}
          onSelect={onSelect}
        />
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Nenhum serviço encontrado para &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
