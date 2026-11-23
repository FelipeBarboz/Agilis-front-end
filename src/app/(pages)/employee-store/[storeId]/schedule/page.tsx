"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

function EmployeeScheduleContent() {
  const router = useRouter();
  const params = useParams();
  const storeId = (params?.storeId as string) || "store-super-pinturas";

  useEffect(() => {
    router.replace(`/employee-store/${storeId}/calendar`);
  }, [router, storeId]);

  return null;
}

export default function EmployeeSchedulePage() {
  return (
    <Suspense fallback={null}>
      <EmployeeScheduleContent />
    </Suspense>
  );
}
