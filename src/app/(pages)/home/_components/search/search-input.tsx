import type { FormEvent, RefObject } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  query: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function SearchInput({
  query,
  inputRef,
  onChange,
  onFocus,
  onClear,
  onSubmit,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card shadow-md px-4 h-12 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Encontre seu serviço..."
          autoComplete="off"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
        />
        {query && (
          <button
            type="button"
            onClick={onClear}
            className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </form>
  );
}
