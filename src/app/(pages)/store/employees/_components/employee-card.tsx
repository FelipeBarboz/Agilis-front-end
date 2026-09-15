"use client";

import { Settings, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/mocks/employees";

interface EmployeeCardProps {
  employee: Employee;
  onManage: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onManage }: EmployeeCardProps) {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground text-base">{employee.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              <Briefcase className="size-3 text-primary" />
              {employee.roleLabel}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            {employee.permissions.length}{" "}
            {employee.permissions.length === 1 ? "permissão ativa" : "permissões ativas"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border w-full sm:w-auto justify-end">
        <Button
          variant="outline"
          onClick={() => onManage(employee)}
          className="gap-2 rounded-xl border-border hover:bg-muted text-foreground h-9 px-3.5 text-xs font-semibold cursor-pointer"
          title="Gerenciar funcionário"
        >
          <Settings className="size-4 text-muted-foreground" />
          <span>Gerenciar</span>
        </Button>
      </div>
    </div>
  );
}
