import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseEnv } from "./env";

/**
 * Etiquetas de caché. Cada lectura pública queda guardada en la Data Cache de
 * Next con estas etiquetas; las acciones del administrador las invalidan con
 * updateTag() para que el sitio muestre los cambios al instante.
 */
export const TAGS = {
  products: "products",
  rental: "rental",
  posts: "posts",
  branches: "branches",
  workshop: "workshop",
  catalogs: "catalogs",
  settings: "settings",
  media: "media",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

/** Revalidación de seguridad por tiempo, además de la invalidación por tags. */
const FALLBACK_REVALIDATE_SECONDS = 3600;

/**
 * Cliente de sólo lectura con la clave anónima: Row Level Security garantiza
 * que únicamente devuelve contenido publicado. No usa cookies, por eso un
 * administrador logueado tampoco ve borradores en la web pública.
 */
export function publicDb(tags: CacheTag[]) {
  const { url, anonKey } = supabaseEnv();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "force-cache",
          next: { tags, revalidate: FALLBACK_REVALIDATE_SECONDS },
        }),
    },
  });
}
