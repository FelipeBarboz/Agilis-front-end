import type { FormEvent, RefObject } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  query: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function SearchInput({
  query,
  inputRef,
  placeholder = "Encontre seu serviço...",
  onChange,
  onFocus,
  onClear,
  onSubmit,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-border bg-card shadow-xs px-3 sm:px-4 h-11 sm:h-12 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none"
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
