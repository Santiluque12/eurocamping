import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { SectionForm } from "../SectionForm";

export const metadata = { title: "Nueva sección del tarifario" };

export default async function NewSectionPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva sección" back={{ href: "/admin/tarifario", label: "Tarifario" }} />
      <SectionForm section={null} />
    </>
  );
}
