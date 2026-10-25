import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { ActivityForm } from "../ActivityForm";

export const metadata = { title: "Nueva actividad" };

export default async function NewActivityPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva actividad" back={{ href: "/admin/actividades", label: "Actividades" }} />
      <ActivityForm activity={null} />
    </>
  );
}
