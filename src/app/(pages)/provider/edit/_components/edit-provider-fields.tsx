import type { ElementType } from "react";
import { Mail, Phone, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ProviderFormData {
  name: string;
  email: string;
  phone: string;
}

export type ProviderFormErrors = Partial<Record<keyof ProviderFormData, string>>;

type FormFieldKey = keyof ProviderFormData;

interface FormFieldConfig {
  key: FormFieldKey;
  label: string;
  placeholder: string;
  type: string;
  icon: ElementType;
}

const FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Nome completo do prestador",
    placeholder: "Seu nome completo",
    type: "text",
    icon: User,
  },
  {
    key: "email",
    label: "E-mail de contato",
    placeholder: "seu@email.com",
    type: "email",
    icon: Mail,
  },
  {
    key: "phone",
    label: "Telefone / WhatsApp",
    placeholder: "(00) 00000-0000",
    type: "tel",
    icon: Phone,
  },
];

interface EditProviderFieldsProps {
  formData: ProviderFormData;
  errors: ProviderFormErrors;
  onChange: (key: FormFieldKey, value: string) => void;
}

export function EditProviderFields({
  formData,
  errors,
  onChange,
}: EditProviderFieldsProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">
          Dados do prestador
        </h2>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações de contato profissional abaixo
        </p>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        {FORM_FIELDS.map(({ key, label, placeholder, type, icon: Icon }) => (
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
              value={formData[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              aria-invalid={!!errors[key]}
              className="h-11 rounded-xl px-4 text-sm bg-muted/40 focus:bg-card"
              autoComplete={
                key === "email" ? "email" : key === "phone" ? "tel" : "name"
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
  );
}
