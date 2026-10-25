import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { BrandForm } from "../BrandForm";

export const metadata = { title: "Nueva marca" };

export default async function NewBrandPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva marca" back={{ href: "/admin/marcas", label: "Marcas" }} />
      <BrandForm brand={null} />
    </>
  );
}
