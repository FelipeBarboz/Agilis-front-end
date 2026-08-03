"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@/components/ui/icons";

export function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // TODO: navegar para página de resultados
    console.log("Searching for:", query);
  }

  return (
    <form onSubmit={handleSearch} className="mt-6 w-full max-w-125">
      <Input
        type="search"
        placeholder="Encontre seu serviço"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<IconSearch />}
        className="h-12 text-base shadow-md"
      />
    </form>
  );
}