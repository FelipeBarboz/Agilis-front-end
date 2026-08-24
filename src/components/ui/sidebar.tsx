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