"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageEmployeeModal } from "./manage-employee-modal";
import { AddEmployeeModal } from "./add-employee-modal";
import { EmployeeCard } from "./employee-card";
import { EmployeesEmptyState } from "./employees-empty-state";
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
    const newPermissions = rolePos?.permissions ?? ["manage_appointments"];

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              roleLabel: newRole,
              permissions: newPermissions,
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
    const initialPermissions = rolePos?.permissions ?? newEmp.permissions;

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
          className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      {/* Lista de Funcionários */}
      <div className="flex flex-col gap-3.5">
        {employees.length === 0 ? (
          <EmployeesEmptyState onAddEmployee={() => setAddModalOpen(true)} />
        ) : (
          employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onManage={openManageModal}
            />
          ))
        )}
      </div>

      {/* Modal de Gerenciamento do Funcionário */}
      <ManageEmployeeModal
        open={manageModalOpen}
        onOpenChange={setManageModalOpen}
        employeeName={selectedEmployee?.name ?? ""}
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
