"use client";

import { ShieldCheck, Clock, Star, MapPin } from "lucide-react";
import { FadeInSection } from "@/components/ui/motion";
import { motion } from "motion/react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    description:
      "Todos os prestadores passam por verificação de identidade e avaliação de qualidade antes de atender.",
  },
  {
    icon: Clock,
    title: "Agendamento em minutos",
    description:
      "Encontre, compare e agende o serviço que precisa em menos de 3 minutos, sem complicação.",
  },
  {
    icon: Star,
    title: "Avaliações reais",
    description:
      "Leia avaliações de clientes reais para escolher o profissional certo para você.",
  },
  {
    icon: MapPin,
    title: "Perto de você",
    description:
      "Serviços disponíveis na sua região, com deslocamento rápido e atendimento local.",
  },
];

export function WhyAgilisDesktop() {
  return (
    <FadeInSection>
      <section className="flex flex-col gap-6 rounded-2xl bg-card border border-border/50 p-8 shadow-xs">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Plataforma
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Por que usar o Agilis?
          </h2>
          <p className="text-sm text-muted-foreground">
            Descubra por que milhares de pessoas escolhem o Agilis para resolver suas demandas do dia a dia.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.07 }}
                className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-background p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {benefit.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </FadeInSection>
  );
}
