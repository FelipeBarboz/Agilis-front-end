"use client";

import Link from "next/link";
import { Sparkles, Tag } from "lucide-react";
import { motion } from "motion/react";
import { FadeInSection } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

export function FirstServiceDiscountDesktop() {
  return (
    <FadeInSection>
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-brand-green-dark/5 p-8 shadow-xs">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/8 blur-2xl" />
        <div className="pointer-events-none absolute -left-4 -bottom-6 h-28 w-28 rounded-full bg-brand-green-dark/10 blur-xl" />

        <div className="relative z-10 flex items-center justify-between gap-8">
          {/* Left: icon + text */}
          <div className="flex items-center gap-5">
            {/* Big discount badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
            >
              <Tag className="h-5 w-5 mb-0.5 opacity-80" />
              <span className="text-3xl font-black leading-none">30%</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
                OFF
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Oferta de boas-vindas
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                30% off no seu primeiro serviço
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Aproveite o desconto exclusivo para novos usuários. Agende o seu primeiro serviço pelo Agilis e economize de imediato.
              </p>
            </motion.div>
          </div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            className="shrink-0"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl px-7 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/services">Agendar agora</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </FadeInSection>
  );
}
