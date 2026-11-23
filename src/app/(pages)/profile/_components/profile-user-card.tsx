import Link from "next/link";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import Image from "next/image";

interface ProfileUserCardProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    role?: string;
  };
}

export function ProfileUserCard({ user }: ProfileUserCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={96}
            height={96}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Informações do usuário */}
        <div className="flex flex-col items-center gap-2 pt-2 sm:items-start">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Cliente Ativo
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="size-4 text-primary" />
            <span>São Paulo, SP</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 text-primary" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação: Chat e Endereços */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mt-2">
        <Link
          href="/chats"
          className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:bg-muted/50 hover:border-primary/40 group"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <MessageSquare className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Chat</span>
            <span className="text-xs text-muted-foreground">
              Fale com prestadores
            </span>
          </div>
        </Link>

        <Link
          href="/addresses"
          className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:bg-muted/50 hover:border-primary/40 group"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <MapPin className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Endereços
            </span>
            <span className="text-xs text-muted-foreground">
              Locais de entrega
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
