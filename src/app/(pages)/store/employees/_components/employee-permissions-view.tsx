import { Info, ShieldCheck, CalendarDays, MessageSquare, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STORE_PERMISSIONS,
  type PermissionId,
} from "@/lib/mocks/positions";

const PERMISSION_ICONS: Record<PermissionId, React.ComponentType<{ className?: string }>> = {
  manage_appointments: CalendarDays,
  access_chats: MessageSquare,
  access_reports: BarChart3,
  store_settings: Settings,
};

interface EmployeePermissionsViewProps {
  selectedRole: string;
  rolePermissions: PermissionId[];
}

export function EmployeePermissionsView({
  selectedRole,
  rolePermissions,
}: EmployeePermissionsViewProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Permissões do Cargo</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acessos herdados automaticamente do cargo{" "}
            <strong className="text-foreground">{selectedRole}</strong>.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {STORE_PERMISSIONS.map((perm) => {
          const Icon = PERMISSION_ICONS[perm.id] || ShieldCheck;
          const isGranted = rolePermissions.includes(perm.id);

          return (
            <div
              key={perm.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all select-none",
                isGranted
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/10 opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    isGranted ? "text-primary" : "text-muted-foreground"
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

              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-md shrink-0",
                  isGranted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isGranted ? "Concedido" : "Não incluso"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground border border-border mt-1">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <span>
          Para alterar as permissões deste cargo, acesse a aba <strong>Cargos</strong> no perfil da loja.
        </span>
      </div>
    </div>
  );
}
