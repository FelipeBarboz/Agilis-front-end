"use client";

import Link from "next/link";
import {
  CalendarCheck,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  User,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  colorClass: string;
  iconBgClass: string;
  borderHoverClass: string;
}

interface EmployeeQuickActionsProps {
  storeId: string;
  pendingCount?: number;
  unreadChatsCount?: number;
  nextClientName?: string;
  nextServiceTime?: string;
}

export function EmployeeQuickActions({
  storeId,
  pendingCount = 0,
  unreadChatsCount = 0,
  nextClientName,
  nextServiceTime,
}: EmployeeQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "manage",
      title: "Gerenciar Atendimentos",
      description: "Visualize, organize e atualize os atendimentos da loja.",
      icon: <CalendarCheck className="size-6" />,
      href: `/employee-store/${storeId}/schedule`,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      borderHoverClass: "hover:border-emerald-500/40",
    },
    {
      id: "chat",
      title: "Atendimento no Chat",
      description: "Responda os clientes e acompanhe as conversas.",
      icon: <MessageSquare className="size-6" />,
      href: `/chats`,
      colorClass: "text-primary",
      iconBgClass: "bg-primary/10 text-primary",
      borderHoverClass: "hover:border-primary/40",
    },
    {
      id: "pending",
      title: "Acompanhar Pendentes",
      description: "Veja os atendimentos que aguardam confirmação.",
      icon: <AlertCircle className="size-6" />,
      href: `/employee-store/${storeId}`,
      colorClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      borderHoverClass: "hover:border-amber-500/40",
    },
    {
      id: "next",
      title: "Visualizar Próximo Serviço",
      description: nextClientName
        ? `${nextClientName}${nextServiceTime ? ` · ${nextServiceTime}` : ""}`
        : "Confira o próximo cliente e mantenha o fluxo da loja.",
      icon: <User className="size-6" />,
      href: `/employee-store/${storeId}/schedule`,
      colorClass: "text-violet-600 dark:text-violet-400",
      iconBgClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
      borderHoverClass: "hover:border-violet-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
      {actions.map((action) => (
        <Link key={action.id} href={action.href} className="group block">
          <div
            className={`relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md ${action.borderHoverClass} cursor-pointer`}
          >
            {/* Ícone */}
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${action.iconBgClass}`}
            >
              {action.icon}
            </div>

            {/* Texto */}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-bold leading-tight ${action.colorClass}`}>
                  {action.title}
                </h3>

                {/* Badge de contagem */}
                {action.id === "chat" && unreadChatsCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadChatsCount}
                  </span>
                )}
                {action.id === "pending" && pendingCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {action.description}
              </p>
            </div>

            {/* Seta */}
            <div className={`flex size-7 items-center justify-center self-end rounded-xl transition-all group-hover:translate-x-0.5 ${action.iconBgClass}`}>
              <ChevronRight className="size-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
