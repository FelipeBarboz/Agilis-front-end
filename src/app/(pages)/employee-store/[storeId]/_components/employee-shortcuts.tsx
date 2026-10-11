"use client";

import Link from "next/link";
import { ChevronRight, CalendarDays, Calendar, Settings } from "lucide-react";
import type { PermissionId } from "@/lib/mocks/positions";

interface ShortcutItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  show: boolean;
}

interface EmployeeShortcutsProps {
  storeId: string;
  permissions: PermissionId[];
}

export function EmployeeShortcuts({ storeId, permissions }: EmployeeShortcutsProps) {
  const canAccessSettings = permissions.includes("store_settings");

  const shortcuts: ShortcutItem[] = [
    {
      id: "store-schedule",
      icon: <CalendarDays className="size-7" />,
      title: "Escala da loja",
      description: "Veja a escala completa de todos os funcionários",
      href: `/employee-store/${storeId}/store-schedule`,
      show: true,
    },
    {
      id: "calendar",
      icon: <Calendar className="size-7" />,
      title: "Ver calendário",
      description: "Visualize seus atendimentos por dia, semana ou mês",
      href: `/employee-store/${storeId}/calendar`,
      show: true,
    },
    {
      id: "store-settings",
      icon: <Settings className="size-7" />,
      title: "Configurações da loja",
      description: "Gerenciar as configurações e permissões",
      href: `/store/store-settings`,
      show: canAccessSettings,
    },
  ];

  const visible = shortcuts.filter((s) => s.show);

  return (
    <ul className="flex flex-col gap-3" role="list">
      {visible.map((s) => (
        <li key={s.id}>
          <Link
            href={s.href}
            className="group flex items-center gap-4 rounded-[16px] border border-border bg-card px-5 py-4 shadow-sm transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            {/* Ícone */}
            <span className="shrink-0 text-[#006b49] dark:text-primary">
              {s.icon}
            </span>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-semibold text-foreground">
                {s.title}
              </p>
              <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                {s.description}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight
              className="size-[18px] shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
