"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import {
  IconHome,
  IconHistory,
  IconLogo,
  IconServices,
  IconSupport,
  IconUser,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
  IconTech,
} from "@/components/ui/icons";

const mainNavItems = [
  { href: "/home",    icon: <IconHome />,    label: "Início"    },
  { href: "/services", icon: <IconServices />, label: "Serviços"  },
  { href: "/support", icon: <IconSupport />,  label: "Suporte"   },
  { href: "/history", icon: <IconHistory />,  label: "Histórico" },
];

const categoryNavItems = [
  { href: "/services/tech",     icon: <IconTech size={20} />,     label: "Tecnologia e TV" },
  { href: "/services/electric", icon: <IconElectric size={20} />, label: "Elétrica"        },
  { href: "/services/cleaning", icon: <IconCleaning size={20} />, label: "Limpeza"         },
  { href: "/services/plumbing", icon: <IconPlumbing size={20} />, label: "Hidráulica"      },
  { href: "/services/painting", icon: <IconPainting size={20} />, label: "Pintura"         },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <Sidebar.Logo href="/home">
        <IconLogo size={24} />
      </Sidebar.Logo>

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
          href="/register"
          icon={<IconUser />}
          label="Perfil"
          isActive={pathname === "/profile"}
        />
      </Sidebar.Footer>
    </Sidebar>
  );
}