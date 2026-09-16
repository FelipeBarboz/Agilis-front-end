"use client";

import { Check } from "lucide-react";

interface NotifyDelaySuccessProps {
  targetedCount: number;
}

export function NotifyDelaySuccess({ targetedCount }: NotifyDelaySuccessProps) {
  return (
    <div className="py-8 text-center space-y-3">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Check className="size-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground">
        Aviso Disparado com Sucesso!
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        {targetedCount} cliente(s) foram notificados com o novo horário e opções de resolução.
      </p>
    </div>
  );
}
