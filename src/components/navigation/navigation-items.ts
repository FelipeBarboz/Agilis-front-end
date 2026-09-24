export interface NavItem {
  href: string;
  label: string;
  category?: string;
}

export const mainNavItems: NavItem[] = [
  { href: "/home", label: "Início" },
  { href: "/services", label: "Serviços" },
  { href: "/support", label: "Suporte" },
  { href: "/history", label: "Histórico" },
];

export const categoryNavItems: NavItem[] = [
  { href: "/services?category=todos", label: "Todos", category: "todos" },
  { href: "/services?category=tecnologia", label: "Tecnologia e TV", category: "tecnologia" },
  { href: "/services?category=eletrica", label: "Elétrica", category: "eletrica" },
  { href: "/services?category=limpeza", label: "Limpeza", category: "limpeza" },
  { href: "/services?category=hidraulica", label: "Hidráulica", category: "hidraulica" },
  { href: "/services?category=pintura", label: "Pintura", category: "pintura" },
];
