"use client";

import { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { LoggedAppSidebar } from "@/components/logged-app-sidebar";
import { useAuth } from "@/lib/auth/auth-context";
import { getStoredToken } from "@/lib/auth/auth-service";

export function DynamicSidebar() {
  const { isAuthenticated, isLoading } = useAuth();
  // Inicializa com base no token existente no storage/cookie para evitar flash visual
  const [hasToken, setHasToken] = useState<boolean>(() => Boolean(getStoredToken()));

  useEffect(() => {
    setHasToken(Boolean(getStoredToken()) || isAuthenticated);
  }, [isAuthenticated, isLoading]);

  const showLoggedSidebar = isAuthenticated || hasToken;

  if (showLoggedSidebar) {
    return (
      <Suspense fallback={null}>
        <LoggedAppSidebar />
      </Suspense>
    );
  }

  return <AppSidebar />;
}
