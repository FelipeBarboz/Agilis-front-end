"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceCardInfo {
  serviceId: string;
  serviceName: string;
  scheduledAt?: string; // "Seg, 02 Set · 14h00"
  status: "scheduled" | "in_progress" | "finished" | "pending";
  price: string;
}

interface ServiceSummaryBannerProps {
  service: ServiceCardInfo;
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  ServiceCardInfo["status"],
  { label: string; color: string; dot: string }
> = {
  scheduled: {
    label: "Agendado",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  in_progress: {
    label: "Em andamento",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500 animate-pulse",
  },
  finished: {
    label: "Finalizado",
    color: "text-muted-foreground bg-muted border-border",
    dot: "bg-muted-foreground",
  },
  pending: {
    label: "Aguardando confirmação",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    dot: "bg-orange-500 animate-pulse",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ServiceSummaryBanner({ service }: ServiceSummaryBannerProps) {
  const { serviceName, scheduledAt, status, price, serviceId } = service;
  const cfg = STATUS_MAP[status];

  return (
    <Link
      href={`/services/${serviceId}`}
      className="group mx-3 mt-3 flex items-center justify-between gap-3 rounded-2xl border bg-card p-3.5 shadow-xs ring-1 ring-foreground/5 transition-all hover:ring-primary/30 hover:shadow-md"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
        <CalendarDays size={20} />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-sm font-semibold text-foreground">
          {serviceName}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {scheduledAt && (
            <span className="text-xs text-muted-foreground">{scheduledAt}</span>
          )}
          {scheduledAt && <span className="text-muted-foreground/40 text-xs">·</span>}
          <span className="text-xs font-semibold text-primary">{price}</span>
        </div>
      </div>

      {/* Status badge + arrow */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cfg.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>

        {status === "finished" && (
          <Star size={14} className="text-amber-400 fill-amber-400" />
        )}

        <ChevronRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
        />
      </div>
    </Link>
  );
}
