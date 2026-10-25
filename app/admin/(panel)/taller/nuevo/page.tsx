import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { WorkshopForm } from "../WorkshopForm";

export const metadata = { title: "Nuevo servicio del taller" };

export default async function NewWorkshopPage({ searchParams }: { searchParams: Promise<{ tipo?: string; temporada?: string }> }) {
  await requireAdminPage();
  const { tipo, temporada } = await searchParams;
  const kind = tipo === "tarifa" ? "rate" : "category";
  return (
    <>
      <PageHeader title={kind === "rate" ? "Nueva fila del tarifario" : "Nuevo servicio"} back={{ href: "/admin/taller", label: "Taller" }} />
      <WorkshopForm kind={kind} service={null} defaultSeason={temporada === "verano" ? "verano" : "invierno"} />
    </>
  );
}
