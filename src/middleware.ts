import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isAuthRoute = request.nextUrl.pathname === "/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/estoques") ||
    request.nextUrl.pathname.startsWith("/produtos") ||
    request.nextUrl.pathname.startsWith("/usuarios");
  const isUserRoute = request.nextUrl.pathname.startsWith("/meu-estoque") ||
    request.nextUrl.pathname.startsWith("/retirada");

  // Redirect to login if not authenticated and trying to access protected route
  if (!session && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to login if authenticated and trying to access login
  if (session && isAuthRoute) {
    const redirectPath = session.user?.role === "ADMIN" ? "/dashboard" : "/meu-estoque";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role-based access control
  if (session && isAdminRoute && session.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/meu-estoque", request.url));
  }

  if (session && isUserRoute && session.user?.role !== "USER") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
