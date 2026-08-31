"use client";

import {
  Phone,
  Star,
  ShieldCheck,
  MoreVertical,
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
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary ring-2 ring-primary/10 sm:h-20 sm:w-20 sm:text-2xl">
            {getInitials(providerName)}
          </div>
          {/* Online indicator */}
          {!isFinished && isOnline && (
            <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-lg font-bold text-foreground sm:text-xl">
              {providerName}
            </h2>
            <ShieldCheck size={15} className="shrink-0 text-primary/60" />
          </div>

          <p className="truncate text-sm text-muted-foreground">{serviceName}</p>

          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {/* Status */}
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                isFinished
                  ? "border-border bg-muted text-muted-foreground"
                  : isOnline
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isFinished
                    ? "bg-muted-foreground"
                    : isOnline
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground"
                }`}
              />
              {isFinished ? "Conversa finalizada" : isOnline ? "Online agora" : "Offline"}
            </span>

            {/* Rating */}
            {rating !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Ligar para prestador"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Phone size={18} />
          </button>
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Mais opções"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
