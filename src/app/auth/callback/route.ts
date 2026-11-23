import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Route Handler para o callback OAuth do Supabase.
 *
 * O Supabase usa o fluxo PKCE: o "code_verifier" é armazenado em cookies
 * no servidor durante o redirect para o Google. Quando o Google retorna com
 * o "code", este handler roda no servidor e troca o código pela sessão com
 * acesso total aos cookies — resolvendo o erro AuthPKCECodeVerifierMissingError
 * que ocorre quando essa troca é feita no client-side.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const redirectPath = searchParams.get("redirect") ?? "/home";

  // OAuth retornou um erro vindo do provider
  if (error) {
    const params = new URLSearchParams({
      error: errorDescription ?? error,
    });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[Auth Callback Route] Erro ao trocar código:", exchangeError.message);
      const params = new URLSearchParams({ error: exchangeError.message });
      return NextResponse.redirect(`${origin}/login?${params.toString()}`);
    }

    // Sucesso: redireciona para a página de destino (passando o redirect para a
    // page.tsx finalizar o fluxo de perfil/cadastro Google)
    const destination = new URL(`${origin}/auth/callback/complete`);
    destination.searchParams.set("redirect", redirectPath);

    return NextResponse.redirect(destination);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro inesperado na autenticação.";
    console.error("[Auth Callback Route] Exceção:", msg);
    const params = new URLSearchParams({ error: msg });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }
}
