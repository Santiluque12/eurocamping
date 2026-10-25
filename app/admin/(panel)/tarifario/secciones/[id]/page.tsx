import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { SectionForm } from "../SectionForm";

export const metadata = { title: "Editar sección del tarifario" };

export default async function EditSectionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> }) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [{ data: s }, { count }] = await Promise.all([
    db.from("rental_sections").select("*").eq("id", id).maybeSingle(),
    db.from("rental_rates").select("id", { count: "exact", head: true }).eq("section_id", id),
  ]);
  if (!s) notFound();
  return (
    <>
      <PageHeader
        title={`${s.title} ${s.title_accent ?? ""}`.trim()}
        back={{ href: "/admin/tarifario", label: "Tarifario" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={s.is_visible ? "visible" : "hidden"} />
            <span className="text-xs">{count ?? 0} fila(s)</span>
            <AuditLine createdAt={s.created_at} updatedAt={s.updated_at} updatedBy={s.updated_by} />
          </span>
        }
      />
      {creado && <div className="mb-4"><Banner ok>Sección creada. Ya podés agregarle filas.</Banner></div>}
      <SectionForm section={s} rateCount={count ?? 0} />
    </>
  );
}
