import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "../ProductForm";
import { productFormOptions } from "../data";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const { db } = await requireAdminPage();
  const options = await productFormOptions(db);
  return (
    <>
      <PageHeader title="Nuevo producto" back={{ href: "/admin/productos", label: "Productos" }} />
      <ProductForm product={null} {...options} />
    </>
  );
}
