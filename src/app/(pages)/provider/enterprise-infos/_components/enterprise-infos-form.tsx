"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnterpriseInfosFields } from "./enterprise-infos-fields";
import { EnterpriseInfosActions } from "./enterprise-infos-actions";

export function EnterpriseInfosForm() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_enterpriseInfos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <EnterpriseInfosFields cnpj={cnpj} onCnpjChange={setCnpj} />

      {/* Separador */}
      <div className="h-px bg-border" />

      <EnterpriseInfosActions />
    </form>
  );
}
