"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  content: string;
  sentAt: string; // Hora ex: "10:32"
  isOwn: boolean; // true = usuário logado, false = prestador
  status?: "sent" | "delivered" | "read";
  type?: "text" | "system";
  systemLabel?: string; // para mensagens de sistema ex: "Agendamento confirmado"
}

interface MessageBubbleProps {
  message: ChatMessage;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MessageBubble({ message }: MessageBubbleProps) {
  const { content, sentAt, isOwn, status, type, systemLabel } = message;

  // ── Mensagem de sistema (ex: "Serviço agendado para...") ──────────────────
  if (type === "system") {
    return (
      <div className="flex justify-center px-4 py-1">
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            {systemLabel ?? content}
          </span>
        </div>
      </div>
    );
  }

  // ── Mensagem normal ────────────────────────────────────────────────────────
  return (
    <div
      className={`flex w-full px-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`group relative max-w-[78%] sm:max-w-[65%] ${
          isOwn ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-3.5 py-2 shadow-sm ${
            isOwn
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-white text-foreground ring-1 ring-border/60"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {content}
          </p>
        </div>

        {/* Time + status */}
        <div
          className={`mt-0.5 flex items-center gap-1 px-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] text-muted-foreground">{sentAt}</span>

          {/* Read receipt (apenas mensagens próprias) */}
          {isOwn && status && (
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              className={`shrink-0 ${
                status === "read"
                  ? "text-primary"
                  : "text-muted-foreground/60"
              }`}
            >
              {status === "sent" ? (
                // Single check
                <path
                  d="M1 5l4 4L14 1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                // Double check
                <>
                  <path
                    d="M1 5l4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5l4 4 5-8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
