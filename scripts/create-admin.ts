/**
 * Alta segura de un administrador.
 *
 *   npm run admin:create -- --email persona@eurocamping.com.ar --name "Nombre Apellido"
 *
 * - Si el usuario no existe en Supabase Auth, lo crea con una contraseña
 *   temporal aleatoria (se muestra una sola vez) y el email confirmado.
 * - Lo agrega a public.admin_users (la lista de personas autorizadas).
 * - Con --disable lo desactiva sin borrar su historial.
 *
 * Usa SUPABASE_SERVICE_ROLE_KEY: correlo sólo desde una computadora de confianza.
 */
import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";

// ENV_FILE permite apuntar a otro proyecto (p. ej. ENV_FILE=.env.supabase-prod).
config({ path: process.env.ENV_FILE ?? ".env.local" });

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = arg("email")?.trim().toLowerCase();
  const name = arg("name") ?? null;
  const role = arg("role") === "editor" ? "editor" : "admin";
  const disable = process.argv.includes("--disable");
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error('Uso: npm run admin:create -- --email persona@dominio.com [--name "Nombre"] [--disable]');
    process.exit(1);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  const db = createClient<Database>(url, key, { auth: { persistSession: false } });

  // Buscar el usuario (paginado).
  let userId: string | undefined;
  for (let page = 1; !userId; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (data.users.length < 200) break;
  }

  if (disable) {
    if (!userId) throw new Error("No existe un usuario con ese email.");
    const { error } = await db.from("admin_users").update({ active: false }).eq("user_id", userId);
    if (error) throw error;
    console.log(`✓ ${email} ya no puede administrar el sitio.`);
    return;
  }

  let tempPassword: string | null = null;
  if (!userId) {
    tempPassword = randomBytes(12).toString("base64url");
    const { data, error } = await db.auth.admin.createUser({ email, password: tempPassword, email_confirm: true });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error } = await db.from("admin_users")
    .upsert({ user_id: userId, email, full_name: name, role, active: true }, { onConflict: "user_id" });
  if (error) throw error;

  console.log(`✓ ${email} puede administrar el sitio (${role}).`);
  if (tempPassword) {
    console.log(`\n  Contraseña temporal: ${tempPassword}`);
    console.log("  Compartila por un canal seguro y pedí que la cambie con “¿Olvidaste tu contraseña?”.\n");
  }
}

main().catch((e) => {
  console.error("✗", e.message ?? e);
  process.exit(1);
});
