"use client";

import { useState, useEffect } from "react";
import { CreateStoreHeader } from "./_components/create-store-header";
import { CreateStoreProgress } from "./_components/create-store-progress";
import {
  CreateStoreStepsList,
  STORE_CREATION_STEPS,
  type StoreStepKey,
} from "./_components/create-store-steps-list";
import { CreateStoreFinalizeCard } from "./_components/create-store-finalize-card";

export default function CreateStorePage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Record<StoreStepKey, boolean>>({
    basicInfos: false,
    attendanceArea: false,
    storeDescription: false,
    enterprisePhotos: false,
  });

  useEffect(() => {
    // Limpa registros antigos do localStorage de protótipos anteriores
    localStorage.removeItem("form_basicInfos");
    localStorage.removeItem("form_enterpriseInfos");
    localStorage.removeItem("form_attendanceArea");
    localStorage.removeItem("form_storeDescription");
    localStorage.removeItem("form_enterprisePhotos");

    setMounted(true);
    setStatus({
      basicInfos: sessionStorage.getItem("form_basicInfos") === "true",
      attendanceArea: sessionStorage.getItem("form_attendanceArea") === "true",
      storeDescription:
        sessionStorage.getItem("form_storeDescription") === "true",
      enterprisePhotos:
        sessionStorage.getItem("form_enterprisePhotos") === "true",
    });
  }, []);

  const totalSteps = STORE_CREATION_STEPS.length;
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const isAllCompleted = mounted && completedSteps === totalSteps;

  const handleFinishStoreCreation = () => {
    if (!isAllCompleted) return;
    localStorage.setItem("has_active_store", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));
    // Executa full refresh para carregar a nova sidebar com o item 'Sua Loja'
    window.location.href = "/store/store-profile";
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Conteúdo Principal */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <CreateStoreHeader />

        <CreateStoreProgress
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          progressPercentage={progressPercentage}
        />

        <CreateStoreStepsList mounted={mounted} status={status} />

        <CreateStoreFinalizeCard
          isAllCompleted={isAllCompleted}
          onFinish={handleFinishStoreCreation}
        />
      </main>
    </div>
  );
}
