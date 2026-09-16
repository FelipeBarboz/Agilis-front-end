"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotifyDelayFooterProps {
  targetedCount: number;
  isSending: boolean;
  onClose: () => void;
  onSend: () => void;
}

export function NotifyDelayFooter({
  targetedCount,
  isSending,
  onClose,
  onSend,
}: NotifyDelayFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="rounded-xl px-4 py-2.5 text-xs font-medium cursor-pointer"
      >
        Cancelar
      </Button>
      <Button
        type="button"
        disabled={targetedCount === 0 || isSending}
        onClick={onSend}
        className="rounded-xl px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer disabled:opacity-50 flex items-center gap-2"
      >
        <Send className="size-3.5" />
        {isSending
          ? "Disparando..."
          : `Disparar para ${targetedCount} cliente(s)`}
      </Button>
    </div>
  );
}
