"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@/components/ui/icons";

export function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // TODO: navigate to search results
    console.log("Searching for:", query);
  }

  return (
    <div className="mt-5 max-w-[500px]">
      <form onSubmit={handleSearch}>
        <Input
          type="search"
          placeholder="Encontre seu serviço"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<IconSearch />}
          className="h-12 text-base shadow-md"
        />
      </form>
    </div>
  );
}
