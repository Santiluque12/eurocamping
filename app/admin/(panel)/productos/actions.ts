"use server";

import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { all, bool, gallerySchema, intent, json, PRODUCT_UNITS, priceSchema, productSchema, str } from "@/lib/admin/schemas";
import { TAGS } from "@/lib/supabase/public";

const TAGS_AFFECTED = [TAGS.products, TAGS.rental, TAGS.media] as const;

export const saveProduct = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const name = str(fd, "name");
  const base = productSchema(name).safeParse({
    name,
    slug: str(fd, "slug"),
    type: str(fd, "type"),
    description: str(fd, "description"),
    spec_line: str(fd, "spec_line"),
    category_id: str(fd, "category_id"),
    brand_id: str(fd, "brand_id"),
    main_image_id: str(fd, "main_image_id"),
    main_image_alt: str(fd, "main_image_alt"),
    availability: str(fd, "availability") || "consult",
    tags: json<string[]>(fd, "tags", []),
    external_url: str(fd, "external_url"),
    external_label: str(fd, "external_label"),
    whatsapp_message: str(fd, "whatsapp_message"),
    featured: bool(fd, "featured"),
    sort_order: str(fd, "sort_order") || 0,
  });
  const price = priceSchema(PRODUCT_UNITS).safeParse({
    price_mode: str(fd, "price_mode") || "consult",
    price_amount: str(fd, "price_amount"),
    currency: str(fd, "currency") || "ARS",
    price_unit: str(fd, "price_unit"),
  });
  const gallery = gallerySchema.safeParse(json(fd, "gallery", []));
  const activityIds = all(fd, "activity_ids");

  const errors = {
    ...(base.success ? {} : zodFieldErrors(base.error)),
    ...(price.success ? {} : zodFieldErrors(price.error)),
    ...(gallery.success ? {} : { gallery: gallery.error.issues[0]?.message ?? "Galería inválida." }),
  };
  if (!base.success || !price.success || !gallery.success) return fail("Revisá los datos del producto.", errors);

  const act = intent(fd);
  const status = act === "publish" ? ("published" as const) : act === "draft" ? ("draft" as const) : undefined;
  const row = { ...base.data, ...price.data, ...(status ? { status } : {}) };

  let productId = id;
  if (id) {
    const { error } = await db.from("products").update(row).eq("id", id);
    if (error) {
      const e = dbErrorMessage(error);
      return fail(e.message, e.field ? { [e.field === "name" ? "slug" : e.field]: "Ya hay otro producto con este identificador." } : undefined);
    }
  } else {
    const { data, error } = await db.from("products").insert({ ...row, status: status ?? "draft" }).select("id").single();
    if (error) {
      const e = dbErrorMessage(error);
      return fail(e.message, e.field ? { slug: "Ya hay otro producto con este identificador." } : undefined);
    }
    productId = data.id;
  }

  // Galería y actividades: se reemplazan por lo que hay en el formulario.
  const pid = productId!;
  const del = await Promise.all([
    db.from("product_images").delete().eq("product_id", pid),
    db.from("product_activities").delete().eq("product_id", pid),
  ]);
  if (del.some((r) => r.error)) return fail("Se guardó el producto, pero no pudimos actualizar la galería o las actividades.");
  if (gallery.data.length) {
    const { error } = await db
      .from("product_images")
      .insert(gallery.data.map((g, i) => ({ product_id: pid, media_id: g.media_id, alt: g.alt || null, sort_order: i })));
    if (error) return fail("Se guardó el producto, pero no pudimos guardar la galería.");
  }
  if (activityIds.length) {
    const { error } = await db.from("product_activities").insert(activityIds.map((a) => ({ product_id: pid, activity_id: a })));
    if (error) return fail("Se guardó el producto, pero no pudimos guardar las actividades.");
  }

  refresh(...TAGS_AFFECTED);
  const msg = act === "publish" ? "Producto publicado: ya se ve en el sitio." : act === "draft" ? "Guardado como borrador (no se ve en el sitio)." : "Cambios guardados.";
  return done(msg, id ? {} : { id: pid });
});

export const setProductStatus = adminAction(async ({ db }, id: string, status: "draft" | "published" | "archived") => {
  const { error } = await db.from("products").update({ status, ...(status === "archived" ? { featured: false } : {}) }).eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done(status === "archived" ? "Producto archivado: ya no aparece en el sitio." : status === "published" ? "Producto publicado." : "Producto pasado a borrador.");
});
