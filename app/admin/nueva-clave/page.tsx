import { redirect } from "next/navigation";
import { AuthCard, AuthForm } from "@/components/admin/AuthForm";
import { updatePassword } from "@/lib/admin/auth-actions";
import { sessionDb } from "@/lib/supabase/server";

export const metadata = { title: "Nueva contraseña" };

export default async function NewPasswordPage() {
  // Se llega desde el enlace del email, que abre una sesión temporal.
  const db = await sessionDb();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login?error=enlace");
  return (
    <AuthCard title="Elegí una contraseña nueva" subtitle={data.user.email}>
      <AuthForm
        action={updatePassword}
        submitLabel="Guardar contraseña"
        fields={[
          { name: "password", label: "Contraseña nueva", type: "password", autoComplete: "new-password", help: "Al menos 10 caracteres." },
          { name: "confirm", label: "Repetí la contraseña", type: "password", autoComplete: "new-password" },
        ]}
      />
    </AuthCard>
  );
}
