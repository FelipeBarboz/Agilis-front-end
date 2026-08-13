"use client";

import { useState } from "react";
import { Settings, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageEmployeeModal, type PermissionId } from "./manage-employee-modal";

import { mockEmployees, type Employee } from "@/lib/mocks/employees";

export function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openManageModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleSavePermissions = (permissions: PermissionId[]) => {
    if (!selectedEmployee) return;
    
    setEmployees((prev) => 
      prev.map((emp) => 
        emp.id === selectedEmployee.id 
          ? { ...emp, permissions } 
          : emp
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header da Seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Equipe</h2>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os funcionários da sua loja e suas permissões.</p>
        </div>
        <Button className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Adicionar Funcionário</span>
        </Button>
      </div>

      {/* Lista de Funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <User className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-foreground">{emp.name}</h3>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">{emp.roleLabel}</span>
              </div>
            </div>
            
            <button
              onClick={() => openManageModal(emp)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Gerenciar funcionário"
            >
              <Settings className="size-5" />
            </button>
          </div>
        ))}
      </div>

      <ManageEmployeeModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        employeeName={selectedEmployee?.name || ""}
        initialPermissions={selectedEmployee?.permissions}
        onSave={handleSavePermissions}
      />

    </div>
  );
}
