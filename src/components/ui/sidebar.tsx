"use client";

import Link from "next/link";
import Image from "next/image";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarProps = HTMLAttributes<HTMLElement> & { children: ReactNode };
type SidebarLogoProps = { href?: string; children?: ReactNode };
type SidebarGroupProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };
type SidebarFooterProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

interface SidebarNavItemProps {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number | string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(
  ({ className = "", children, ...props }, ref) => (
    <aside
      ref={ref}
      className={`
        group/sidebar
        flex h-screen flex-col items-center
        border-r border-border bg-background
        py-4
        w-18 hover:w-56
        overflow-hidden
        transition-[width] duration-300 ease-in-out
        ${className}
      `}
      {...props}
    >
      {children}
    </aside>
  ),
);
SidebarRoot.displayName = "Sidebar";

const SidebarLogo = ({ href = "/" }: SidebarLogoProps) => (
  <div className="mb-4 flex w-full px-2">
    <Link
      href={href}
      aria-label="Agilis"
      className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-300 ease-in-out group-hover/sidebar:w-full focus-visible:outline-none"
    >
      {/* Ícone compacto (sidebar fechada) */}
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover/sidebar:scale-75 group-hover/sidebar:opacity-0">
        <Image
          src="/img/side-bar-logo.png"
          alt="Agilis"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>

      {/* Logo expandida (sidebar aberta) */}
      <div className="absolute inset-0 flex items-center justify-center px-4 py-2 opacity-0 transition-all duration-300 delay-75 group-hover/sidebar:opacity-100">
        <Image
          src="/img/logo-opened.png"
          alt="Agilis"
          width={96}
          height={34}
          className="h-full object-contain"
          priority
        />
      </div>
    </Link>
  </div>
);
SidebarLogo.displayName = "SidebarLogo";

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex w-full flex-col items-start gap-1 border-t border-border pt-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarNavItem = ({
  href,
  onClick,
  icon,
  label,
  isActive = false,
  badge,
}: SidebarNavItemProps) => {
  const itemContent = (
    <>
      {/* Ícone — tamanho fixo para não encolher com badge */}
      <span className="relative flex shrink-0 items-center justify-center">
        {icon}
        {badge !== undefined && badge !== 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-xs">
            {badge}
          </span>
        )}
      </span>

      {/* Label — aparece no hover via opacidade e largura */}
      <span className="
        whitespace-nowrap text-sm font-medium
        opacity-0 group-hover/sidebar:opacity-100
        transition-opacity duration-200 delay-100
        flex-1 text-left
      ">
        {label}
      </span>

      {badge !== undefined && badge !== 0 && (
        <span className="
          ml-auto hidden rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary
          opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:inline-flex
          transition-opacity duration-200 delay-100
        ">
          {badge}
        </span>
      )}
    </>
  );

  const className = `
    flex h-10 w-full items-center gap-3
    rounded-lg px-2.5
    transition-colors cursor-pointer text-left
    ${isActive
      ? "bg-primary/10 text-primary font-medium"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }
  `;

  if (onClick || !href) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={className}
      >
        {itemContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={className}
    >
      {itemContent}
    </Link>
  );
};
SidebarNavItem.displayName = "SidebarNavItem";

const SidebarFooterSlot = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-auto flex w-full flex-col items-start gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
SidebarFooterSlot.displayName = "SidebarFooter";

// ─── Compound export ──────────────────────────────────────────────────────────

export const Sidebar = Object.assign(SidebarRoot, {
  Logo: SidebarLogo,
  Group: SidebarGroup,
  NavItem: SidebarNavItem,
  Footer: SidebarFooterSlot,
});