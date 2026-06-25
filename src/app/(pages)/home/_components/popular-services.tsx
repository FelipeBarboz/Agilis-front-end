"use client";

import { ServiceCard } from "./service-card";
import { FadeInSection } from "@/components/ui/motion";
import {
  IconTech,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
} from "@/components/ui/icons";

const services = [
  {
    href: "/services/tech",
    icon: <IconTech />,
    title: "Tecnologia e TV",
    description: "Instalação e suporte para seus dispositivos e TV",
  },
  {
    href: "/services/electric",
    icon: <IconElectric />,
    title: "Elétrica",
    description: "Instalações e reparos com segurança",
  },
  {
    href: "/services/cleaning",
    icon: <IconCleaning />,
    title: "Limpeza",
    description: "Limpeza com zelo e organização",
  },
  {
    href: "/services/plumbing",
    icon: <IconPlumbing />,
    title: "Hidráulica",
    description: "Soluções inteligentes para problemas hidráulicos",
  },
  {
    href: "/services/painting",
    icon: <IconPainting />,
    title: "Pintura",
    description: "Transforme seus ambientes com acabamento profissional",
  },
] as const;

export function PopularServices() {
  return (
    <FadeInSection>
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Serviços Populares
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((service, index) => (
            <FadeInSection key={service.href} delay={index * 0.05}>
              <ServiceCard {...service} />
            </FadeInSection>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}