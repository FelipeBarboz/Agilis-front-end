"use client";

import { type InputHTMLAttributes, forwardRef, useCallback } from "react";

type CnpjInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function formatCnpj(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function getRawValue(value: string): string {
  return value.replace(/\D/g, "").slice(0, 14);
}

export const CnpjInput = forwardRef<HTMLInputElement, CnpjInputProps>(
  ({ className = "", onChange, value, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = getRawValue(e.target.value);

        if (onChange) {
          onChange({
            ...e,
            target: { ...e.target, value: raw },
          });
        }

        e.target.value = formatCnpj(raw);
      },
      [onChange],
    );

    const displayValue = typeof value === "string" ? formatCnpj(value) : value;

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="00.000.000/0000-00"
        value={displayValue}
        onChange={handleChange}
        className={`w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-white dark:text-black dark:[color-scheme:light] ${className}`}
        {...props}
      />
    );
  },
);
CnpjInput.displayName = "CnpjInput";
