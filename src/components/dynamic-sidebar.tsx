"use client";

import { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { LoggedAppSidebar } from "@/components/logged-app-sidebar";
import { useAuth } from "@/lib/auth/auth-context";
import { getStoredToken } from "@/lib/auth/auth-service";

export function DynamicSidebar() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasToken(Boolean(getStoredToken()) || isAuthenticated);
  }, [isAuthenticated, isLoading]);

  // Durante SSR e primeira hidratação no cliente, renderiza AppSidebar para garantir paridade exata
  if (!mounted) {
    return <AppSidebar />;
  }

  const showLoggedSidebar = isAuthenticated || hasToken;

  if (showLoggedSidebar) {
    return (
      <Suspense fallback={<AppSidebar />}>
        <LoggedAppSidebar />
      </Suspense>
    );
  }

  return <AppSidebar />;
}

