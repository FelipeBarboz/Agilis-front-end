"use client";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@/components/ui/icons";

interface ServicesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServicesSearchBar({ value, onChange }: ServicesSearchBarProps) {
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
    </div>
  );
}