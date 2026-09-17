"use client";

import {
  CalendarDays,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STORE_PERMISSIONS,
  type PermissionId,
} from "@/lib/mocks/positions";

export const PERMISSION_ICONS: Record<
  PermissionId,
  React.ComponentType<{ className?: string }>
> = {
  manage_appointments: CalendarDays,
  access_chats: MessageSquare,
  access_reports: BarChart3,
  store_settings: Settings,
};

interface PermissionChecklistProps {
  selectedPermissions: Set<PermissionId>;
  onTogglePermission: (id: PermissionId) => void;
}

export function PermissionChecklist({
  selectedPermissions,
  onTogglePermission,
}: PermissionChecklistProps) {
  return (
    <div className="flex flex-col gap-2.5 pt-2 border-t border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Permissões de Acesso do Cargo
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Todos os funcionários com este cargo receberão estas permissões.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {STORE_PERMISSIONS.map((perm) => {
          const Icon = PERMISSION_ICONS[perm.id] || ShieldCheck;
          const isActive = selectedPermissions.has(perm.id);

          return (
            <div
              key={perm.id}
              onClick={() => onTogglePermission(perm.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-3 cursor-pointer transition-all select-none",
                isActive
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:bg-muted/40"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {perm.label}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {perm.description}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={cn(
                  "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                  isActive ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                    isActive ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
