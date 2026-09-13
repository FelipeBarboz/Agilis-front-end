import type { ElementType } from "react";
import { User, Mail, Phone, IdCard, Lock, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PersonalFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

export type PersonalFormErrors = Partial<Record<keyof PersonalFormData, string>>;

type FormFieldKey = keyof PersonalFormData;

interface FormFieldConfig {
  key: FormFieldKey;
  label: string;
  placeholder: string;
  type: string;
  icon: ElementType;
  disabled?: boolean;
  helperText?: string;
}

const FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Nome completo",
    placeholder: "Seu nome completo",
    type: "text",
    icon: User,
  },
  {
    key: "cpf",
    label: "CPF",
    placeholder: "000.000.000-00",
    type: "text",
    icon: IdCard,
    disabled: true,
    helperText:
      "O CPF é um documento pessoal e intransferível, não podendo ser alterado.",
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

interface EditPersonalFieldsProps {
  formData: PersonalFormData;
  errors: PersonalFormErrors;
  onChange: (key: FormFieldKey, value: string) => void;
}

export function EditPersonalFields({
  formData,
  errors,
  onChange,
}: EditPersonalFieldsProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">Dados pessoais</h2>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações de perfil abaixo
        </p>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        {FORM_FIELDS.map(
          ({
            key,
            label,
            placeholder,
            type,
            icon: Icon,
            disabled,
            helperText,
          }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`field-${key}`}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={14} />
                  </div>
                  {label}
                </label>
                {disabled && (
                  <span className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Lock size={11} />
                    Não editável
                  </span>
                )}
              </div>

              <Input
                id={`field-${key}`}
                type={type}
                value={formData[key] ?? ""}
                onChange={(e) => !disabled && onChange(key, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={disabled}
                aria-invalid={!!errors[key]}
                className={`h-11 rounded-xl px-4 text-sm focus:bg-card ${
                  disabled
                    ? "cursor-not-allowed border-dashed bg-muted/60 text-muted-foreground select-none opacity-80"
                    : "bg-muted/40"
                }`}
                autoComplete={
                  key === "email" ? "email" : key === "phone" ? "tel" : "name"
                }
              />

              {helperText && (
                <p className="text-[11px] text-muted-foreground">
                  {helperText}
                </p>
              )}

              {errors[key] && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <X size={12} />
                  {errors[key]}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
