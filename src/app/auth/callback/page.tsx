"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[Auth Callback] Erro na troca de código:", exchangeError);
          }
        }

        // Obtém a sessão atual
        const { data } = await supabase.auth.getSession();
        let session = data.session;
        if (!session) {
          // Pequena espera caso a sessão esteja sincronizando do hash
          await new Promise((res) => setTimeout(res, 500));
          const retry = await supabase.auth.getSession();
          session = retry.data.session;
          if (!session) {
            throw new Error("Sessão não encontrada após autenticação.");
          }
        }

        const redirectUrl = searchParams.get("redirect") ?? "/home";

        const currentUser = session.user;
        const hasCpf = Boolean(currentUser.user_metadata?.cpf);

        // Verifica se o perfil já existe na API
        try {
          await api("/api/v1/users/me");
          if (!active) return;
          router.replace(redirectUrl);
          return;
        } catch {
          if (!active) return;
          if (!hasCpf) {
            // Primeiro acesso via Google: precisa completar cadastro (CPF e telefone)
            router.replace(
              `/auth/complete-profile${
                redirectUrl !== "/home"
                  ? `?redirect=${encodeURIComponent(redirectUrl)}`
                  : ""
              }`
            );
            return;
          }
          // Usuário já possui dados mínimos, segue autenticado via Supabase
          router.replace(redirectUrl);
          return;
        }
      } catch (err: unknown) {
        if (!active) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao finalizar autenticação.";
        setErrorMessage(msg);
      }
    }

    void handleAuth();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-2 text-lg font-bold text-destructive">
          Falha na autenticação
        </h2>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Voltar para o login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <Loader2 className="h-9 w-9 animate-spin text-brand-green-primary" />
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">
          Autenticando sua conta...
        </h2>
        <p className="text-xs text-muted-foreground">
          Por favor, aguarde enquanto preparamos o seu acesso.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green-primary" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
