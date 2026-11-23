import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client do Supabase para uso em Server Components, Server Actions e Route Handlers.
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_PROJECT_URL ??
    "https://placeholder.supabase.co";

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });
}
