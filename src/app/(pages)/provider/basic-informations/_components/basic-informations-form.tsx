"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BasicInformationsFields } from "./basic-informations-fields";
import { BasicInformationsActions } from "./basic-informations-actions";

export function BasicInformationsForm() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_basicInfos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <BasicInformationsFields />

      {/* Separador */}
      <div className="h-px bg-border" />

      <BasicInformationsActions />
    </form>
  );
}
