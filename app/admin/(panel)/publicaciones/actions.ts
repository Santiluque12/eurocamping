"use server";

import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { bool, intent, postSchema, str } from "@/lib/admin/schemas";
import { readingMinutes, sanitizeRichText } from "@/lib/richtext";
import { TAGS } from "@/lib/supabase/public";

const TAGS_AFFECTED = [TAGS.posts, TAGS.media] as const;

export const savePost = adminAction(async ({ db }, id: string | null, _prev: unknown, fd: FormData) => {
  const title = str(fd, "name");
  const parsed = postSchema(title).safeParse({
    title,
    slug: str(fd, "slug"),
    category: str(fd, "category"),
    excerpt: str(fd, "excerpt"),
    cover_media_id: str(fd, "cover_media_id"),
    cover_alt: str(fd, "cover_alt"),
    body_html: str(fd, "body_html"),
    published_at: str(fd, "published_at"),
    featured: bool(fd, "featured"),
    seo_title: str(fd, "seo_title"),
    seo_description: str(fd, "seo_description"),
  });
  if (!parsed.success) {
    const errors = zodFieldErrors(parsed.error);
    // El formulario usa "name" para el título (componente NameAndSlug).
    if (errors.title) errors.name = errors.title;
    return fail("Revisá los datos de la publicación.", errors);
  }

  const act = intent(fd);
  const body = sanitizeRichText(parsed.data.body_html);
  if (act === "publish" && !body) return fail("Para publicar, escribí el texto de la publicación.", { body_html: "El texto está vacío." });

  const status = act === "publish" ? ("published" as const) : act === "draft" ? ("draft" as const) : undefined;
  const row = {
    ...parsed.data,
    body_html: body,
    reading_minutes: readingMinutes(body),
    // Sin fecha, la base usa la del momento de publicar.
    ...(parsed.data.published_at ? {} : { published_at: undefined }),
    ...(status ? { status } : {}),
  };

  if (id) {
    const { error } = await db.from("posts").update(row).eq("id", id);
    if (error) {
      const e = dbErrorMessage(error);
      return fail(e.message, e.field ? { slug: "Ya hay otra publicación con este identificador." } : undefined);
    }
    refresh(...TAGS_AFFECTED);
    return done(act === "publish" ? "Publicación publicada: ya se ve en el sitio." : act === "draft" ? "Guardada como borrador (no se ve en el sitio)." : "Cambios guardados.");
  }

  const { data, error } = await db.from("posts").insert({ ...row, status: status ?? "draft" }).select("id").single();
  if (error) {
    const e = dbErrorMessage(error);
    return fail(e.message, e.field ? { slug: "Ya hay otra publicación con este identificador." } : undefined);
  }
  refresh(...TAGS_AFFECTED);
  return done(act === "publish" ? "Publicación publicada." : "Guardada como borrador.", { id: data.id });
});

export const setPostStatus = adminAction(async ({ db }, id: string, status: "draft" | "published" | "archived") => {
  if (status === "published") {
    const { data } = await db.from("posts").select("body_html").eq("id", id).maybeSingle();
    if (!data?.body_html) return fail("No se puede publicar una publicación sin texto.");
  }
  const { error } = await db.from("posts").update({ status, ...(status === "archived" ? { featured: false } : {}) }).eq("id", id);
  if (error) return fail(dbErrorMessage(error).message);
  refresh(...TAGS_AFFECTED);
  return done(status === "archived" ? "Publicación archivada: ya no aparece en el sitio." : status === "published" ? "Publicación publicada." : "Publicación pasada a borrador.");
});
