"use server";

import { z } from "zod";
import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { bool, json, priceSchema, str, WORKSHOP_UNITS, workshopSchema } from "@/lib/admin/schemas";
import { TAGS } from "@/lib/supabase/public";
import type { TablesInsert } from "@/lib/supabase/database.types";

const TAGS_AFFECTED = [TAGS.workshop, TAGS.media] as const;

export const saveWorkshopService = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const base = workshopSchema.safeParse({
    kind: str(fd, "kind"),
    season: str(fd, "season"),
    name: str(fd, "name"),
    description: str(fd, "description"),
    icon: str(fd, "icon"),
    image_media_id: str(fd, "image_media_id"),
    items: json<string[]>(fd, "items", []),
    whatsapp_message: str(fd, "whatsapp_message"),
    sort_order: str(fd, "sort_order") || 0,
    is_visible: bool(fd, "is_visible"),
  });
  const price = priceSchema(WORKSHOP_UNITS).safeParse({
    price_mode: str(fd, "price_mode") || "consult",
    price_amount: str(fd, "price_amount"),
    currency: str(fd, "currency") || "ARS",
    price_unit: str(fd, "price_unit"),
  });
  if (!base.success || !price.success) {
    return fail("Revisá los datos del servicio.", {
      ...(base.success ? {} : zodFieldErrors(base.error)),
      ...(price.success ? {} : zodFieldErrors(price.error)),
    });
  }
  // Las filas del tarifario no tienen ícono, imagen ni lista de trabajos.
  const row: TablesInsert<"workshop_services"> =
    base.data.kind === "rate"
      ? { ...base.data, ...price.data, icon: null, image_media_id: null, items: [], description: null }
      : { ...base.data, ...price.data, season: null };

  if (id) {
    const { error } = await db.from("workshop_services").update(row).eq("id", id);
    if (error) return fail(dbErrorMessage(error).message);
    refresh(...TAGS_AFFECTED);
    return done("Cambios guardados.");
  }
  const { data, error } = await db.from("workshop_services").insert(row).select("id").single();
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done("Servicio creado.", { id: data.id });
});

export const deleteWorkshopService = adminAction(async ({ db }, id: string) => {
  if (!z.uuid().safeParse(id).success) return fail("Servicio inválido.");
  const { error } = await db.from("workshop_services").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done("Servicio eliminado.");
});
