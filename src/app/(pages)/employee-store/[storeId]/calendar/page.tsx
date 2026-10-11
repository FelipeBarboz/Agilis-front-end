"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { EmployeeCalendarBody } from "./_components/employee-calendar-body";

function EmployeeCalendarPageContent() {
  const params = useParams();
  const storeId = (params?.storeId as string) || "store-super-pinturas";

  return <EmployeeCalendarBody storeId={storeId} />;
}

export default function EmployeeCalendarPage() {
  return (
    <Suspense fallback={null}>
      <EmployeeCalendarPageContent />
    </Suspense>
  );
}
