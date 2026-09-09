"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/**
 * Botão inteligente do banner corporativo.
 * – Autenticado  → redireciona para /provider
 * – Não autenticado → redireciona para /register/user
 */
export function RegisterButton() {
  const [href, setHref] = useState<string>("/register/user");

  useEffect(() => {
    // Verifica o cookie de autenticação (mesmo que o middleware usa)
    const isLoggedIn = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("sb-access-token="));

    setHref(isLoggedIn ? "/provider" : "/register/user");
  }, []);

  return (
    <Button asChild variant="primary" size="lg">
      <Link href={href}>Cadastre-se</Link>
    </Button>
  );
}
