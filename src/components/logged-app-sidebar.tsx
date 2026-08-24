"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { mockUser } from "@/lib/mocks/user";
import {
  IconHome,
  IconHistory,
  IconServices,
  IconSupport,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
  IconTech,
  IconAll,
  IconStore,
  IconFavorites,
} from "@/components/ui/icons";

const mainNavItems = [
  { href: "/home",      icon: <IconHome />,      label: "Início"    },
  { href: "/services",  icon: <IconServices />,  label: "Serviços"  },
  { href: "/support",   icon: <IconSupport />,   label: "Suporte"   },
  { href: "/history",   icon: <IconHistory />,   label: "Histórico" },
  { href: "/favorites", icon: <IconFavorites />, label: "Favoritos" },
  { href: "/store",     icon: <IconStore />,     label: "Sua Loja"  },
];

const categoryNavItems = [
  { href: "/services?category=todos",      icon: <IconAll size={20} />,      label: "Todos"           },
  { href: "/services?category=tecnologia", icon: <IconTech size={20} />,     label: "Tecnologia e TV" },
  { href: "/services?category=eletrica",   icon: <IconElectric size={20} />, label: "Elétrica"        },
  { href: "/services?category=limpeza",    icon: <IconCleaning size={20} />, label: "Limpeza"         },
  { href: "/services?category=hidraulica", icon: <IconPlumbing size={20} />, label: "Hidráulica"      },
  { href: "/services?category=pintura",    icon: <IconPainting size={20} />, label: "Pintura"         },
];

export function LoggedAppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  function isCategoryActive(href: string): boolean {
    const category = new URL(href, "http://x").searchParams.get("category");
    return pathname === "/services" && currentCategory === category;
  }

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
            isActive={isCategoryActive(item.href)}
          />
        ))}
      </Sidebar.Group>

      {/* User profile */}
      <Sidebar.Footer className="px-2 pb-2">
        <Sidebar.NavItem
          href="/profile"
          icon={<UserAvatar user={mockUser} size={28} />}
          label={mockUser.name}
          isActive={pathname === "/profile"}
        />
      </Sidebar.Footer>
    </Sidebar>
  );
}