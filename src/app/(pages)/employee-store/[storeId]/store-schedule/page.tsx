"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { StoreScheduleBody } from "./_components/store-schedule-body";

function StoreSchedulePageContent() {
  const params = useParams();
  const storeId = (params?.storeId as string) || "store-super-pinturas";

  return <StoreScheduleBody storeId={storeId} />;
}

export default function StoreSchedulePage() {
  return (
    <Suspense fallback={null}>
      <StoreSchedulePageContent />
    </Suspense>
  );
}
