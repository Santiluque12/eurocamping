import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import SectionHeader from "@/components/SectionHeader";
import { sucursales, brands } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Más de 60 años en el mercado outdoor argentino. Conocé nuestra historia, nuestro equipo y nuestras sucursales en todo el país.",
};

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#f9fafb] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#1D9E75] mb-3">
            Desde 1965
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Somos el outdoor
            <br />
            <em className="text-[#1D9E75] italic font-light">de Argentina.</em>
          </h1>
          <p className="text-lg text-[#6b7280] leading-relaxed max-w-2xl">
            Eurocamping nació en 1965 como una pequeña tienda de equipamiento
            outdoor en Buenos Aires. Hoy somos la referencia del outdoor
            argentino: tienda, rental, taller y comunidad en un solo lugar.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Nuestra historia"
                title="60 años en"
                titleItalic="la naturaleza."
              />
              <div className="mt-6 space-y-4 text-[#6b7280] leading-relaxed">
                <p>
                  Empezamos en 1965 como una tienda especializada en equipamiento
                  de montaña y camping. Con los años nos convertimos en el punto
                  de referencia para toda la comunidad outdoor argentina.
                </p>
                <p>
                  Hoy combinamos la experiencia de seis décadas con un modelo
                  de negocio integral: venta de productos nuevos y usados,
                  alquiler de equipos para todas las disciplinas, taller de
                  reparaciones especializado y contenido editorial de calidad.
                </p>
                <p>
                  Nuestro equipo está formado por personas apasionadas por el
                  outdoor que practican lo que venden. Cada consejo viene de la
                  experiencia real.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "60+", label: "Años de historia" },
                { num: "748+", label: "Productos en catálogo" },
                { num: "7", label: "Sucursales en Argentina" },
                { num: "100%", label: "Pasión outdoor" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#E1F5EE] rounded-2xl p-6 text-center"
                >
                  <p
                    className="text-4xl font-bold text-[#1D9E75]"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-sm text-[#0F6E56] mt-1">{stat.label}</p>
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
            eyebrow="Dónde encontrarnos"
            title="Sucursales en"
            titleItalic="todo el país."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {sucursales.map((suc) => (
              <div
                key={suc.name}
                className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex flex-col gap-3"
              >
                <div>
                  <p
                    className="font-bold text-[#1a1a1a]"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {suc.name}
                  </p>
                  <p className="text-sm text-[#1D9E75] font-medium">{suc.city}</p>
                </div>
                {suc.address && (
                  <div className="flex items-start gap-2 text-sm text-[#6b7280]">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                    {suc.address}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                  <Phone size={14} className="shrink-0 text-[#1D9E75]" />
                  {suc.phone}
                </div>
                {suc.hours && (
                  <div className="flex items-start gap-2 text-sm text-[#6b7280]">
                    <Clock size={14} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                    {suc.hours}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Marcas representadas"
            title="Las mejores marcas,"
            titleItalic="todas acá."
            description="Trabajamos con las marcas más reconocidas del outdoor mundial."
          />
          <div className="flex flex-wrap gap-3 mt-10">
            {brands.map((brand) => (
              <span
                key={brand}
                className="bg-[#f9fafb] border border-[#e5e7eb] text-[#1a1a1a] text-sm font-medium px-4 py-2 rounded-full"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppBanner />
    </>
  );
}
