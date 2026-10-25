import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { ActivityForm } from "../ActivityForm";

export const metadata = { title: "Editar actividad" };

export default async function EditActivityPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> }) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: a } = await db.from("activities").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  return (
    <>
      <PageHeader
        title={a.name}
        back={{ href: "/admin/actividades", label: "Actividades" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {a.archived_at && <StatusBadge status="archived" />}
            <AuditLine createdAt={a.created_at} updatedAt={a.updated_at} updatedBy={a.updated_by} />
          </span>
        }
      />
      {creado && <div className="mb-4"><Banner ok>Actividad creada.</Banner></div>}
      <ActivityForm activity={a} />
    </>
  );
}
