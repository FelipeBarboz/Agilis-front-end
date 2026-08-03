"use client";

import Link from "next/link";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarProps      = HTMLAttributes<HTMLElement> & { children: ReactNode };
type SidebarLogoProps  = { href?: string; children: ReactNode };
type SidebarGroupProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };
type SidebarFooterProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
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

const SidebarLogo = ({ href = "/", children }: SidebarLogoProps) => (
  <div className="mb-4 flex w-full px-2">
    <Link
      href={href}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
    >
      {children}
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
  icon,
  label,
  isActive = false,
}: SidebarNavItemProps) => (
  <Link
    href={href}
    aria-label={label}
    className={`
      flex h-10 w-full items-center gap-3
      rounded-lg px-2.5
      transition-colors
      ${isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }
    `}
  >
    {/* Ícone — tamanho fixo para não encolher */}
    <span className="shrink-0">{icon}</span>

    {/* Label — aparece no hover via opacidade e largura */}
    <span className="
      whitespace-nowrap text-sm font-medium
      opacity-0 group-hover/sidebar:opacity-100
      transition-opacity duration-200 delay-100
    ">
      {label}
    </span>
  </Link>
);
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