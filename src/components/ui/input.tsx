import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#9CA3AF]">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] shadow-sm transition-colors focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 focus:outline-none ${leftIcon ? "pl-10" : ""} ${className}`}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
