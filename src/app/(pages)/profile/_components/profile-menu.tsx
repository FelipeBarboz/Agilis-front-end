import Link from "next/link";
import { Bell, Settings, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  {
    icon: Bell,
    label: "Notificações",
    description: "Gerencie suas preferências de notificação",
    href: "/notifications",
    danger: false,
  },
  {
    icon: Settings,
    label: "Configurações",
    description: "Privacidade, segurança e preferências",
    href: "/profile/settings",
    danger: false,
  },
  {
    icon: LogOut,
    label: "Sair",
    description: "Encerrar sessão atual",
    href: "/login",
    danger: true,
  },
] as const;

export function ProfileMenu() {
  return (
    <div className="flex flex-col gap-2 pb-8">
      {menuItems.map(({ icon: Icon, label, description, href, danger }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            danger ? "bg-destructive/10" : "bg-primary/10"
          }`}>
            <Icon size={17} className={danger ? "text-destructive" : "text-primary"} />
          </div>
          <div className="flex flex-1 flex-col">
            <span className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>
              {label}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}