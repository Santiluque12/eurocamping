import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { EmptyState, ListCard, ListRow, PageHeader, StatusBadge } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { priceLabel } from "@/lib/format";

export const metadata = { title: "Taller" };

type Row = {
  id: string; kind: string; season: string | null; name: string; icon: string | null; is_visible: boolean;
  price_mode: "fixed" | "from" | "consult"; price_amount: number | null; currency: string; price_unit: string | null;
  image: { storage_path: string | null; external_url: string | null } | null;
};

function Group({ title, rows, newHref, newLabel }: { title: string; rows: Row[]; newHref: string; newLabel: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link href={newHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#1a1a1a]">
          <Plus size={16} /> {newLabel}
        </Link>
      </div>
      {rows.length ? (
        <ListCard>
          {rows.map((r) => (
            <ListRow
              key={r.id}
              href={`/admin/taller/${r.id}`}
              title={r.icon ? `${r.icon}  ${r.name}` : r.name}
              thumb={r.kind === "category" ? mediaUrl(r.image) : undefined}
              subtitle={priceLabel(r) ?? "Consultar"}
              meta={<StatusBadge status={r.is_visible ? "visible" : "hidden"} />}
            />
          ))}
        </ListCard>
      ) : (
        <EmptyState title="Todavía no hay elementos" />
      )}
    </section>
  );
}

export default async function WorkshopPage() {
  const { db } = await requireAdminPage();
  const { data, error } = await db
    .from("workshop_services")
    .select("id, kind, season, name, icon, is_visible, price_mode, price_amount, currency, price_unit, image:media!workshop_services_image_media_id_fkey(storage_path, external_url)")
    .order("sort_order");
  if (error) throw new Error("No se pudieron cargar los servicios del taller.");
  const rows = data as unknown as Row[];

  return (
    <>
      <PageHeader title="Taller" description="Tarjetas de servicios y tarifario orientativo de /taller." />
      <div className="space-y-8">
        <Group title="Servicios" rows={rows.filter((r) => r.kind === "category")} newHref="/admin/taller/nuevo" newLabel="Nuevo servicio" />
        <Group title="Tarifario · Invierno" rows={rows.filter((r) => r.kind === "rate" && r.season === "invierno")} newHref="/admin/taller/nuevo?tipo=tarifa" newLabel="Nueva fila" />
        <Group title="Tarifario · Verano" rows={rows.filter((r) => r.kind === "rate" && r.season === "verano")} newHref="/admin/taller/nuevo?tipo=tarifa&temporada=verano" newLabel="Nueva fila" />
      </div>
    </>
  );
}
