"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mainNavItems, categoryNavItems } from "./navigation-items";
import {
  IconHome,
  IconServices,
  IconSupport,
  IconHistory,
  IconAll,
  IconTech,
  IconElectric,
  IconCleaning,
  IconPlumbing,
  IconPainting,
  IconStore,
} from "@/components/ui/icons";
import { useAuth } from "@/lib/auth/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";

const iconMap: Record<string, React.ReactNode> = {
  "/home": <IconHome size={20} />,
  "/services": <IconServices size={20} />,
  "/support": <IconSupport size={20} />,
  "/history": <IconHistory size={20} />,
  "/stores": <IconStore size={20} />,
  todos: <IconAll size={18} />,
  tecnologia: <IconTech size={18} />,
  eletrica: <IconElectric size={18} />,
  limpeza: <IconCleaning size={18} />,
  hidraulica: <IconPlumbing size={18} />,
  pintura: <IconPainting size={18} />,
};

export function NavigationMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const { isAuthenticated, user } = useAuth();

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  // Previne rolagem de fundo quando o drawer estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-primary px-4 shadow-sm select-none">
        {/* Left: Hamburger Menu Button */}
        <div className="flex w-11 items-center justify-start">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground hover:bg-black/10 active:bg-black/20 transition-colors focus-visible:outline-none"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-7 w-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Center: Large, prominent Agilis Logo */}
        <Link
          href="/"
          className="flex items-center justify-center transition-transform active:scale-95"
          aria-label="Ir para a página inicial"
        >
          <Image
            src="/img/logo-opened.png"
            alt="Agilis"
            width={160}
            height={52}
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-xs"
            priority
          />
        </Link>

        {/* Right: User Profile Avatar / Icon */}
        <div className="flex w-11 items-center justify-end">
          {isAuthenticated && user ? (
            <Link
              href="/profile"
              className="flex items-center justify-center transition-transform active:scale-95"
              aria-label="Perfil do usuário"
            >
              <UserAvatar user={user} size={36} />
            </Link>
          ) : (
            <Link
              href="/register/user"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-primary-foreground hover:bg-white/25 active:bg-white/30 transition-colors"
              aria-label="Entrar ou cadastrar"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>
      </header>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative flex h-full w-72 max-w-[82vw] flex-col border-r border-border bg-background text-foreground shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl bg-primary px-3.5 shadow-xs transition-transform active:scale-95"
                  aria-label="Agilis"
                >
                  <Image
                    src="/img/logo-opened.png"
                    alt="Agilis"
                    width={92}
                    height={30}
                    className="h-6 w-auto object-contain"
                    priority
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {/* Main navigation */}
                <div className="space-y-1">
                  <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Menu Principal
                  </p>
                  {[
                    ...mainNavItems,
                    ...(isAuthenticated ? [{ href: "/stores", label: "Lojas" }] : []),
                  ].map((item) => {
                    const isActive =
                      item.href === "/home"
                        ? pathname === "/" || pathname === "/home"
                        : item.href === "/stores"
                          ? pathname.startsWith("/stores") || pathname.startsWith("/store") || pathname.startsWith("/employee-store")
                          : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="shrink-0">{iconMap[item.href]}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Categories */}
                <div className="space-y-1 border-t border-border pt-4">
                  <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Categorias
                  </p>
                  {categoryNavItems.map((item) => {
                    const isActive =
                      pathname === "/services" && currentCategory === item.category;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="shrink-0">
                          {iconMap[item.category ?? ""] ?? null}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Drawer Footer (Profile / Auth) */}
              <div className="border-t border-border p-3">
                <Link
                  href={isAuthenticated ? "/profile" : "/register/user"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {isAuthenticated && user ? (
                    <UserAvatar user={user} size={36} />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {isAuthenticated && user?.name ? user.name : "Minha Conta"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isAuthenticated ? "Ver perfil" : "Entrar ou cadastrar"}
                    </span>
                  </div>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
