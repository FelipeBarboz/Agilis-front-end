"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import {
  IconHome,
  IconHistory,
  IconServices,
  IconSupport,
  IconUser,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
  IconTech,
  IconAll,
} from "@/components/ui/icons";

const mainNavItems = [
  { href: "/home",    icon: <IconHome />,    label: "Início"    },
  { href: "/services", icon: <IconServices />, label: "Serviços"  },
  { href: "/support", icon: <IconSupport />,  label: "Suporte"   },
  { href: "/history", icon: <IconHistory />,  label: "Histórico" },
];

const categoryNavItems = [
  { href: "/services?category=todos",  icon: <IconAll size={20} />,     label: "Todos" },
  { href: "/services?category=tecnologia",  icon: <IconTech size={20} />,     label: "Tecnologia e TV" },
  { href: "/services?category=eletrica",    icon: <IconElectric size={20} />, label: "Elétrica"        },
  { href: "/services?category=limpeza",     icon: <IconCleaning size={20} />, label: "Limpeza"         },
  { href: "/services?category=hidraulica",  icon: <IconPlumbing size={20} />, label: "Hidráulica"      },
  { href: "/services?category=pintura",     icon: <IconPainting size={20} />, label: "Pintura"         },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <Sidebar.Logo href="/home" />

      {/* Main nav */}
      <div className="flex w-full flex-col gap-1 px-2">
        {mainNavItems.map((item) => (
          <Sidebar.NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </div>

      {/* Category nav */}
      <Sidebar.Group className="px-2">
        {categoryNavItems.map((item) => (
          <Sidebar.NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </Sidebar.Group>

      {/* User profile */}
      <Sidebar.Footer className="px-2 pb-2">
        <Sidebar.NavItem
          href="/register/user"
          icon={<IconUser />}
          label="Perfil"
          isActive={pathname === "/profile"}
        />
      </Sidebar.Footer>
    </Sidebar>
  );
}