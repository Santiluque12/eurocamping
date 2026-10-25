import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { CategoryForm } from "../CategoryForm";

export const metadata = { title: "Editar categoría" };

export default async function EditCategoryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> }) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: c } = await db.from("categories").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();
  return (
    <>
      <PageHeader
        title={c.name}
        back={{ href: "/admin/categorias", label: "Categorías" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {c.archived_at && <StatusBadge status="archived" />}
            <AuditLine createdAt={c.created_at} updatedAt={c.updated_at} updatedBy={c.updated_by} />
          </span>
        }
      />
      {creado && <div className="mb-4"><Banner ok>Categoría creada.</Banner></div>}
      <CategoryForm category={c} />
    </>
  );
}
