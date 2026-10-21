"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { saveStoredSession, type StoredUserProfile } from "@/lib/auth/token-storage";
import { Loader2 } from "lucide-react";

/**
 * Página chamada APÓS o Route Handler /auth/callback/route.ts trocar o código
 * pelo token no servidor. Aqui a sessão já está nos cookies, então o
 * createBrowserClient consegue lê-la normalmente.
 *
 * Responsabilidades:
 * 1. Sincronizar a sessão do Supabase nos storages do cliente.
 * 2. Verificar se o perfil do usuário já existe no backend.
 * 3. Redirecionar para complete-profile (1º acesso via Google) ou para a
 *    rota de destino.
 */
function CallbackCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function finishAuth() {
      try {
        // Pequena espera para garantir que os cookies do servidor já foram
        // propagados para o browser client
        await new Promise((res) => setTimeout(res, 300));

        const { data } = await supabase.auth.getSession();
        let session = data.session;

        if (!session) {
          // Retry com espera maior caso os cookies ainda não tenham chegado
          await new Promise((res) => setTimeout(res, 700));
          const retry = await supabase.auth.getSession();
          session = retry.data.session;
          if (!session) {
            throw new Error("Sessão não encontrada após autenticação. Tente novamente.");
          }
        }

        const currentUser = session.user;
        const initialProfile: StoredUserProfile = {
          id: currentUser.id,
          name:
            (currentUser.user_metadata?.name as string | undefined) ??
            (currentUser.user_metadata?.full_name as string | undefined) ??
            currentUser.email?.split("@")[0] ??
            "Usuário",
          email: currentUser.email ?? "",
          phone: (currentUser.user_metadata?.phone as string | undefined) ?? null,
          cpf: (currentUser.user_metadata?.cpf as string | undefined) ?? null,
          avatarUrl:
            (currentUser.user_metadata?.avatar_url as string | undefined) ?? null,
          role: (currentUser.user_metadata?.role as string | undefined) ?? "Cliente",
          createdAt: currentUser.created_at,
        };

        // Sincroniza sessão nos storages client-side (localStorage + cookies)
        saveStoredSession(session.access_token, initialProfile);

        const redirectUrl = searchParams.get("redirect") ?? "/home";
        const hasCpf = Boolean(currentUser.user_metadata?.cpf);

        // Verifica se o perfil já existe no backend
        try {
          const apiProfile = await api<Partial<StoredUserProfile>>("/api/v1/users/me");
          if (!active) return;
          if (apiProfile) {
            saveStoredSession(session.access_token, {
              ...initialProfile,
              ...apiProfile,
            });
          }
          router.replace(redirectUrl);
        } catch {
          if (!active) return;
          if (!hasCpf) {
            // Primeiro acesso via Google: solicitar CPF e telefone
            router.replace(
              `/auth/complete-profile${
                redirectUrl !== "/home"
                  ? `?redirect=${encodeURIComponent(redirectUrl)}`
                  : ""
              }`
            );
          } else {
            router.replace(redirectUrl);
          }
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

    void finishAuth();

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
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
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

export default function CallbackCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green-primary" />
        </div>
      }
    >
      <CallbackCompleteInner />
    </Suspense>
  );
}
