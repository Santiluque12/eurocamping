"use server";

import { adminAction, dbErrorMessage, done, fail, refresh, zodFieldErrors } from "@/lib/admin/action";
import { json } from "@/lib/admin/schemas";
import { collectImageIds, isSettingsKey, SETTINGS_SPEC, settingsSchema } from "@/lib/settings/spec";
import { TAGS } from "@/lib/supabase/public";

export const saveSettings = adminAction(async ({ db }, key: string, _prev: unknown, fd: FormData) => {
  if (!isSettingsKey(key)) return fail("Sección inválida.");
  const parsed = settingsSchema(key).safeParse(json(fd, "value", null));
  if (!parsed.success) return fail("Revisá los campos marcados.", zodFieldErrors(parsed.error));

  // Las imágenes referenciadas tienen que existir en la biblioteca.
  const ids = [...collectImageIds(SETTINGS_SPEC[key].fields, parsed.data)];
  if (ids.length) {
    const { data } = await db.from("media").select("id").in("id", ids);
    if ((data?.length ?? 0) !== ids.length) return fail("Alguna de las imágenes elegidas ya no existe. Elegila de nuevo.");
  }

  const { error } = await db.from("site_settings").upsert({ key, value: parsed.data as never });
  if (error) return fail(dbErrorMessage(error).message);
  refresh(TAGS.settings, TAGS.media);
  return done("Cambios guardados: ya se ven en el sitio.");
});
