import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { sessionDb } from "@/lib/supabase/server";

export type AdminSession = {
  db: Awaited<ReturnType<typeof sessionDb>>;
  userId: string;
  email: string;
  name: string | null;
  role: "admin" | "editor";
};

/**
 * Devuelve la sesión si el usuario está autenticado (JWT validado contra Auth)
 * y figura como administrador activo. Si no, null.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const db = await sessionDb();
  const { data: auth, error } = await db.auth.getUser();
  if (error || !auth.user) return null;
  const { data: admin } = await db
    .from("admin_users")
    .select("email, full_name, role, active")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!admin?.active) return null;
  return {
    db,
    userId: auth.user.id,
    email: admin.email,
    name: admin.full_name,
    role: admin.role as AdminSession["role"],
  };
});

/** Para páginas del panel: redirige al login si no hay permiso. */
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    const db = await sessionDb();
    const { data } = await db.auth.getUser();
    // Autenticado pero sin permiso: se cierra la sesión para no dejarla abierta.
    if (data.user) {
      await db.auth.signOut();
      redirect("/admin/login?error=sin-permiso");
    }
    redirect("/admin/login");
  }
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("No tenés permiso para realizar esta acción. Volvé a iniciar sesión.");
    this.name = "UnauthorizedError";
  }
}

/** Para Server Actions: lanza si no hay permiso. */
export async function requireAdminAction(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
