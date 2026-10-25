import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/admin/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPage();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
