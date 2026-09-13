"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  EditProviderFields,
  type ProviderFormData,
  type ProviderFormErrors,
} from "./edit-provider-fields";
import { EditProviderActions } from "./edit-provider-actions";

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function EditProviderForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProviderFormData>({
    name: "Caio Henrique Prestador",
    email: "caio.prestador@email.com",
    phone: "(11) 98765-4321",
  });

  const [errors, setErrors] = useState<ProviderFormErrors>({});
  const [isSaved, setIsSaved] = useState(false);

  function validate() {
    const newErrors: ProviderFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório.";
    } else if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Informe nome e sobrenome.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = "Telefone é obrigatório.";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Telefone inválido.";
    }

    return newErrors;
  }

  function handleChange(key: keyof ProviderFormData, value: string) {
    const masked = key === "phone" ? maskPhone(value) : value;
    setFormData((prev) => ({ ...prev, [key]: masked }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaved(true);
    setTimeout(() => router.push("/profile"), 1200);
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <EditProviderFields
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />
      <EditProviderActions isSaved={isSaved} onCancel={handleCancel} />
    </form>
  );
}
