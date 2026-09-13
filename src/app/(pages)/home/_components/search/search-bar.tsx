"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { mockServices } from "@/lib/mocks/services";
import { SearchInput } from "./search-input";
import { SearchDropdown } from "./search-dropdown";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Computa as sugestões filtradas pela busca
  const suggestions =
    query.trim().length >= 1
      ? mockServices
          .filter(
            (s) =>
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

  function handleSubmit(e: FormEvent) {
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

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-6 w-full max-w-[500px]">
      <SearchInput
        query={query}
        inputRef={inputRef}
        onChange={(val) => {
          setQuery(val);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClear={handleClear}
        onSubmit={handleSubmit}
      />

      {open && (
        <SearchDropdown
          query={query}
          suggestions={suggestions}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}