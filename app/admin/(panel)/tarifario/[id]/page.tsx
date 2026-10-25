import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { Banner } from "@/components/admin/form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AuditLine } from "@/components/admin/AuditLine";
import { RateForm } from "../RateForm";
import { rateFormOptions } from "../data";

export const metadata = { title: "Editar fila del tarifario" };

export default async function EditRatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> }) {
  const { db } = await requireAdminPage();
  const { id } = await params;
  const { creado } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const [{ data: r }, options] = await Promise.all([
    db.from("rental_rates").select("*, rental_rate_prices(period, amount, currency), rental_sections(nav_label)").eq("id", id).maybeSingle(),
    rateFormOptions(db),
  ]);
  if (!r) notFound();

  return (
    <>
      <PageHeader
        title={r.name}
        back={{ href: "/admin/tarifario", label: "Tarifario" }}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={r.status} />
            <span className="text-xs">{r.rental_sections?.nav_label}</span>
            <AuditLine createdAt={r.created_at} updatedAt={r.updated_at} updatedBy={r.updated_by} />
          </span>
        }
      />
      {creado && <div className="mb-4"><Banner ok>Fila creada.</Banner></div>}
      <RateForm
       
        rate={{
          ...r,
          prices: Object.fromEntries(r.rental_rate_prices.map((p) => [p.period, Number(p.amount)])),
          currency: r.rental_rate_prices[0]?.currency ?? "ARS",
        }}
        {...options}
      />
    </>
  );
}
