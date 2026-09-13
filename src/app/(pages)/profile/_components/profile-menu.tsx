import Link from "next/link";
import { ChevronRight, LogOut, Settings } from "lucide-react";

interface ProfileMenuProps {
  onLogout: () => void;
}

export function ProfileMenu({ onLogout }: ProfileMenuProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/profile/settings"
        className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
          <Settings className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            Configurações
          </span>
          <span className="text-xs text-muted-foreground">
            Privacidade, segurança e preferências
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-destructive/40 group sm:p-5 cursor-pointer text-left"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
          <LogOut className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-destructive">Sair</span>
          <span className="text-xs text-muted-foreground">
            Encerrar sessão atual
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}