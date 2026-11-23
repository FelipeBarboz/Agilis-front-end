"use client";

import { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { LoggedAppSidebar } from "@/components/logged-app-sidebar";
import { useAuth } from "@/lib/auth/auth-context";

export function DynamicSidebar() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante SSR e primeira hidratação, renderiza AppSidebar para paridade exata
  if (!mounted || isLoading) {
    return <AppSidebar />;
  }

  if (isAuthenticated) {
    return (
      <Suspense fallback={<AppSidebar />}>
        <LoggedAppSidebar />
      </Suspense>
    );
  }

  return <AppSidebar />;
}
