"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { EmployeeDashboardBody } from "./_components/employee-dashboard-body";

function EmployeeDashboardPageContent() {
  const params = useParams();
  const storeId = (params?.storeId as string) || "store-super-pinturas";

  return <EmployeeDashboardBody storeId={storeId} />;
}

export default function EmployeeDashboardPage() {
  return (
    <Suspense fallback={null}>
      <EmployeeDashboardPageContent />
    </Suspense>
  );
}
