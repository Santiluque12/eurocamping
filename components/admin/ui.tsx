import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 space-y-3">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1 text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a]">
          <ChevronLeft size={16} /> {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a]">{title}</h1>
          {description && <div className="mt-1 text-sm text-[#6b7280] max-w-2xl">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function NewButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#E08B00]"
    >
      <Plus size={18} /> {label}
    </Link>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  published: { label: "Publicado", cls: "bg-green-100 text-green-800" },
  draft: { label: "Borrador", cls: "bg-amber-100 text-amber-900" },
  archived: { label: "Archivado", cls: "bg-gray-200 text-gray-700" },
  visible: { label: "Visible", cls: "bg-green-100 text-green-800" },
  hidden: { label: "Oculto", cls: "bg-gray-200 text-gray-700" },
  active: { label: "Activo", cls: "bg-green-100 text-green-800" },
};

export function StatusBadge({ status }: { status: keyof typeof STATUS | string }) {
  const s = STATUS[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

/** Buscador + filtros por GET (funciona sin JavaScript). */
export function Filters({
  q,
  placeholder = "Buscar…",
  selects = [],
}: {
  q?: string;
  placeholder?: string;
  selects?: { name: string; label: string; value?: string; options: { value: string; label: string }[] }[];
}) {
  return (
    <form method="get" className="mb-4 grid gap-2 sm:flex sm:flex-wrap sm:items-end" role="search">
      <label className="flex-1 min-w-[200px]">
        <span className="sr-only">Buscar</span>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            name="q"
            defaultValue={q}
            placeholder={placeholder}
            className="w-full rounded-xl border border-[#d1d5db] bg-white py-2.5 pl-10 pr-3 text-[15px] focus:border-[#F5A623] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
          />
        </div>
      </label>
      {selects.map((s) => (
        <label key={s.name} className="block">
          <span className="sr-only">{s.label}</span>
          <select
            name={s.name}
            defaultValue={s.value ?? ""}
            aria-label={s.label}
            className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-[15px] focus:border-[#F5A623] focus:outline-none"
          >
            <option value="">{s.label}: todos</option>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit" className="rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3D3D3D]">
        Filtrar
      </button>
    </form>
  );
}

export function Pagination({ page, total, perPage, params }: { page: number; total: number; perPage: number; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (pages <= 1) return <p className="mt-4 text-xs text-[#6b7280]">{total} resultado(s)</p>;
  const href = (p: number) => {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    sp.set("page", String(p));
    return `?${sp.toString()}`;
  };
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-xs text-[#6b7280]">
        {total} resultado(s) · página {page} de {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className="inline-flex items-center gap-1 rounded-lg border border-[#d1d5db] bg-white px-3 py-2 font-medium hover:bg-[#f9fafb]">
            <ChevronLeft size={16} /> Anterior
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={href(page + 1)} className="inline-flex items-center gap-1 rounded-lg border border-[#d1d5db] bg-white px-3 py-2 font-medium hover:bg-[#f9fafb]">
            Siguiente <ChevronRight size={16} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white px-6 py-12 text-center">
      <p className="font-semibold text-[#1a1a1a]">{title}</p>
      {children && <div className="mt-2 text-sm text-[#6b7280]">{children}</div>}
    </div>
  );
}

/** Tabla en computadora, tarjetas en celular. */
export function ListCard({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden">{children}</ul>;
}

export function ListRow({
  href,
  title,
  subtitle,
  thumb,
  meta,
}: {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  thumb?: string | null;
  meta?: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f9fafb]">
        {thumb !== undefined && (
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f3f4f6]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {thumb && <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-[#1a1a1a]">{title}</span>
          {subtitle && <span className="block truncate text-xs text-[#6b7280] mt-0.5">{subtitle}</span>}
        </span>
        {meta && <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">{meta}</span>}
      </Link>
    </li>
  );
}

export const PER_PAGE = 20;

export function pageParam(v: string | undefined) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Escapa caracteres especiales para usar texto libre en filtros ilike/or de PostgREST. */
export function searchTerm(q: string | undefined) {
  const t = (q ?? "").trim().replace(/[%_,()\\*]/g, " ").slice(0, 80);
  return t ? `%${t}%` : null;
}
