import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ CORS: permitir requisições da extensão Chrome nas rotas de API
  if (pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }
    const res = NextResponse.next();
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // ✅ IMPORTANTE: Rotas da API do Better Auth (não verificar sessão)
  const authApiRoutes = [
    "/api/auth", // Todas as rotas de auth
  ];
  const isAuthApiRoute = authApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Busca sessão para outras rotas
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Se for rota pública, permite acesso
  if (isPublicRoute) {
    // Se tiver sessão e tentar acessar sign-in/sign-up, redireciona para contacts
    if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
      return NextResponse.redirect(new URL("/contacts", request.url));
    }
    return NextResponse.next();
  }

  // Se não houver sessão, redireciona para login
  if (!session) {
    // Salva URL de retorno para redirecionar após login
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se for a raiz e tiver sessão, redireciona para contacts
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/contacts", request.url));
  }

  // Para outras rotas autenticadas, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
