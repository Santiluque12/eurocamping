import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { RateForm } from "../RateForm";
import { rateFormOptions } from "../data";

export const metadata = { title: "Nueva fila del tarifario" };

export default async function NewRatePage({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const { db } = await requireAdminPage();
  const { seccion } = await searchParams;
  const options = await rateFormOptions(db);
  return (
    <>
      <PageHeader title="Nueva fila del tarifario" back={{ href: "/admin/tarifario", label: "Tarifario" }} />
      <RateForm rate={null} defaultSectionId={options.sections.some((s) => s.value === seccion) ? seccion : ""} {...options} />
    </>
  );
}
