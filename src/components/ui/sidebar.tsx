"use client";

import Link from "next/link";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

interface SidebarLogoProps {
  href?: string;
  children: ReactNode;
}

interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}

interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(
  ({ className = "", children, ...props }, ref) => (
    <aside
      ref={ref}
      className={`flex h-screen w-[72px] flex-col items-center border-r border-[#E5E7EB] bg-white py-4 ${className}`}
      {...props}
    >
      {children}
    </aside>
  ),
);
SidebarRoot.displayName = "Sidebar";

const SidebarLogo = ({ href = "/", children }: SidebarLogoProps) => (
  <Link
    href={href}
    className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#1A1A1A] text-white"
  >
    {children}
  </Link>
);
SidebarLogo.displayName = "SidebarLogo";

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex w-full flex-col items-center gap-1 border-t border-[#E5E7EB] pt-3 ${className}`}
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
    title={label}
    aria-label={label}
    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
      isActive
        ? "bg-[#00A86B]/10 text-[#00A86B]"
        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]"
    }`}
  >
    {icon}
  </Link>
);
SidebarNavItem.displayName = "SidebarNavItem";

const SidebarFooterSlot = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-auto flex w-full flex-col items-center gap-2 ${className}`}
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
