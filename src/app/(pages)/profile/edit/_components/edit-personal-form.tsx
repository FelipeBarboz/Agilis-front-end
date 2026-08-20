"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Check, X } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/lib/mocks/user";

// ─── Máscara de telefone ───────────────────────────────────────────────────────

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

// ─── Campos do formulário ─────────────────────────────────────────────────────

type FormField = {
  key: keyof typeof mockUser;
  label: string;
  placeholder: string;
  type: string;
  icon: React.ElementType;
};

const formFields: FormField[] = [
  {
    key: "name",
    label: "Nome completo",
    placeholder: "Seu nome completo",
    type: "text",
    icon: User,
  },
  {
    key: "email",
    label: "E-mail",
    placeholder: "seu@email.com",
    type: "email",
    icon: Mail,
  },
  {
    key: "phone",
    label: "Telefone",
    placeholder: "(00) 00000-0000",
    type: "tel",
    icon: Phone,
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function EditPersonalForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSaved, setIsSaved] = useState(false);

  function validate() {
    const newErrors: Partial<Record<string, string>> = {};

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

  function handleChange(key: string, value: string) {
    const masked = key === "phone" ? maskPhone(value) : value;
    setFormData((prev) => ({ ...prev, [key]: masked }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: integrar com API/Supabase
    setIsSaved(true);
    setTimeout(() => router.push("/profile"), 1200);
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Card de campos */}
      <Card>
        <CardHeader className="pb-0">
          <h2 className="text-sm font-semibold text-foreground">
            Dados pessoais
          </h2>
          <p className="text-xs text-muted-foreground">
            Atualize suas informações de perfil abaixo.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 pt-4">
          {formFields.map(({ key, label, placeholder, type, icon: Icon }) => (
            <div key={key} className="flex flex-col gap-1.5">
              {/* Label com ícone */}
              <label
                htmlFor={`field-${key}`}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground"
              >
                <Icon size={13} className="text-primary" />
                {label}
              </label>

              {/* Input */}
              <Input
                id={`field-${key}`}
                type={type}
                value={formData[key as keyof typeof formData] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                aria-invalid={!!errors[key]}
                autoComplete={
                  key === "email" ? "email" :
                  key === "phone" ? "tel" : "name"
                }
              />

              {/* Mensagem de erro */}
              {errors[key] && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <X size={11} />
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col gap-2 pb-8">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSaved}
          id="btn-save-personal"
        >
          {isSaved ? (
            <span className="flex items-center gap-2">
              <Check size={16} />
              Salvo!
            </span>
          ) : (
            "Salvar alterações"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleCancel}
          id="btn-cancel-personal"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
