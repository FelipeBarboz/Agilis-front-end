"use client";

import {
  Monitor, Zap, Sparkles, Droplets, PaintBucket,
  Wrench, Building2, TreePine, Wind, LayoutGrid,
} from "lucide-react";
import { categories } from "@/lib/mocks/services";

const categoryIcons: Record<string, React.ReactNode> = {
  todos:        <LayoutGrid size={20} />,
  limpeza:      <Sparkles size={20} />,
  eletrica:     <Zap size={20} />,
  hidraulica:   <Droplets size={20} />,
  pintura:      <PaintBucket size={20} />,
  tecnologia:   <Monitor size={20} />,
  reparos:      <Wrench size={20} />,
  construcao:   <Building2 size={20} />,
  marcenaria:   <TreePine size={20} />,
  climatizacao: <Wind size={20} />,
};

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-4 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {categoryIcons[cat.id]}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}