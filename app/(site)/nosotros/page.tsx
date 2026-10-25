import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import ContactBanner from "@/components/ContactBanner";
import SectionHeader from "@/components/SectionHeader";
import { getBranches, getBrands, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Más de 60 años en el mercado outdoor argentino. Conocé nuestra historia, nuestro equipo y nuestras sucursales en todo el país.",
};

export default async function NosotrosPage() {
  const [page, sucursales, brands] = await Promise.all([getSettings("nosotros"), getBranches(), getBrands()]);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.hero.eyebrow && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
              {page.hero.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {page.hero.title}
            {page.hero.titleAccent && (
              <>
                <br />
                <em className="text-[#F5A623] not-italic font-light">{page.hero.titleAccent}</em>
              </>
            )}
          </h1>
          {page.hero.description && (
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl">{page.hero.description}</p>
          )}
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow={page.history.eyebrow}
                title={page.history.title}
                titleItalic={page.history.titleAccent}
                description={page.history.description}
              />
              <div className="mt-6 space-y-4 text-[#6b7280] leading-relaxed">
                {page.history.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {page.stats.map((s) => ({ num: s.value, label: s.label })).map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#FFF3DC] rounded-2xl p-6 text-center"
                >
                  <p
                    className="text-4xl font-bold text-[#F5A623] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-sm text-[#7A5A00] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sucursales */}
      <section id="sucursales" className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={page.branches.eyebrow}
            title={page.branches.title}
            titleItalic={page.branches.titleAccent}
            description={page.branches.description}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {sucursales.map((suc) => (
              <div
                key={suc.id}
                className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex flex-col gap-3"
              >
                <div>
                  <p
                    className="font-bold text-[#1a1a1a] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {suc.name}
                  </p>
                  <p className="text-sm text-[#F5A623] font-medium">{suc.city}</p>
                </div>
                {suc.address && (
                  <div className="flex items-start gap-2 text-sm text-[#6b7280]">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-[#F5A623]" />
                    {suc.address}
                  </div>
                )}
                {suc.phones.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <Phone size={14} className="shrink-0 text-[#F5A623]" />
                    {suc.phones.join(" · ")}
                  </div>
                )}
                {suc.hours && (
                  <div className="flex items-start gap-2 text-sm text-[#6b7280]">
                    <Clock size={14} className="mt-0.5 shrink-0 text-[#F5A623]" />
                    {suc.hours}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      {brands.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={page.brands.eyebrow}
            title={page.brands.title}
            titleItalic={page.brands.titleAccent}
            description={page.brands.description}
          />
          <div className="flex flex-wrap gap-3 mt-10">
            {brands.map((brand) => (
              <span
                key={brand.slug}
                className="bg-[#f9fafb] border border-[#e5e7eb] text-[#1a1a1a] text-sm font-medium px-4 py-2 rounded-full"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>
      )}

      <ContactBanner />
    </>
  );
}
