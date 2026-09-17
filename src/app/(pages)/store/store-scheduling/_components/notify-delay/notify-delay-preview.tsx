"use client";

import { Sparkles } from "lucide-react";

interface NotifyDelayPreviewProps {
  reason: string;
  suggestedDate: string;
  suggestedTime: string;
}

export function NotifyDelayPreview({
  reason,
  suggestedDate,
  suggestedTime,
}: NotifyDelayPreviewProps) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-foreground">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span>O que o cliente receberá na notificação:</span>
      </div>
      <p className="text-muted-foreground leading-relaxed">
        &ldquo;Aviso de Atraso: {reason}. Novo horário sugerido: {suggestedDate} às {suggestedTime}. O cliente poderá aceitar, reagendar com prioridade ou receber reembolso integral.&rdquo;
      </p>
    </div>
  );
}
