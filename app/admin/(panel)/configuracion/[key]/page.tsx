import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { toPicked } from "@/lib/admin/media-pick";
import { collectImageIds, isSettingsKey, SETTINGS_SPEC } from "@/lib/settings/spec";
import { SettingsForm } from "../SettingsForm";

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return { title: isSettingsKey(key) ? SETTINGS_SPEC[key].title : "Configuración" };
}

export default async function SettingsPage({ params }: { params: Promise<{ key: string }> }) {
  const { db } = await requireAdminPage();
  const { key } = await params;
  if (!isSettingsKey(key)) notFound();

  const { data: row } = await db.from("site_settings").select("value, created_at, updated_at, updated_by").eq("key", key).maybeSingle();
  const value = (row?.value ?? {}) as Record<string, unknown>;
  const ids = [...collectImageIds(SETTINGS_SPEC[key].fields, value)];
  const { data: media } = ids.length
    ? await db.from("media").select("id, storage_path, external_url, alt").in("id", ids)
    : { data: [] };
  const images = Object.fromEntries((media ?? []).flatMap((m) => {
    const p = toPicked(m);
    return p ? [[m.id, p]] : [];
  }));

  return (
    <>
      <PageHeader
        title={SETTINGS_SPEC[key].title}
        back={{ href: "/admin/configuracion", label: "Textos y configuración" }}
        description={
          <span className="space-y-1 block">
            <span className="block">{SETTINGS_SPEC[key].description}</span>
            {row && <AuditLine createdAt={row.created_at} updatedAt={row.updated_at} updatedBy={row.updated_by} />}
          </span>
        }
      />
      <SettingsForm settingsKey={key} value={value} images={images} />
    </>
  );
}
