"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/mocks/services";
import {
  fetchServicesSearch,
  normalizeSearchItemToService,
} from "@/lib/services/services-service";
import { SearchInput } from "./search-input";
import { SearchDropdown } from "./search-dropdown";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className = "", placeholder }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Busca sugestões na API real com debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      fetchServicesSearch({ q: trimmed, size: 6 })
        .then((res) => {
          if (isMounted) {
            setSuggestions(
              (res.items ?? []).slice(0, 6).map(normalizeSearchItemToService)
            );
          }
        })
        .catch(() => {
          if (isMounted) setSuggestions([]);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

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
    setSuggestions([]);
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
    <div
      ref={containerRef}
      className={`relative w-full ${className || "mt-6 max-w-[500px]"}`}
    >
      <SearchInput
        query={query}
        inputRef={inputRef}
        placeholder={placeholder}
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
