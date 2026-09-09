"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getStoredToken } from "@/lib/auth/auth-service";

export type BannerCondition =
  | "unauthenticated"
  | "no_provider"
  | "no_store"
  | "has_store";

export interface BannerContent {
  title: ReactNode;
  buttonText: string;
  href: string;
}

export function useCorporateBanner(): BannerContent {
  const { isAuthenticated, isLoading } = useAuth();
  const [condition, setCondition] = useState<BannerCondition>("unauthenticated");

  useEffect(() => {
    const updateCondition = () => {
      // 1. Verifica se o usuário está logado
      const loggedIn = Boolean(getStoredToken()) || isAuthenticated;
      if (!loggedIn) {
        setCondition("unauthenticated");
        return;
      }

      // 2. Verifica se possui conta de provedor (CNPJ)
      const storedCnpj = localStorage.getItem("provider_cnpj");
      const providerFlag = localStorage.getItem("is_provider");
      const isProvider = Boolean(storedCnpj || providerFlag === "true");

      if (!isProvider) {
        setCondition("no_provider");
        return;
      }

      // 3. Verifica se possui loja ativa
      const storeFlag = localStorage.getItem("has_active_store");
      const hasStore = storeFlag === "true";

      if (!hasStore) {
        setCondition("no_store");
        return;
      }

      // 4. Usuário logado com loja ativa
      setCondition("has_store");
    };

    updateCondition();

    window.addEventListener("storage", updateCondition);
    window.addEventListener("auth-change", updateCondition);

    return () => {
      window.removeEventListener("storage", updateCondition);
      window.removeEventListener("auth-change", updateCondition);
    };
  }, [isAuthenticated, isLoading]);

  switch (condition) {
    case "unauthenticated":
      return {
        title: (
          <>
            <span className="text-primary-foreground">Cadastre-se </span>
            para criar
            <br />
            <span className="text-primary-foreground">sua conta </span>
            corporativa
          </>
        ),
        buttonText: "Cadastre-se",
        href: "/register/user",
      };

    case "no_provider":
      return {
        title: (
          <>
            <span className="text-primary-foreground">Torne-se </span>
            um prestador
            <br />
            <span className="text-primary-foreground">e aumente </span>
            suas vendas
          </>
        ),
        buttonText: "Cadastrar CNPJ",
        href: "/profile",
      };

    case "no_store":
      return {
        title: (
          <>
            <span className="text-primary-foreground">Crie sua loja </span>
            e comece a
            <br />
            <span className="text-primary-foreground">receber </span>
            agendamentos
          </>
        ),
        buttonText: "Criar Loja",
        href: "/profile",
      };

    case "has_store":
      return {
        title: (
          <>
            <span className="text-primary-foreground">Acesse </span>
            o painel da
            <br />
            <span className="text-primary-foreground">sua loja </span>
            Agilis
          </>
        ),
        buttonText: "Sua Loja",
        href: "/store",
      };
  }
}
