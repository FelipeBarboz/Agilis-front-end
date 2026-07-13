"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@/components/ui/icons";

interface ServicesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServicesSearchBar({ value, onChange }: ServicesSearchBarProps) {
  const router = useRouter();

  function handleClear() {
    onChange("");
    router.push("/home");
  }

  return (
    <div className="relative flex items-center gap-2">
      <Input
        type="search"
        placeholder="Encontre seu serviço"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        leftIcon={<IconSearch />}
        className="h-11 pr-10 text-sm shadow-sm"
      />
      <button
        type="button"
        onClick={handleClear}
        aria-label="Limpar busca e voltar"
        className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  );
}