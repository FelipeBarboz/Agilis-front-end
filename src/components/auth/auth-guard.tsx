"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { verifyAuthSession, getStoredToken } from "@/lib/auth/auth-service";
import { useAuth } from "@/lib/auth/auth-context";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated: contextIsAuth, isLoading: contextLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      // Se já possui token no storage/cookie ou já está autenticado no contexto
      if (contextIsAuth || Boolean(getStoredToken())) {
        if (isMounted) setIsVerifying(false);
        return;
      }

      // Validação assíncrona com fallback
      const { isAuthenticated } = await verifyAuthSession();

      if (!isMounted) return;

      if (!isAuthenticated && !contextIsAuth && !getStoredToken()) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      } else {
        setIsVerifying(false);
      }
    }

    if (!contextLoading) {
      void checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [pathname, router, contextIsAuth, contextLoading]);

  if (isVerifying) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          {/* Design padrão de loading/await Agilis (idêntico a payment e services) */}
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
