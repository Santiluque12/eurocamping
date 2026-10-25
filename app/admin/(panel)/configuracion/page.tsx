import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { SETTINGS_KEYS, SETTINGS_SPEC } from "@/lib/settings/spec";

export const metadata = { title: "Textos y configuración" };

const PAGE_PATH: Record<string, string | null> = {
  general: null, home: "/", alquilar: "/alquilar", catalogo: "/alquilar/catalogo", taller: "/taller",
  nosotros: "/nosotros", sucursales: "/sucursales", contenido: "/contenido", usados: "/comprar/usados",
};

export default async function SettingsIndexPage() {
  const { db } = await requireAdminPage();
  const { data } = await db.from("site_settings").select("key, updated_at");
  const updated = new Map((data ?? []).map((r) => [r.key, r.updated_at]));
  const fmt = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });

  return (
    <>
      <PageHeader title="Textos y configuración" description="Títulos, textos, botones e imágenes de cada página, y los datos de contacto del sitio." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {SETTINGS_KEYS.map((key) => (
          <li key={key}>
            <Link href={`/admin/configuracion/${key}`} className="flex h-full items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 hover:border-[#F5A623]">
              <span className="flex-1 min-w-0">
                <span className="block font-semibold">{SETTINGS_SPEC[key].title}</span>
                <span className="block text-xs text-[#6b7280] mt-0.5">{SETTINGS_SPEC[key].description}</span>
                <span className="block text-xs text-[#9ca3af] mt-1">
                  {PAGE_PATH[key] ?? "Todo el sitio"}
                  {updated.get(key) && ` · modificado ${fmt.format(new Date(updated.get(key)!))}`}
                </span>
              </span>
              <ChevronRight size={18} className="text-[#9ca3af]" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
