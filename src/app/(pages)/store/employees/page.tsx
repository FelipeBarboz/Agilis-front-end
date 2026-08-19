"use client";

import { EmployeesList } from "./_components/employees-list";

export default function EmployeesPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex flex-col bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-border">
          <EmployeesList />
        </div>
      </main>
    </div>
  );
}

