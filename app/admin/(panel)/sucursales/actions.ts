"use server";

import { z } from "zod";
import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { bool, branchSchema, json, str } from "@/lib/admin/schemas";
import { TAGS } from "@/lib/supabase/public";

export const saveBranch = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const parsed = branchSchema.safeParse({
    name: str(fd, "name"),
    city: str(fd, "city"),
    region: str(fd, "region"),
    address: str(fd, "address"),
    phones: json<string[]>(fd, "phones", []),
    whatsapp: str(fd, "whatsapp"),
    hours: str(fd, "hours"),
    maps_url: str(fd, "maps_url"),
    offers_rental: bool(fd, "offers_rental"),
    services: json<string[]>(fd, "services", []),
    season_label: str(fd, "season_label"),
    notes: str(fd, "notes"),
    sort_order: str(fd, "sort_order") || 0,
    is_visible: bool(fd, "is_visible"),
  });
  if (!parsed.success) return fail("Revisá los datos de la sucursal.", zodFieldErrors(parsed.error));

  if (id) {
    const { error } = await db.from("branches").update(parsed.data).eq("id", id);
    if (error) return fail(dbErrorMessage(error).message);
    refresh(TAGS.branches);
    return done("Cambios guardados.");
  }
  const { data, error } = await db.from("branches").insert(parsed.data).select("id").single();
  if (error) return fail(dbErrorMessage(error).message);
  refresh(TAGS.branches);
  return done("Sucursal creada.", { id: data.id });
});

export const deleteBranch = adminAction(async ({ db }, id: string) => {
  if (!z.uuid().safeParse(id).success) return fail("Sucursal inválida.");
  const { error } = await db.from("branches").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(TAGS.branches);
  return done("Sucursal eliminada.");
});
