import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, AuthForm } from "@/components/admin/AuthForm";
import { Banner } from "@/components/admin/form";
import { signIn } from "@/lib/admin/auth-actions";
import { getAdminSession } from "@/lib/admin/auth";

export const metadata = { title: "Ingresar" };

const NOTICES: Record<string, { ok: boolean; text: string }> = {
  "sin-permiso": { ok: false, text: "Tu cuenta no tiene permiso para administrar el sitio." },
  enlace: { ok: false, text: "El enlace no es válido o ya venció. Pedí uno nuevo." },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (await getAdminSession()) redirect("/admin");
  const sp = await searchParams;
  const notice = sp.error ? NOTICES[sp.error] : sp.sesion === "cerrada" ? { ok: true, text: "Cerraste sesión." } : null;
  return (
    <AuthCard title="Administración del sitio" subtitle="Ingresá con tu email y contraseña.">
      {notice && (
        <div className="mb-4">
          <Banner ok={notice.ok}>{notice.text}</Banner>
        </div>
      )}
      <AuthForm
        action={signIn}
        submitLabel="Ingresar"
        hidden={{ next: sp.next ?? "" }}
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Contraseña", type: "password", autoComplete: "current-password" },
        ]}
      />
      <div className="mt-6 text-center text-sm">
        <Link href="/admin/recuperar" className="font-semibold text-[#b45309] hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </AuthCard>
  );
}
