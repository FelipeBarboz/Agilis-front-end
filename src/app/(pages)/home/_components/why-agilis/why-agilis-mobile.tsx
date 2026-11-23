"use client";

import { ShieldCheck, Clock, Star, MapPin } from "lucide-react";
import { motion } from "motion/react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    description: "Prestadores com identidade e qualidade verificadas.",
  },
  {
    icon: Clock,
    title: "Agendamento em minutos",
    description: "Encontre e agende em menos de 3 minutos.",
  },
  {
    icon: Star,
    title: "Avaliações reais",
    description: "Escolha com base em avaliações de clientes reais.",
  },
  {
    icon: MapPin,
    title: "Perto de você",
    description: "Serviços na sua região com atendimento local.",
  },
];

export function WhyAgilisMobile() {
  return (
    <section className="flex flex-col gap-5 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          Plataforma
        </p>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Por que usar o Agilis?
        </h2>
        <p className="text-xs text-muted-foreground">
          Milhares de pessoas já escolheram o Agilis para resolver seu dia a dia.
        </p>
      </div>

      {/* Cards em grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {BENEFITS.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.06 }}
              className="flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card p-4 shadow-2xs"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {benefit.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
