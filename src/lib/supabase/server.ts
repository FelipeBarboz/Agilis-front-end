import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client do Supabase para uso em Server Components, Server Actions e Route Handlers.
// Se o projeto já tiver um helper equivalente (ex: lib/supabase/server.ts),
// use o existente e ignore este arquivo.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // "setAll" foi chamado a partir de um Server Component.
            // Pode ser ignorado se houver um middleware renovando a sessão.
          }
        },
      },
    }
  );
}
