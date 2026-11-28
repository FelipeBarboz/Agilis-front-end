"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Monitor,
  Zap,
  Sparkles,
  Droplets,
  PaintBucket,
  Wrench,
  Building2,
  TreePine,
  Wind,
  LayoutGrid,
  ShieldCheck,
  Truck,
  Sprout,
  PawPrint,
  PanelTop,
  Flame,
  Shirt,
  ChevronDown,
} from "lucide-react";
import { categories } from "@/lib/mocks/services";

const categoryIcons: Record<string, React.ReactNode> = {
  todos:         <LayoutGrid size={20} strokeWidth={1.75} />,
  tecnologia_tv: <Monitor size={20} strokeWidth={1.75} />,
  tecnologia:    <Monitor size={20} strokeWidth={1.75} />,
  eletrica:      <Zap size={20} strokeWidth={1.75} />,
  limpeza:       <Sparkles size={20} strokeWidth={1.75} />,
  hidraulica:    <Droplets size={20} strokeWidth={1.75} />,
  pintura:       <PaintBucket size={20} strokeWidth={1.75} />,
  reparos:       <Wrench size={20} strokeWidth={1.75} />,
  construcao:    <Building2 size={20} strokeWidth={1.75} />,
  marcenaria:    <TreePine size={20} strokeWidth={1.75} />,
  climatizacao:  <Wind size={20} strokeWidth={1.75} />,
  seguranca:     <ShieldCheck size={20} strokeWidth={1.75} />,
  mudanca:       <Truck size={20} strokeWidth={1.75} />,
  jardinagem:    <Sprout size={20} strokeWidth={1.75} />,
  pet:           <PawPrint size={20} strokeWidth={1.75} />,
  vidracaria:    <PanelTop size={20} strokeWidth={1.75} />,
  gas:           <Flame size={20} strokeWidth={1.75} />,
  lavanderia:    <Shirt size={20} strokeWidth={1.75} />,
};

// Todos + as 5 categorias populares da Home (Tecnologia e TV, Elétrica, Limpeza, Hidráulica, Pintura)
const FEATURED_COUNT = 6;

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const featuredCategories = categories.slice(0, FEATURED_COUNT);
  const extraCategories = categories.slice(FEATURED_COUNT);
  const selectedExtra = extraCategories.find((cat) => cat.id === selected);

  const renderTile = (cat: (typeof categories)[number]) => {
    const isActive = selected === cat.id;
    return (
      <button
        key={cat.id}
        type="button"
        onClick={() => onChange(cat.id)}
        className={`group flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition-all duration-150 cursor-pointer ${
          isActive
            ? "border-primary/60 bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/20"
            : "border-border/70 bg-card text-foreground/80 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <span
          className={`transition-transform duration-150 group-hover:scale-105 ${
            isActive ? "text-primary" : "text-foreground/75 group-hover:text-primary"
          }`}
        >
          {categoryIcons[cat.id]}
        </span>
        <span className="line-clamp-2 text-[11px] font-medium leading-tight">
          {cat.label}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Categorias em destaque (mesmas da Home) */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {featuredCategories.map(renderTile)}
      </div>

      {/* Categorias extras expansíveis */}
      <AnimatePresence initial={false}>
        {isExpanded && extraCategories.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2.5 pt-2.5 sm:grid-cols-6">
              {extraCategories.map(renderTile)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seta minimalista centralizada abaixo das categorias */}
      {extraCategories.length > 0 && (
        <div className="mt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded ? "Recolher categorias" : "Ver mais categorias"
            }
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
          >
            {!isExpanded && selectedExtra && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {selectedExtra.label}
              </span>
            )}
            <ChevronDown
              size={18}
              strokeWidth={1.75}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
