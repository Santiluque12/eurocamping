import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { CategoryForm } from "../CategoryForm";

export const metadata = { title: "Nueva categoría" };

export default async function NewCategoryPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva categoría" back={{ href: "/admin/categorias", label: "Categorías" }} />
      <CategoryForm category={null} />
    </>
  );
}
