"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  EditPersonalFields,
  type PersonalFormData,
  type PersonalFormErrors,
} from "./edit-personal-fields";
import { EditPersonalActions } from "./edit-personal-actions";

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

export function EditPersonalForm() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState<PersonalFormData>({
    name: user?.name ?? "",
    cpf: user?.cpf ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? "",
        cpf: user.cpf ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<PersonalFormErrors>({});
  const [isSaved, setIsSaved] = useState(false);

  function validate() {
    const newErrors: PersonalFormErrors = {};

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
    if (formData.phone && phoneDigits.length < 10) {
      newErrors.phone = "Telefone inválido.";
    }

    return newErrors;
  }

  function handleChange(key: keyof PersonalFormData, value: string) {
    const masked = key === "phone" ? maskPhone(value) : value;
    setFormData((prev) => ({ ...prev, [key]: masked }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
      });
      setIsSaved(true);
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      console.error("[EditProfile] Erro ao atualizar perfil:", err);
      setErrors({
        name: "Erro ao salvar alterações no Supabase. Tente novamente.",
      });
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <EditPersonalFields
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />
      <EditPersonalActions isSaved={isSaved} onCancel={handleCancel} />
    </form>
  );
}
