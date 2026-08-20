"use client";

import { useState } from "react";
import { Settings, Plus, User, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageEmployeeModal } from "./manage-employee-modal";
import { AddEmployeeModal } from "./add-employee-modal";
import { mockEmployees, type Employee } from "@/lib/mocks/employees";
import { mockPositions } from "@/lib/mocks/positions";

export function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const openManageModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setManageModalOpen(true);
  };

  const handleSaveEmployee = (newRole: string) => {
    if (!selectedEmployee) return;
    
    const rolePos = mockPositions.find(
      (p) => p.title.toLowerCase() === newRole.toLowerCase()
    );
    const newPermissions = rolePos?.permissions || ["manage_appointments"];

    setEmployees((prev) => 
      prev.map((emp) => 
        emp.id === selectedEmployee.id 
          ? { 
              ...emp, 
              roleLabel: newRole,
              permissions: newPermissions
            } 
          : emp
      )
    );
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee.id));
    setSelectedEmployee(null);
  };

  const handleAddEmployee = (newEmp: Omit<Employee, "id">) => {
    const rolePos = mockPositions.find(
      (p) => p.title.toLowerCase() === newEmp.roleLabel.toLowerCase()
    );
    const initialPermissions = rolePos?.permissions || newEmp.permissions;

    const created: Employee = {
      id: String(Date.now()),
      name: newEmp.name,
      roleLabel: newEmp.roleLabel,
      permissions: initialPermissions,
    };
    setEmployees((prev) => [...prev, created]);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Equipe da Loja</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os funcionários da sua loja, seus cargos e níveis de permissão.
          </p>
        </div>
        <Button 
          onClick={() => setAddModalOpen(true)}
          className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      {/* Lista de Funcionários (1 embaixo do outro) */}
      <div className="flex flex-col gap-3.5">
        {employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20">
            <User className="size-10 text-muted-foreground mb-3" />
            <h3 className="font-bold text-foreground">Nenhum funcionário cadastrado</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Adicione membros à sua equipe para distribuir atendimentos e permissões.
            </p>
            <Button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2"
            >
              <Plus className="size-4" />
              Adicionar Funcionário
            </Button>
          </div>
        ) : (
          employees.map((emp) => {
            const initials = emp.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("");

            return (
              <div 
                key={emp.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-white shadow-xs hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-foreground text-base">{emp.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        <Briefcase className="size-3 text-primary" />
                        {emp.roleLabel}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" />
                      {emp.permissions.length} {emp.permissions.length === 1 ? "permissão ativa" : "permissões ativas"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    onClick={() => openManageModal(emp)}
                    className="gap-2 rounded-xl border-border hover:bg-muted text-foreground h-9 px-3.5 text-xs font-semibold"
                    title="Gerenciar funcionário"
                  >
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Gerenciar</span>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Gerenciamento do Funcionário */}
      <ManageEmployeeModal 
        open={manageModalOpen} 
        onOpenChange={setManageModalOpen}
        employeeName={selectedEmployee?.name || ""}
        currentRole={selectedEmployee?.roleLabel}
        onSave={handleSaveEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Modal de Adicionar Funcionário */}
      <AddEmployeeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddEmployee={handleAddEmployee}
      />

    </div>
  );
}

