"use server";

import { z } from "zod";
import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors, type ActionState } from "./action";
import type { AdminSession } from "./auth";
import { activitySchema, bool, brandSchema, categorySchema, str } from "./schemas";
import { TAGS } from "@/lib/supabase/public";

// Marcas, categorías y actividades se muestran junto a los productos.
const TAGS_AFFECTED = [TAGS.catalogs, TAGS.products, TAGS.rental, TAGS.media] as const;

type CatalogTable = "brands" | "categories" | "activities";

const LABELS: Record<CatalogTable, { one: string; created: string; dup: string }> = {
  brands: { one: "la marca", created: "Marca creada.", dup: "Ya existe una marca con ese nombre o identificador." },
  categories: { one: "la categoría", created: "Categoría creada.", dup: "Ya existe una categoría con ese nombre o identificador." },
  activities: { one: "la actividad", created: "Actividad creada.", dup: "Ya existe una actividad con ese nombre o identificador." },
};

async function save(
  db: AdminSession["db"],
  table: CatalogTable,
  id: string | null,
  row: Record<string, unknown>
): Promise<ActionState> {
  const query = id
    ? db.from(table).update(row as never).eq("id", id).select("id").single()
    : db.from(table).insert(row as never).select("id").single();
  const { data, error } = await query;
  if (error) {
    const e = dbErrorMessage(error);
    if (error.code === "23505") {
      const field = e.field === "slug" ? "slug" : "name";
      return fail(LABELS[table].dup, { [field]: LABELS[table].dup });
    }
    return fail(e.message);
  }
  refresh(...TAGS_AFFECTED);
  return id ? done("Cambios guardados.") : done(LABELS[table].created, { id: data.id });
}

export const saveBrand = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const name = str(fd, "name");
  const parsed = brandSchema(name).safeParse({
    name,
    slug: str(fd, "slug"),
    website_url: str(fd, "website_url"),
    logo_media_id: str(fd, "logo_media_id"),
    show_on_site: bool(fd, "show_on_site"),
    sort_order: str(fd, "sort_order") || 0,
  });
  if (!parsed.success) return fail("Revisá los datos de la marca.", zodFieldErrors(parsed.error));
  return save(db, "brands", id, parsed.data);
});

export const saveCategory = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const name = str(fd, "name");
  const parsed = categorySchema(name).safeParse({
    name,
    slug: str(fd, "slug"),
    description: str(fd, "description"),
    sort_order: str(fd, "sort_order") || 0,
  });
  if (!parsed.success) return fail("Revisá los datos de la categoría.", zodFieldErrors(parsed.error));
  return save(db, "categories", id, parsed.data);
});

export const saveActivity = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const name = str(fd, "name");
  const parsed = activitySchema(name).safeParse({
    name,
    slug: str(fd, "slug"),
    emoji: str(fd, "emoji"),
    link_href: str(fd, "link_href"),
    show_in_home: bool(fd, "show_in_home"),
    sort_order: str(fd, "sort_order") || 0,
  });
  if (!parsed.success) return fail("Revisá los datos de la actividad.", zodFieldErrors(parsed.error));
  return save(db, "activities", id, parsed.data);
});

/**
 * Archiva o restaura. La base impide archivar algo que todavía usan productos
 * publicados (trigger tg_guard_catalog_archive), así no quedan referencias rotas.
 */
export const setCatalogArchived = adminAction(async ({ db }, table: CatalogTable, id: string, archived: boolean) => {
  if (!(table in LABELS) || !z.uuid().safeParse(id).success) return fail("Datos inválidos.");
  const { error } = await db
    .from(table)
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done(archived ? `Archivaste ${LABELS[table].one}: ya no se ofrece en los formularios ni en el sitio.` : `Restauraste ${LABELS[table].one}.`);
});
