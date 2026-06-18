import { type InputHTMLAttributes, forwardRef } from "react";

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className = "", ...props }, ref) => (
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
        maxLength={11}
        placeholder="00 00000-0000"
        className={`w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${className}`}
        {...props}
      />

    </div>
  ),
);
PhoneInput.displayName = "PhoneInput";