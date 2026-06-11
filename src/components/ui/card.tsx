import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border border-[#E5E7EB] bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
CardRoot.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`px-4 pb-4 ${className}`} {...props}>
      {children}
    </div>
  ),
);
CardBody.displayName = "CardBody";

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`border-t border-[#E5E7EB] px-4 py-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = "CardFooter";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
