import "server-only";
import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import type { CacheTag } from "@/lib/supabase/public";
import { requireAdminAction, UnauthorizedError, type AdminSession } from "./auth";

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  /** id del registro creado (para redirigir al editor). */
  id?: string;
  /** cambia en cada envío exitoso, para que el formulario sepa que guardó. */
  savedAt?: number;
};

export const initialState: ActionState = { ok: false, message: "" };

export function fail(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { ok: false, message, fieldErrors };
}

export function done(message: string, extra?: Partial<ActionState>): ActionState {
  return { ok: true, message, savedAt: Date.now(), ...extra };
}

/** Traduce errores de Postgres a mensajes comprensibles. */
export function dbErrorMessage(error: { code?: string; message?: string; details?: string }) {
  const msg = error.message ?? "";
  if (error.code === "23505") return { field: guessField(msg + (error.details ?? "")), message: "Ya existe otro registro con ese valor. Elegí uno distinto." };
  if (error.code === "23503") return { message: "No se puede completar: este registro está siendo usado por otro contenido." };
  if (msg.startsWith("CATALOG_IN_USE")) return { message: `No se puede archivar: lo usan ${msg.split(":")[1]} producto(s) publicado(s). Cambialos primero.` };
  if (msg.startsWith("MEDIA_IN_USE")) return { message: "La imagen se está usando en la configuración del sitio." };
  if (error.code === "23514" || error.code === "22P02") return { message: "Algún dato no tiene el formato correcto. Revisá los campos." };
  if (error.code === "42501") return { message: "No tenés permiso para realizar esta acción." };
  return { message: "No pudimos guardar los cambios. Probá de nuevo en unos minutos." };
}

function guessField(text: string) {
  if (/slug/.test(text)) return "slug";
  if (/name|lower/.test(text)) return "name";
  if (/key/.test(text)) return "key";
  return undefined;
}

export function zodFieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    out[key] ??= issue.message;
  }
  return out;
}

/** Invalida la caché del sitio público para que se vean los cambios. */
export function refresh(...tags: CacheTag[]) {
  for (const t of new Set(tags)) updateTag(t);
}

/**
 * Envuelve una Server Action: verifica sesión y permiso SIEMPRE, y convierte
 * excepciones en un estado de error para el formulario.
 */
export function adminAction<Args extends unknown[]>(
  fn: (session: AdminSession, ...args: Args) => Promise<ActionState>
) {
  return async (...args: Args): Promise<ActionState> => {
    try {
      const session = await requireAdminAction();
      return await fn(session, ...args);
    } catch (e) {
      // redirect()/notFound() de Next se propagan.
      unstable_rethrow(e);
      if (e instanceof UnauthorizedError) return fail(e.message);
      console.error("[admin action]", e);
      return fail("Ocurrió un error inesperado. Probá de nuevo.");
    }
  };
}
