"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import { mockServices } from "@/lib/mocks/services";

const POPULAR = ["Limpeza", "Elétrica", "Pintura", "Hidráulica", "Automação"];

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute suggestions filtered by query
  const suggestions = query.trim().length >= 1
    ? mockServices
        .filter((s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()) ||
          s.company.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const navigate = useCallback(
    (term: string) => {
      const q = term.trim();
      if (!q) return;
      setOpen(false);
      setQuery(q);
      router.push(`/services?q=${encodeURIComponent(q)}`);
    },
    [router]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(query);
  }

  function handleSelect(term: string) {
    navigate(term);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showPopular = query.trim().length === 0;

  return (
    <div ref={containerRef} className="relative mt-6 w-full max-w-[500px]">
      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card shadow-md px-4 h-12 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Encontre seu serviço..."
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          {showPopular ? (
            <div className="p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Buscas populares
              </p>
              <div className="flex flex-col gap-0.5">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(term); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors group"
                  >
                    <TrendingUp className="size-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s.title); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted transition-colors group"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <Search className="size-3.5" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{s.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{s.company} · {s.city}</span>
                  </div>
                  <span className="ml-auto shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                    {s.category}
                  </span>
                </button>
              ))}
              <div className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(query); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  <Search className="size-4" />
                  Ver todos os resultados para &ldquo;{query}&rdquo;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum serviço encontrado para &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}