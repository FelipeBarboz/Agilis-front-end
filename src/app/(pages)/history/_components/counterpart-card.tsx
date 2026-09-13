import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface CounterpartCardProps {
  name: string;
  role: "prestador" | "cliente";
  avatarUrl?: string;
  avatarError: boolean;
  onAvatarError: () => void;
}

export function CounterpartCard({
  name,
  role,
  avatarUrl,
  avatarError,
  onAvatarError,
}: CounterpartCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {avatarUrl && !avatarError ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
              onError={onAvatarError}
            />
          ) : (
            <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {role === "prestador" ? "Prestador" : "Cliente Contratante"}
          </span>
          <p className="text-sm font-bold text-foreground">{name}</p>
        </div>
      </div>

      <Link
        href="/chats"
        className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Chat</span>
      </Link>
    </div>
  );
}
