"use client";

import { type InputHTMLAttributes, forwardRef, useCallback } from "react";

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

function formatPhone(value: string): string {
  // Remove tudo que não é número
  const digits = value.replace(/\D/g, "").slice(0, 11);

  // Aplica máscara: 11 93434-3434
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 10) return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getRawValue(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className = "", onChange, value, ...props }, ref) => {

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = getRawValue(e.target.value);

        // Envia o valor cru (só números) para o react-hook-form
        if (onChange) {
          onChange({
            ...e,
            target: { ...e.target, value: raw },
          });
        }

        // Atualiza o input visualmente com a máscara
        e.target.value = formatPhone(raw);
      },
      [onChange],
    );

    // Formata o valor vindo do react-hook-form para exibição
    const displayValue = typeof value === "string" ? formatPhone(value) : value;

    return (
      <div className="flex overflow-hidden rounded-lg border border-input bg-background transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">

        {/* Prefix fixo */}
        <div className="flex shrink-0 items-center gap-1.5 border-r border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          🇧🇷 +55
        </div>

        {/* Input do número */}
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          placeholder="00 00000-0000"
          value={displayValue}
          onChange={handleChange}
          className={`w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${className}`}
          {...props}
        />

      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";