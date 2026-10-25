"use server";

import { z } from "zod";
import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { all, bool, intent, PERIODS, rateSchema, sectionSchema, str } from "@/lib/admin/schemas";
import { TAGS } from "@/lib/supabase/public";

const TAGS_AFFECTED = [TAGS.rental] as const;

const amount = z
  .string()
  .trim()
  .transform((v) => v.replace(/\./g, "").replace(",", "."))
  .refine((v) => v === "" || (/^\d+(\.\d{1,2})?$/.test(v) && Number(v) < 1e10), "Ingresá sólo números, sin $ ni puntos.")
  .transform((v) => (v === "" ? null : Number(v)));

// ─── Filas del tarifario ────────────────────────────────────────────────────
export const saveRate = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const parsed = rateSchema.safeParse({
    section_id: str(fd, "section_id"),
    group_name: str(fd, "group_name"),
    name: str(fd, "name"),
    product_id: str(fd, "product_id"),
    sort_order: str(fd, "sort_order") || 0,
  });
  if (!parsed.success) return fail("Revisá los datos de la fila.", zodFieldErrors(parsed.error));

  const { data: section } = await db.from("rental_sections").select("periods").eq("id", parsed.data.section_id).maybeSingle();
  if (!section) return fail("La sección elegida no existe.", { section_id: "Elegí una sección." });

  // Sólo se guardan los importes de las columnas que tiene la sección.
  const errors: Record<string, string> = {};
  const prices: { period: (typeof PERIODS)[number]; amount: number }[] = [];
  for (const period of section.periods) {
    const r = amount.safeParse(str(fd, `price_${period}`));
    if (!r.success) errors[`price_${period}`] = r.error.issues[0].message;
    else if (r.data !== null) prices.push({ period, amount: r.data });
  }
  if (Object.keys(errors).length) return fail("Revisá los importes.", errors);
  const currency = str(fd, "currency") === "USD" ? "USD" : "ARS";

  const act = intent(fd);
  const status = act === "publish" ? ("published" as const) : act === "draft" ? ("draft" as const) : undefined;

  let rateId = id;
  if (id) {
    const { error } = await db.from("rental_rates").update({ ...parsed.data, ...(status ? { status } : {}) }).eq("id", id);
    if (error) return fail(dbErrorMessage(error).message);
  } else {
    const { data, error } = await db.from("rental_rates").insert({ ...parsed.data, status: status ?? "draft" }).select("id").single();
    if (error) return fail(dbErrorMessage(error).message);
    rateId = data.id;
  }

  const del = await db.from("rental_rate_prices").delete().eq("rate_id", rateId!);
  if (del.error) return fail("Se guardó la fila, pero no pudimos actualizar los precios.");
  if (prices.length) {
    const { error } = await db.from("rental_rate_prices").insert(prices.map((p) => ({ rate_id: rateId!, currency, ...p })));
    if (error) return fail("Se guardó la fila, pero no pudimos guardar los precios.");
  }

  refresh(...TAGS_AFFECTED);
  const msg = act === "publish" ? "Fila publicada: ya se ve en el tarifario." : act === "draft" ? "Guardada como borrador (no se ve en el sitio)." : "Cambios guardados.";
  return done(msg, id ? {} : { id: rateId! });
});

export const setRateStatus = adminAction(async ({ db }, id: string, status: "draft" | "published" | "archived") => {
  const { error } = await db.from("rental_rates").update({ status }).eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done(status === "archived" ? "Fila archivada: ya no aparece en el tarifario." : status === "published" ? "Fila publicada." : "Fila pasada a borrador.");
});

// ─── Secciones ──────────────────────────────────────────────────────────────
export const saveSection = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const title = str(fd, "title");
  const parsed = sectionSchema(title).safeParse({
    slug: str(fd, "slug"),
    title,
    title_accent: str(fd, "title_accent"),
    nav_label: str(fd, "nav_label") || title,
    icon: str(fd, "icon"),
    description: str(fd, "description"),
    periods: all(fd, "periods"),
    footnote: str(fd, "footnote"),
    show_resorts: bool(fd, "show_resorts"),
    sort_order: str(fd, "sort_order") || 0,
    is_visible: bool(fd, "is_visible"),
  });
  if (!parsed.success) return fail("Revisá los datos de la sección.", zodFieldErrors(parsed.error));
  const row = { ...parsed.data, periods: PERIODS.filter((p) => parsed.data.periods.includes(p)) };

  if (id) {
    const { error } = await db.from("rental_sections").update(row).eq("id", id);
    if (error) {
      const e = dbErrorMessage(error);
      return fail(e.message, error.code === "23505" ? { slug: "Ya hay otra sección con este identificador." } : undefined);
    }
    refresh(...TAGS_AFFECTED);
    return done("Cambios guardados.");
  }
  const { data, error } = await db.from("rental_sections").insert(row).select("id").single();
  if (error) {
    const e = dbErrorMessage(error);
    return fail(e.message, error.code === "23505" ? { slug: "Ya hay otra sección con este identificador." } : undefined);
  }
  refresh(...TAGS_AFFECTED);
  return done("Sección creada.", { id: data.id });
});

export const deleteSection = adminAction(async ({ db }, id: string) => {
  const { count } = await db.from("rental_rates").select("id", { count: "exact", head: true }).eq("section_id", id);
  if (count) return fail(`No se puede eliminar: la sección tiene ${count} fila(s). Movelas a otra sección o ocultá la sección.`);
  const { error } = await db.from("rental_sections").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done("Sección eliminada.");
});
