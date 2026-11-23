"use client";

import Link from "next/link";
import { Sparkles, Tag } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function FirstServiceDiscountMobile() {
  return (
    <section className="relative overflow-hidden mx-4 my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-brand-green-dark/5 p-5 shadow-xs">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/8 blur-xl" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md"
        >
          <Tag className="h-4 w-4 mb-0.5 opacity-80" />
          <span className="text-2xl font-black leading-none">30%</span>
          <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
            OFF
          </span>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          className="flex flex-1 flex-col gap-1 min-w-0"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Oferta de boas-vindas
            </span>
          </div>
          <p className="text-sm font-bold text-foreground leading-snug">
            30% off no seu primeiro serviço
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Desconto exclusivo para novos usuários.
          </p>

          <div className="mt-2">
            <Button
              asChild
              size="sm"
              className="rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Link href="/services">Agendar agora</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
