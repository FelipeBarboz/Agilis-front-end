import { AlertCircle } from "lucide-react";

interface CancellationBannerProps {
  reason: string;
}

export function CancellationBanner({ reason }: CancellationBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-700 dark:text-red-400">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div className="text-xs">
        <p className="font-semibold text-red-800 dark:text-red-300">
          Motivo do cancelamento
        </p>
        <p className="mt-0.5 leading-relaxed text-muted-foreground">{reason}</p>
      </div>
    </div>
  );
}
