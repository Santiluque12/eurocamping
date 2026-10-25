import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { toPicked } from "@/lib/admin/media-pick";
import { WorkshopForm } from "../WorkshopForm";

export const metadata = { title: "Editar servicio del taller" };

export default async function EditWorkshopPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data: s } = await db
    .from("workshop_services")
    .select("*, image:media!workshop_services_image_media_id_fkey(id, storage_path, external_url, alt)")
    .eq("id", id)
    .maybeSingle();
  if (!s) notFound();
  const kind = s.kind === "rate" ? "rate" : "category";

  return (
    <>
      <PageHeader
        title={s.name}
        back={{ href: "/admin/taller", label: "Taller" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={s.is_visible ? "visible" : "hidden"} />
            <AuditLine createdAt={s.created_at} updatedAt={s.updated_at} updatedBy={s.updated_by} />
          </span>
        }
      />
      {creado && (
        <div className="mb-4">
          <Banner ok>Guardado.</Banner>
        </div>
      )}
      <WorkshopForm
       
        kind={kind}
        service={{ ...s, kind, image: toPicked(s.image), price_amount: s.price_amount === null ? null : Number(s.price_amount) }}
      />
    </>
  );
}
