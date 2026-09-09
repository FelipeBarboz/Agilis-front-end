"use client";

import { ServiceCard } from "../service-card";
import { FadeInSection } from "@/components/ui/motion";
import {
  IconTech,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
} from "@/components/ui/icons";

const services = [
  { href: "/services?category=tecnologia", icon: <IconTech />,     title: "Tecnologia e TV", description: "Instalação e suporte para seus dispositivos e TV" },
  { href: "/services?category=eletrica",   icon: <IconElectric />, title: "Elétrica",         description: "Instalações e reparos com segurança" },
  { href: "/services?category=limpeza",    icon: <IconCleaning />, title: "Limpeza",           description: "Limpeza com zelo e organização" },
  { href: "/services?category=hidraulica", icon: <IconPlumbing />, title: "Hidráulica",        description: "Soluções inteligentes para problemas hidráulicos" },
  { href: "/services?category=pintura",    icon: <IconPainting />, title: "Pintura",           description: "Transforme seus ambientes com acabamento profissional" },
] as const;

export function PopularServicesDesktop() {
  return (
    <FadeInSection>
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Serviços Populares
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((service, index) => (
            <FadeInSection key={service.href} delay={index * 0.05} className="h-full">
              <ServiceCard {...service} />
            </FadeInSection>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}