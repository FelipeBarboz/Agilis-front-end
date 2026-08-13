"use client";

import { EmployeesList } from "./_components/employees-list";

export default function EmployeesPage() {
  return (
    <div className="flex min-h-full flex-col bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex flex-col bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-border">
          <EmployeesList />
        </div>
      </main>
    </div>
  );
}
