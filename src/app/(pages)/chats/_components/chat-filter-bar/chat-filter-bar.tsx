"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "todos" | "nao_lidos" | "finalizados";

interface ChatFilterBarProps {
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatFilterBar({
  onFilterChange,
  onSearchChange,
  activeFilter,
}: ChatFilterBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filters: { key: FilterType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "nao_lidos", label: "Não lidos" },
    { key: "finalizados", label: "Finalizados" },
  ];

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    onSearchChange(value);
  }

  return (
    <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
      {/* Filter chips */}
      <div className="flex flex-1 items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`
              rounded-full border px-3 py-1 text-xs font-medium transition-colors
              ${
                activeFilter === f.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center">
        {searchOpen ? (
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onBlur={() => {
              if (!searchQuery) setSearchOpen(false);
            }}
            placeholder="Buscar..."
            className="h-7 w-32 rounded-full border border-border bg-muted px-3 text-xs outline-none focus:border-primary"
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Abrir busca"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
