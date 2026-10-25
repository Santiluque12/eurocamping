import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refresca la sesión de Supabase y hace un control optimista: sin sesión no se
 * entra a /admin. La autorización real (¿es administrador?) se verifica en el
 * layout del panel, en cada Server Action y en la base con RLS.
 */
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/recuperar"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims valida el JWT; no confiar en getSession() del lado del servidor.
  const { data } = await supabase.auth.getClaims();
  const signedIn = !!data?.claims?.sub;
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
