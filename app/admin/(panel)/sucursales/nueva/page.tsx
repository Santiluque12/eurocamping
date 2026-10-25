import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { BranchForm } from "../BranchForm";
import { branchRegions } from "../data";

export const metadata = { title: "Nueva sucursal" };

export default async function NewBranchPage() {
  const { db } = await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva sucursal" back={{ href: "/admin/sucursales", label: "Sucursales" }} />
      <BranchForm branch={null} regions={await branchRegions(db)} />
    </>
  );
}
