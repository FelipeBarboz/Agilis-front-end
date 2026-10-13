"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnterpriseInfosFields } from "./enterprise-infos-fields";
import { EnterpriseInfosActions } from "./enterprise-infos-actions";

export function EnterpriseInfosForm() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    const storedCnpj = localStorage.getItem("provider_cnpj");
    if (storedCnpj) setCnpj(storedCnpj);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cnpj) {
      localStorage.setItem("provider_cnpj", cnpj);
      localStorage.setItem("is_provider", "true");
    }
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
