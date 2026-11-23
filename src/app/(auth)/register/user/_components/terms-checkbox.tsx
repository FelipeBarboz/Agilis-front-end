import { type InputHTMLAttributes, forwardRef } from "react";

type TermsCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const TermsCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  ({ className = "", ...props }, ref) => (
    <label className="flex cursor-pointer items-start gap-2.5 text-xs text-primary-foreground">
      <input
        ref={ref}
        type="checkbox"
        className={`mt-0.5 shrink-0 accent-secondary-foreground ${className}`}
        {...props}
      />
      <span>
        Aceito os{" "}
        <a href="/terms" className="text-secondary-foreground hover:underline">
          Termos e condições
        </a>{" "}
        e autorizo o uso dos meus dados de acordo com a{" "}
        <a href="/privacy" className="text-secondary-foreground hover:underline">
          Declaração de Privacidade
        </a>
      </span>
    </label>
  ),
);
TermsCheckbox.displayName = "TermsCheckbox";