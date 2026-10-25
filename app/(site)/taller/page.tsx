import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Check, MapPin, Clock, Wrench } from "lucide-react";
import ContactBanner from "@/components/ContactBanner";
import SectionHeader from "@/components/SectionHeader";
import { getContact, getSettings, getSettingsImages, getWorkshop } from "@/lib/content";

export const metadata: Metadata = {
  title: "Taller de Reparaciones Outdoor",
  description:
    "El taller especializado en equipos outdoor más completo de Argentina. Carpas, bolsas de dormir, mochilas, calzado, skis y más. Más de 60 años de experiencia.",
};

const CONDITION_COLORS = ["#F5A623", "#C47A10", "#3D3D3D"];
const INFO_ICONS = [MapPin, Clock, Wrench];

export default async function TallerPage() {
  const [page, workshop, contact] = await Promise.all([getSettings("taller"), getWorkshop(), getContact()]);
  const images = await getSettingsImages("taller", page);
  const heroImage = page.hero.image ? images.get(page.hero.image) : null;
  const tarifas = [
    { season: "Temporada Invierno", emoji: "❄️", items: workshop.winter },
    { season: "Temporada Verano", emoji: "☀️", items: workshop.summer },
  ].filter((t) => t.items.length > 0);

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
              href={contact.links.taller}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] font-bold px-6 py-3.5 rounded-full hover:bg-[#E08B00] transition-colors"
            >
              <MessageCircle size={18} />
              {page.hero.ctaLabel || "Pedir turno"}
            </a>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-4 mt-10">
            {page.info.map((info, i) => {
              const Icon = INFO_ICONS[i % INFO_ICONS.length];
              return (
              <div
                key={info.label}
                className="flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full"
              >
                <Icon size={14} className="text-[#F5A623]" />
                <span>
                  <span className="font-semibold">{info.label}:</span> {info.value}
                </span>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Descuentos y condiciones */}
      {page.conditions.length > 0 && (
      <section className="py-12 bg-[#FFF3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {page.conditions.map((c, i) => ({ label: c.title, desc: c.description, color: CONDITION_COLORS[i % CONDITION_COLORS.length] })).map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-6 border border-[#e5e7eb]"
              >
                <p
                  className="text-xl font-bold mb-2 tracking-tight"
                  style={{
                    color: item.color,
                    fontFamily: "var(--font-fraunces)",
                  }}
                >
                  {item.label}
                </p>
                <p className="text-sm text-[#6b7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Servicios */}
      {workshop.services.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={page.services.eyebrow}
            title={page.services.title}
            titleItalic={page.services.titleAccent}
            description={page.services.description}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {workshop.services.map((service) => (
              <div
                key={service.id}
                className="border border-[#e5e7eb] rounded-2xl overflow-hidden"
              >
                <div className="bg-[#f9fafb] px-6 py-4 flex items-center gap-3 border-b border-[#e5e7eb]">
                  {service.image ? (
                    <span className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image src={service.image.url} alt={service.image.alt} fill className="object-cover" sizes="40px" />
                    </span>
                  ) : (
                    service.icon && <span className="text-2xl">{service.icon}</span>
                  )}
                  <h3
                    className="font-bold text-[#1a1a1a] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {service.name}
                  </h3>
                </div>
                {service.description && (
                  <p className="px-6 pt-4 text-sm text-[#6b7280] leading-relaxed">{service.description}</p>
                )}
                {service.price && (
                  <p className="px-6 pt-3 text-sm font-semibold text-[#F5A623]">{service.price}</p>
                )}
                <ul className="p-4 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#1a1a1a]">
                      <Check size={14} className="text-[#F5A623] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {service.waLink && (
                  <a
                    href={service.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-4 mb-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1A1A1A] bg-[#FFF3DC] hover:bg-[#F5A623] px-3 py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircle size={13} />
                    Consultar por este servicio
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Tarifario invierno/verano */}
      {tarifas.length > 0 && (
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={page.rates.eyebrow}
            title={page.rates.title}
            titleItalic={page.rates.titleAccent}
            description={page.rates.description}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {tarifas.map((tarifa) => (
              <div
                key={tarifa.season}
                className="border border-[#e5e7eb] rounded-2xl overflow-hidden bg-white"
              >
                <div className="bg-[#FFF3DC] px-6 py-4 flex items-center gap-3">
                  <span className="text-2xl">{tarifa.emoji}</span>
                  <h3
                    className="font-bold text-lg text-[#1A1A1A] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {tarifa.season}
                  </h3>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {tarifa.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center px-6 py-3 gap-4"
                    >
                      <span className="text-sm text-[#1a1a1a]">{item.name}</span>
                      <span className="text-sm font-semibold text-[#F5A623] shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {page.rates.footnote && (
            <p className="text-xs text-[#6b7280] mt-4 text-center">{page.rates.footnote}</p>
          )}
        </div>
      </section>
      )}

      <ContactBanner
        title={page.banner.title}
        subtitle={page.banner.text}
        section="taller"
        buttonLabel={page.banner.button}
      />
    </>
  );
}
