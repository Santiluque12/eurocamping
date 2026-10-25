import Link from "next/link";
import { AuthCard, AuthForm } from "@/components/admin/AuthForm";
import { requestPasswordReset } from "@/lib/admin/auth-actions";

export const metadata = { title: "Recuperar contraseña" };

export default function RecoverPage() {
  return (
    <AuthCard title="Recuperar contraseña" subtitle="Te enviamos un enlace para crear una contraseña nueva.">
      <AuthForm
        action={requestPasswordReset}
        submitLabel="Enviar enlace"
        fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
      />
      <div className="mt-6 text-center text-sm">
        <Link href="/admin/login" className="font-semibold text-[#b45309] hover:underline">
          Volver a ingresar
        </Link>
      </div>
    </AuthCard>
  );
}
