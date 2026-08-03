import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center">

        {/* Ícone opcional à esquerda */}
        {leftIcon && (
          <span className="absolute left-3 text-muted-foreground">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className={`
            w-full rounded-lg border border-input bg-background
            px-4 py-3 text-sm text-foreground
            placeholder:text-muted-foreground
            shadow-sm transition-colors
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Ícone opcional à direita */}
        {rightIcon && (
          <span className="absolute right-3 text-muted-foreground">
            {rightIcon}
          </span>
        )}

      </div>
    );
  },
);

Input.displayName = "Input";