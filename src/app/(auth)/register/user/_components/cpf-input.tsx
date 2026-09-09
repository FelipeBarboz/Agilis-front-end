"use client";

import { type InputHTMLAttributes, forwardRef, useCallback } from "react";

type CpfInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function getRawValue(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
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

        e.target.value = formatCpf(raw);
      },
      [onChange],
    );

    const displayValue = typeof value === "string" ? formatCpf(value) : value;

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={displayValue}
        onChange={handleChange}
        className={`w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-white dark:text-black dark:[color-scheme:light] ${className}`}
        {...props}
      />
    );
  },
);
CpfInput.displayName = "CpfInput";
