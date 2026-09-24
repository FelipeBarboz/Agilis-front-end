"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Zap, Wrench } from "lucide-react";
import { popularCategories } from "./popular-categories";
import { Card } from "@/components/ui/card";

// Ícone de vassoura desenhado com o padrão exato de traço e cantos arredondados do Lucide
function IconBroomMobile({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v8" />
      <path d="M8 10h8" />
      <path d="M7 12.5h10l1.5 6a1 1 0 0 1-1 1.5H6.5a1 1 0 0 1-1-1.5l1.5-6z" />
      <path d="M10 15.5v3" />
      <path d="M14 15.5v3" />
    </svg>
  );
}

const serviceIcons: Record<string, React.ReactNode> = {
  Elétrica: <Zap className="size-7 sm:size-8 text-primary" strokeWidth={2.2} />,
  Limpeza: <IconBroomMobile className="size-7 sm:size-8 text-primary" />,
  Hidráulica: <Wrench className="size-7 sm:size-8 text-primary" strokeWidth={2.2} />,
};

export function PopularServicesMobile() {
  // Compartilha os mesmos dados da lista oficial de categorias
  const featuredCategories = popularCategories.filter((cat) =>
    ["Elétrica", "Limpeza", "Hidráulica"].includes(cat.title)
  );

  return (
    <section className="w-full">
      {/* Header bar com verde Agilis */}
      <div className="w-full bg-primary py-3 px-4 text-center shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-primary-foreground tracking-wide">
          Serviços Populares
        </h2>
      </div>

      {/* Cards no padrão Agilis (Card, sombras, bordas e tokens) */}
      <div className="w-full bg-secondary/60 px-3 sm:px-4 py-5 sm:py-6">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 max-w-lg mx-auto">
          {featuredCategories.map((service, index) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.07 }}
              className="h-full"
            >
              <Link
                href={service.href}
                className="group flex h-full flex-col focus-visible:outline-none"
              >
                <Card className="flex h-full flex-col items-center justify-between rounded-2xl border border-border/80 bg-card p-2.5 sm:p-3.5 text-center shadow-xs transition-all hover:shadow-md active:scale-95 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <div className="flex flex-col items-center w-full">
                    {/* Círculo do ícone com padrão desktop bg-primary/10 */}
                    <div className="flex h-13 w-13 sm:h-15 sm:w-15 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      {serviceIcons[service.title] ?? service.icon}
                    </div>

                    {/* Nome do serviço */}
                    <h3 className="mt-2.5 text-xs sm:text-sm font-bold text-foreground leading-snug">
                      {service.title}
                    </h3>

                    {/* Descrição resumida */}
                    <p className="mt-1 text-[9px] sm:text-[10px] text-muted-foreground leading-tight line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}