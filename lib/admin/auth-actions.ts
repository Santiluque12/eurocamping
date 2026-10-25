"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sessionDb } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/env";
import { fail, type ActionState } from "./action";

function safeNext(next: string | null | undefined) {
  return next && /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin";
}

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = z
    .object({ email: z.email("Ingresá un email válido."), password: z.string().min(1, "Ingresá tu contraseña.") })
    .safeParse({ email: String(fd.get("email") ?? "").trim(), password: String(fd.get("password") ?? "") });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => (errors[String(i.path[0])] ??= i.message));
    return fail("Revisá los datos ingresados.", errors);
  }
  const db = await sessionDb();
  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return fail("Email o contraseña incorrectos.");

  const { data: admin } = await db.from("admin_users").select("active").eq("user_id", data.user.id).maybeSingle();
  if (!admin?.active) {
    await db.auth.signOut();
    return fail("Esta cuenta no tiene permiso para administrar el sitio.");
  }
  redirect(safeNext(String(fd.get("next") ?? "")));
}

export async function requestPasswordReset(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = String(fd.get("email") ?? "").trim();
  if (!z.email().safeParse(email).success) return fail("Ingresá un email válido.", { email: "Ingresá un email válido." });
  const db = await sessionDb();
  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/confirm?next=/admin/nueva-clave`,
  });
  if (error && error.status === 429) return fail("Hiciste varios pedidos seguidos. Esperá unos minutos y probá de nuevo.");
  // Mismo mensaje exista o no la cuenta, para no revelar qué emails están registrados.
  return { ok: true, message: "Si el email corresponde a una cuenta, te enviamos un enlace para crear una nueva contraseña. Revisá tu correo (y la carpeta de spam).", savedAt: Date.now() };
}

export async function updatePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (password.length < 10) return fail("La contraseña es muy corta.", { password: "Usá al menos 10 caracteres." });
  if (password !== confirm) return fail("Las contraseñas no coinciden.", { confirm: "Repetí exactamente la misma contraseña." });
  const db = await sessionDb();
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail("El enlace venció. Pedí uno nuevo desde “¿Olvidaste tu contraseña?”.");
  const { error } = await db.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") return fail("La nueva contraseña tiene que ser distinta de la anterior.", { password: "Elegí una contraseña distinta." });
    if (error.code === "weak_password") return fail("La contraseña es demasiado débil.", { password: "Combiná letras, números y símbolos." });
    return fail("No pudimos cambiar la contraseña. Probá de nuevo.");
  }
  redirect("/admin?clave=actualizada");
}

export async function signOut() {
  const db = await sessionDb();
  await db.auth.signOut();
  redirect("/admin/login?sesion=cerrada");
}
