"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Check, X, ChevronRight, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
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

    setIsSaved(true);
    setTimeout(() => router.push("/profile"), 1200);
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Card com formulário */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-foreground">Dados pessoais</h2>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações de perfil abaixo
          </p>
        </div>

        <div className="flex flex-col gap-5 pt-2">
          {formFields.map(({ key, label, placeholder, type, icon: Icon }) => (
            <div key={key} className="flex flex-col gap-2">
              <label
                htmlFor={`field-${key}`}
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={14} />
                </div>
                {label}
              </label>

              <Input
                id={`field-${key}`}
                type={type}
                value={formData[key as keyof typeof formData] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                aria-invalid={!!errors[key]}
                className="h-11 rounded-xl bg-muted/40 px-4 text-sm focus:bg-card"
                autoComplete={
                  key === "email" ? "email" :
                  key === "phone" ? "tel" : "name"
                }
              />

              {errors[key] && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <X size={12} />
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Ação no mesmo padrão dos cards de opções (notificações, configurações e sair) */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSaved}
          id="btn-save-personal"
          className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5 text-left cursor-pointer disabled:opacity-80"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            {isSaved ? <Check className="size-5" /> : <Save className="size-5" />}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-foreground">
              {isSaved ? "Salvo com sucesso!" : "Salvar alterações"}
            </span>
            <span className="text-xs text-muted-foreground">
              {isSaved ? "Suas informações foram atualizadas" : "Confirmar e salvar os novos dados do seu perfil"}
            </span>
          </div>
          <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleCancel}
          id="btn-cancel-personal"
          className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-destructive/40 group sm:p-5 text-left cursor-pointer"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
            <X className="size-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-destructive">Cancelar</span>
            <span className="text-xs text-muted-foreground">Descartar alterações e voltar ao perfil</span>
          </div>
          <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
}
