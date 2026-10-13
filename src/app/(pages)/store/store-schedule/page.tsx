"use client";

import { Suspense } from "react";
import { StoreScheduleBody } from "@/app/(pages)/employee-store/[storeId]/store-schedule/_components/store-schedule-body";

function StoreSchedulePageContent() {
  return <StoreScheduleBody storeId="store-super-pinturas" canEdit={true} />;
}

export default function StoreSchedulePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Carregando escala da loja...</div>}>
      <StoreSchedulePageContent />
    </Suspense>
  );
}
