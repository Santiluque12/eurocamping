import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { sessionDb } from "@/lib/supabase/server";

/**
 * Destino de los enlaces que manda Supabase Auth por email (recuperación de
 * contraseña). Acepta el flujo PKCE (?code=) y el de token (?token_hash=&type=).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = searchParams.get("next") ?? "/admin";
  const safeNext = /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin";
  const db = await sessionDb();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    ok = !(await db.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await db.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }
  return NextResponse.redirect(new URL(ok ? safeNext : "/admin/login?error=enlace", origin));
}
