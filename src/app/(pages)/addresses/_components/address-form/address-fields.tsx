import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { MapPin, Navigation, Hash, Building, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type AddressSchema } from "./address-schema";
import { formatCep } from "@/lib/masks/cep-mask";

const inputClass = "h-11 rounded-xl bg-muted/40 px-4 text-sm text-foreground focus:bg-card border-border";

interface FieldLabelProps {
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FieldLabel({ htmlFor, icon, children }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-2 text-sm font-semibold text-foreground"
    >
      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <X size={12} />
      {message}
    </p>
  );
}

interface AddressFieldsProps {
  control: Control<AddressSchema>;
  register: UseFormRegister<AddressSchema>;
  errors: FieldErrors<AddressSchema>;
}

export function AddressFields({ control, register, errors }: AddressFieldsProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">Dados do local</h2>
        <p className="text-sm text-muted-foreground">
          Informe o CEP e o endereço completo para atendimento
        </p>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        {/* CEP */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="field-cep" icon={<MapPin size={14} />}>
            CEP
          </FieldLabel>
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <Input
                {...field}
                id="field-cep"
                placeholder="00000-000"
                inputMode="numeric"
                className={inputClass}
                onChange={(e) => field.onChange(formatCep(e.target.value))}
              />
            )}
          />
          <FieldError message={errors.cep?.message} />
        </div>

        {/* Rua/Avenida */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="field-street" icon={<Navigation size={14} />}>
            Rua / Avenida
          </FieldLabel>
          <Input
            id="field-street"
            placeholder="Ex: Avenida Paulista"
            className={inputClass}
            {...register("street")}
          />
          <FieldError message={errors.street?.message} />
        </div>

        {/* Número e Complemento */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="field-number" icon={<Hash size={14} />}>
              Número
            </FieldLabel>
            <Input
              id="field-number"
              placeholder="Ex: 1578"
              className={inputClass}
              {...register("number")}
            />
            <FieldError message={errors.number?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="field-complement" icon={<Building size={14} />}>
              Complemento (opcional)
            </FieldLabel>
            <Input
              id="field-complement"
              placeholder="Ex: Apto 302, Bloco B"
              className={inputClass}
              {...register("complement")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
