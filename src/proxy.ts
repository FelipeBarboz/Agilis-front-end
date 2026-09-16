import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "sb-access-token";

// Rotas que exigem autenticação
const PROTECTED_ROUTES = [
  "/schedule",
  "/payment",
  "/history",
  "/profile",
  "/chats",
  "/addresses",
  "/profile/settings",
  "/profile/edit",
  "/favorites",
  "/store",
  "/store/store-profile",
  "/store/employees",
  "/store/store-positions",
  "/store/store-settings",
  "/provider",
  "/register/provider",
  "/create-store",
  "/store/store-scheduling",
  "/reschedule",
  "/refund-confirmation",
  "/cancelled",
  "/delay-resolution",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => {
    // Casamento exato ou sub-rotas (ex: /profile/settings ou /chats/123)
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (isProtectedRoute(pathname)) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    requestHeaders.set("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "mock-anon-key");
    requestHeaders.set("x-supabase-auth", "simulated-session");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, imagens públicas (svg, png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
