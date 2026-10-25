"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity, Bookmark, Building2, ExternalLink, Images, LayoutDashboard, LogOut, Menu, Newspaper,
  Receipt, Settings, Store, Tags, Wrench, X,
} from "lucide-react";
import { signOut } from "@/lib/admin/auth-actions";

const NAV = [
  { group: null, items: [{ href: "/admin", label: "Inicio", icon: LayoutDashboard }] },
  {
    group: "Contenido",
    items: [
      { href: "/admin/productos", label: "Productos y equipos", icon: Store },
      { href: "/admin/tarifario", label: "Tarifario de alquiler", icon: Receipt },
      { href: "/admin/publicaciones", label: "ECOtrips y ECOtips", icon: Newspaper },
      { href: "/admin/sucursales", label: "Sucursales", icon: Building2 },
      { href: "/admin/taller", label: "Taller", icon: Wrench },
    ],
  },
  {
    group: "Catálogos",
    items: [
      { href: "/admin/marcas", label: "Marcas", icon: Tags },
      { href: "/admin/categorias", label: "Categorías", icon: Bookmark },
      { href: "/admin/actividades", label: "Actividades", icon: Activity },
    ],
  },
  {
    group: "Sitio",
    items: [
      { href: "/admin/imagenes", label: "Imágenes", icon: Images },
      { href: "/admin/configuracion", label: "Textos y configuración", icon: Settings },
    ],
  },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-5" aria-label="Secciones del administrador">
      {NAV.map((section, i) => (
        <div key={i}>
          {section.group && (
            <p className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-widest text-white/40">{section.group}</p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href) ? "bg-[#F5A623] text-[#1A1A1A]" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      >
        <ExternalLink size={18} /> Ver el sitio
      </a>
      <p className="px-3 text-xs text-white/50 truncate" title={email}>
        {email}
      </p>
      <form action={signOut}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
          <LogOut size={18} /> Cerrar sesión
        </button>
      </form>
    </div>
  );

  return (
    <div className="lg:flex min-h-screen">
      {/* Barra superior (celular) */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between bg-[#1A1A1A] px-4">
        <Link href="/admin" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-eco-color.png" alt="Eurocamping" className="h-7 w-auto" />
          <span className="text-xs font-semibold text-white/60">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="p-2 text-white"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      {open && (
        <div className="lg:hidden fixed inset-0 top-14 z-30 overflow-y-auto bg-[#1A1A1A] p-4 space-y-6">
          {nav}
          {footer}
        </div>
      )}

      {/* Menú lateral (computadora) */}
      <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col justify-between bg-[#1A1A1A] p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <Link href="/admin" className="flex items-center gap-2 px-3 pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-eco-color.png" alt="Eurocamping" className="h-8 w-auto" />
            <span className="text-xs font-semibold text-white/60">Admin</span>
          </Link>
          {nav}
        </div>
        {footer}
      </aside>

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
