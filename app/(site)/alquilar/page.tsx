import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Check, Info, MapPin, Grid2x2, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import InlineBold from "@/components/InlineBold";
import { getContact, getRentalTariff, getSettings, getSettingsImages, type TariffRow, type TariffSection } from "@/lib/content";
import { PERIOD_LABELS } from "@/lib/format";

export const metadata: Metadata = {
  title: "Alquiler de Equipos Outdoor | ECOrental",
  description:
    "Alquilá kayaks, carpas, skis, snowboards, mochilas e indumentaria con el servicio Fastrack de Eurocamping. El precio más bajo garantizado.",
};

// ─── Components ───────────────────────────────────────────────────────────────

function PriceTable({ items, headers }: { items: TariffRow[]; headers: string[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#243d37] bg-[#182B26]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#111f1b] border-b border-[#F5A623]/20">
            <th className="text-left py-3 px-5 font-semibold text-white/40 min-w-[220px] uppercase tracking-wider text-xs">
              Equipo
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="text-center py-3 px-4 font-semibold text-[#F5A623] whitespace-nowrap uppercase tracking-wider text-xs"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#243d37]">
          {items.map((item) => (
            <tr key={item.id} className="bg-[#182B26] hover:bg-white/5 transition-colors">
              <td className="py-3 px-5 text-white font-bold uppercase text-xs tracking-wide">
                {item.catalogSlug ? (
                  <Link
                    href={`/alquilar/catalogo#${item.catalogSlug}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#F5A623] transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-[#F5A623]"
                  >
                    {item.name}
                    <ArrowUpRight size={11} className="shrink-0 opacity-50" />
                  </Link>
                ) : (
                  item.name
                )}
              </td>
              {item.prices.map((p, i) => (
                <td
                  key={i}
                  className={`py-3 px-4 text-center whitespace-nowrap ${
                    p === null
                      ? "text-white/20"
                      : "text-[#F5A623] font-semibold"
                  }`}
                >
                  {p === null ? "—" : p}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TariffSectionBlock({
  section,
  index,
  resorts,
  rentalLink,
}: {
  section: TariffSection;
  index: number;
  resorts: { title: string; text: string; items: string[] };
  rentalLink: string;
}) {
  const headers = section.periods.map((p) => PERIOD_LABELS[p]);
  const grouped = section.groups.some((g) => g.name);
  return (
    <section id={section.slug} className={`py-16 scroll-mt-28 ${index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Tarifario"
          title={section.title}
          titleItalic={section.titleAccent ?? undefined}
          description={section.description ?? undefined}
        />
        {section.groups.length === 0 ? (
          <p className="mt-10 text-sm text-[#6b7280]">Pronto vas a encontrar acá los precios de esta categoría. Consultanos por WhatsApp.</p>
        ) : grouped ? (
          <div className="mt-10 space-y-8">
            {section.groups.map((g, i) => (
              <div key={`${g.name}-${i}`}>
                {g.name && (
                  <h3
                    className="text-base font-bold text-[#1A1A1A] mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {g.name}
                  </h3>
                )}
                <PriceTable items={g.rows} headers={headers} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <PriceTable items={section.groups.flatMap((g) => g.rows)} headers={headers} />
          </div>
        )}

        {section.showResorts && resorts.items.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[#e5e7eb] bg-white p-6">
            <p
              className="text-base font-bold text-[#1A1A1A] mb-1 tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {resorts.title}
            </p>
            <p className="text-sm text-[#6b7280] mb-4">{resorts.text}</p>
            <div className="flex flex-wrap gap-2">
              {resorts.items.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FFF3DC] text-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#F5A623]/30"
                >
                  🎿 {r}
                </span>
              ))}
            </div>
            <a
              href={rentalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#F5A623] hover:text-[#E08B00] transition-colors"
            >
              <MessageCircle size={14} />
              Consultar tarifario de mi destino
            </a>
          </div>
        )}

        {section.footnote && <p className="mt-4 text-xs text-[#9ca3af]">{section.footnote}</p>}
      </div>
    </section>
  );
}

export default async function AlquilarPage() {
  const [page, tariff, contact] = await Promise.all([getSettings("alquilar"), getRentalTariff(), getContact()]);
  const images = await getSettingsImages("alquilar", page);
  const heroImage = page.hero.image ? images.get(page.hero.image) : null;
  const rentalLink = contact.links.rental;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1A1A1A] py-20 overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.hero.eyebrow && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
              {page.hero.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {page.hero.title}
            {page.hero.titleAccent && (
              <>
                <br />
                <em className="not-italic font-light text-[#F5A623]">{page.hero.titleAccent}</em>
              </>
            )}
          </h1>
          {page.hero.description && (
            <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">{page.hero.description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={rentalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] font-bold px-6 py-3.5 rounded-full hover:bg-[#E08B00] transition-colors"
            >
              <MessageCircle size={18} />
              Consultar disponibilidad
            </a>
            <Link
              href="/alquilar/catalogo"
              className="flex items-center gap-2 border border-white/30 text-white font-bold px-6 py-3.5 rounded-full hover:border-[#F5A623] hover:text-[#F5A623] transition-colors"
            >
              <Grid2x2 size={18} />
              Ver catálogo de productos
            </Link>
          </div>
        </div>
      </section>

      {/* Category quick nav */}
      {tariff.length > 0 && (
        <nav className="sticky top-16 z-30 bg-white border-b border-[#e5e7eb] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto py-1 scrollbar-none">
            {tariff.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#374151] hover:bg-[#FFF3DC] hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
              >
                {c.icon && <span>{c.icon}</span>}
                {c.navLabel}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Tarifario note */}
      {page.priceNote && (
        <div className="bg-[#FFF8ED] border-y border-[#F5A623]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
            <Info size={16} className="text-[#F5A623] shrink-0" />
            <p className="text-sm text-[#6b7280]"><InlineBold text={page.priceNote} className="text-[#1A1A1A]" /></p>
          </div>
        </div>
      )}

      {tariff.length === 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#6b7280]">
            Estamos actualizando el tarifario. Consultá precios por WhatsApp.
          </div>
        </section>
      )}

      {tariff.map((section, i) => (
        <TariffSectionBlock
          key={section.slug}
          section={section}
          index={i}
          resorts={page.resorts}
          rentalLink={rentalLink}
        />
      ))}

      {/* Fastrack */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
                {page.fastrack.eyebrow}
              </p>
              <h2
                className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {page.fastrack.title}
                <br />
                <em className="not-italic font-light text-[#F5A623]">{page.fastrack.titleAccent}</em>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">{page.fastrack.description}</p>
              <ul className="space-y-2 text-sm text-white/80">
                {page.fastrack.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#F5A623]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 text-center">
              <p
                className="text-2xl font-bold text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {page.fastrack.promoTitle}
              </p>
              <p className="text-white/70 text-sm mb-4">{page.fastrack.promoText}</p>
              {page.fastrack.promoLocation && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#F5A623] font-semibold mb-6">
                  <MapPin size={14} />
                  {page.fastrack.promoLocation}
                </div>
              )}
              <a
                href={rentalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1ea855] transition-colors"
              >
                <MessageCircle size={16} />
                {page.fastrack.promoButton || "Consultar por WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Información importante */}
      {page.policies.length > 0 && (
        <section className="py-16 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Políticas de alquiler"
              title="Información"
              titleItalic="importante"
              centered
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {page.policies.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-6 border border-[#e5e7eb] flex flex-col gap-3"
                >
                  {card.icon && <span className="text-3xl">{card.icon}</span>}
                  <h3
                    className="font-bold text-[#1A1A1A] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo funciona */}
      {page.steps.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="El proceso"
              title="Cómo funciona"
              titleItalic="el alquiler"
              centered
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
              {page.steps.map((step, i) => (
                <div key={step.title} className="flex flex-col items-center text-center gap-4">
                  <span
                    className="text-5xl font-bold text-[#F5A623]/20 tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#1a1a1a] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ventajas */}
      {page.advantages.length > 0 && (
        <section className="py-16 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Por qué elegir ECOrental"
              title="Todo incluido,"
              titleItalic="nada complicado"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
              {page.advantages.map((v) => (
                <div
                  key={v}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#e5e7eb]"
                >
                  <Check size={18} className="text-[#F5A623] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1a1a1a]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final inline */}
      <section className="py-14 bg-[#FFF3DC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {page.cta.title}
          </p>
          <p className="text-[#6b7280] mb-6 leading-relaxed">{page.cta.text}</p>
          <a
            href={rentalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white font-bold px-8 py-4 rounded-full hover:bg-[#F5A623] hover:text-[#1A1A1A] transition-colors"
          >
            <MessageCircle size={18} />
            Consultar alquiler por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
