import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { toPicked } from "@/lib/admin/media-pick";
import { BrandForm } from "../BrandForm";

export const metadata = { title: "Editar marca" };

export default async function EditBrandPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> }) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: b } = await db.from("brands").select("*, logo:media!brands_logo_media_id_fkey(id, storage_path, external_url, alt)").eq("id", id).maybeSingle();
  if (!b) notFound();
  return (
    <>
      <PageHeader
        title={b.name}
        back={{ href: "/admin/marcas", label: "Marcas" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {b.archived_at && <StatusBadge status="archived" />}
            <AuditLine createdAt={b.created_at} updatedAt={b.updated_at} updatedBy={b.updated_by} />
          </span>
        }
      />
      {creado && <div className="mb-4"><Banner ok>Marca creada.</Banner></div>}
      <BrandForm brand={{ ...b, logo: toPicked(b.logo) }} />
    </>
  );
}
