"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnterpriseInfosFields } from "./enterprise-infos-fields";
import { EnterpriseInfosActions } from "./enterprise-infos-actions";
import { formatCnpj } from "@/lib/services/stores-service";

export function EnterpriseInfosForm() {
  const router = useRouter();
  const [unitName, setUnitName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUnitName =
      sessionStorage.getItem("provider_unitName") ||
      localStorage.getItem("provider_unitName");
    if (storedUnitName) setUnitName(storedUnitName);

    const storedCnpj =
      sessionStorage.getItem("provider_cnpj") ||
      localStorage.getItem("provider_cnpj");
    if (storedCnpj) setCnpj(formatCnpj(storedCnpj));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUnitName = unitName.trim();
    if (!trimmedUnitName) {
      setError("O nome da unidade é obrigatório e não pode ser vazio.");
      return;
    }

    const formatted = formatCnpj(cnpj);
    if (formatted.replace(/\D/g, "").length !== 14) {
      setError("O CNPJ deve conter 14 dígitos (formato: 00.000.000/0000-00).");
      return;
    }

    localStorage.setItem("provider_unitName", trimmedUnitName);
    sessionStorage.setItem("provider_unitName", trimmedUnitName);
    localStorage.setItem("provider_cnpj", formatted);
    sessionStorage.setItem("provider_cnpj", formatted);
    localStorage.setItem("is_provider", "true");
    sessionStorage.setItem("form_enterpriseInfos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      <EnterpriseInfosFields
        unitName={unitName}
        onUnitNameChange={setUnitName}
        cnpj={cnpj}
        onCnpjChange={setCnpj}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <EnterpriseInfosActions />
    </form>
  );
}
