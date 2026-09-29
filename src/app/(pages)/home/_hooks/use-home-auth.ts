"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getStoredToken } from "@/lib/auth/auth-service";

export function useHomeAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsLoggedIn(Boolean(getStoredToken()) || isAuthenticated);
    };

    check();
    setMounted(true);

    window.addEventListener("storage", check);
    window.addEventListener("auth-change", check);

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("auth-change", check);
    };
  }, [isAuthenticated, isLoading]);

  return { isLoggedIn, mounted };
}
