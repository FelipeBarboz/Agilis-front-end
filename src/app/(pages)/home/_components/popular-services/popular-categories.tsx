import {
  IconTech,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
} from "@/components/ui/icons";

export const popularCategories = [
  { href: "/services?category=tecnologia", icon: <IconTech />,     title: "Tecnologia e TV", description: "Instalação e suporte para seus dispositivos e TV" },
  { href: "/services?category=eletrica",   icon: <IconElectric />, title: "Elétrica",         description: "Instalações e reparos com segurança" },
  { href: "/services?category=limpeza",    icon: <IconCleaning />, title: "Limpeza",           description: "Limpeza com zelo e organização" },
  { href: "/services?category=hidraulica", icon: <IconPlumbing />, title: "Hidráulica",        description: "Soluções inteligentes para problemas hidráulicos" },
  { href: "/services?category=pintura",    icon: <IconPainting />, title: "Pintura",           description: "Transforme seus ambientes com acabamento profissional" },
] as const;