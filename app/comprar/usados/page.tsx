import type { Metadata } from "next";
import { Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import { products, WA_LINKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Equipos Usados Revisados",
  description:
    "Equipos outdoor usados revisados y certificados por el taller ECO. La mitad del precio, el doble de confianza.",
};

export default function UsadosPage() {
  const usados = products.filter((p) => p.type === "usado");

  return (
    <>
      <section className="bg-[#FAEEDA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C47A10] mb-3">
            Revisados ECO
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-[#7a4a00] leading-tight mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            La mitad del precio,
            <br />
            <em className="text-[#C47A10] italic font-light">el doble de confianza.</em>
          </h1>
          <p className="text-lg text-[#9a6010] max-w-xl leading-relaxed">
            Cada equipo pasa por nuestro taller antes de la venta. Revisamos,
            reparamos y certificamos que está en perfectas condiciones.
          </p>
        </div>
      </section>

      {/* Proceso de revisión */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Recepción",
                desc: "Recibimos el equipo y hacemos un diagnóstico inicial.",
              },
              {
                step: "02",
                title: "Revisión y reparación",
                desc: "Nuestro taller revisa cada componente y repara lo necesario.",
              },
              {
                step: "03",
                title: "Certificado ECO",
                desc: 'El equipo recibe el sello "Revisado ECO" y está listo para venta.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex gap-4 bg-[#f9fafb] rounded-2xl p-5 border border-[#e5e7eb]"
              >
                <span
                  className="text-3xl font-bold text-[#EF9F27]/30 shrink-0"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {s.step}
                </span>
                <div>
                  <p
                    className="font-bold text-[#1a1a1a] mb-1"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {s.title}
                  </p>
                  <p className="text-sm text-[#6b7280]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-14 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Disponibles ahora"
            title="Equipos revisados"
            titleItalic="listos para llevarte."
          />
          {usados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {usados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-16">
              <p className="text-[#6b7280] text-lg mb-4">
                No hay equipos usados disponibles en este momento.
              </p>
              <a
                href={WA_LINKS.usados}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#EF9F27] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#c47a10] transition-colors"
              >
                Consultarnos por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      <WhatsAppBanner
        title="¿Querés vender tu equipo?"
        subtitle="También compramos equipos usados en buen estado. Consultanos."
        waLink={WA_LINKS.usados}
        buttonLabel="Consultar por usados"
      />
    </>
  );
}
