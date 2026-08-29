"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Star,
  ShieldCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversationInfo {
  id: string;
  providerName: string;
  providerAvatar?: string;
  serviceName: string;
  isOnline: boolean;
  isFinished: boolean;
  rating?: number;
}

interface ConversationHeaderProps {
  conversation: ConversationInfo;
  onMenuOpen?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConversationHeader({
  conversation,
  onMenuOpen,
}: ConversationHeaderProps) {
  const { providerName, serviceName, isOnline, isFinished, rating } =
    conversation;

  return (
    <header className="flex items-center gap-3 bg-primary px-3 py-2.5 text-primary-foreground shadow-md">
      {/* Voltar */}
      <Link
        href="/chats"
        aria-label="Voltar para chats"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white ring-2 ring-white/30">
          {getInitials(providerName)}
        </div>
        {/* Online indicator */}
        {!isFinished && isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary bg-green-400" />
        )}
      </div>

      {/* Info — provider name + service */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold leading-tight text-white">
            {providerName}
          </span>
          {/* Verified badge */}
          <ShieldCheck size={13} className="shrink-0 text-white/70" />
        </div>

        <div className="flex items-center gap-2">
          {/* Status */}
          <span
            className={`text-[11px] font-medium leading-tight ${
              isFinished
                ? "text-white/50"
                : isOnline
                  ? "text-green-300"
                  : "text-white/60"
            }`}
          >
            {isFinished ? "Conversa finalizada" : isOnline ? "Online agora" : "Offline"}
          </span>

          {/* Separator + service name */}
          <span className="text-white/40 text-[11px]">•</span>
          <span className="truncate text-[11px] text-white/60">{serviceName}</span>

          {/* Rating */}
          {rating !== undefined && (
            <>
              <span className="text-white/40 text-[11px]">•</span>
              <span className="flex items-center gap-0.5 text-[11px] text-amber-300">
                <Star size={10} className="fill-amber-300" />
                {rating.toFixed(1)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="Ligar para prestador"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30"
        >
          <Phone size={18} />
        </button>
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Mais opções"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
