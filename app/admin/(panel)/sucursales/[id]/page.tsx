import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { BranchForm } from "../BranchForm";
import { branchRegions } from "../data";

export const metadata = { title: "Editar sucursal" };

export default async function EditBranchPage({
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

  const [{ data: b }, regions] = await Promise.all([db.from("branches").select("*").eq("id", id).maybeSingle(), branchRegions(db)]);
  if (!b) notFound();

  return (
    <>
      <PageHeader
        title={b.name}
        back={{ href: "/admin/sucursales", label: "Sucursales" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={b.is_visible ? "visible" : "hidden"} />
            <AuditLine createdAt={b.created_at} updatedAt={b.updated_at} updatedBy={b.updated_by} />
          </span>
        }
      />
      {creado && (
        <div className="mb-4">
          <Banner ok>Sucursal creada.</Banner>
        </div>
      )}
      <BranchForm branch={b} regions={regions} />
    </>
  );
}
