import type { Metadata } from "next";
import { Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import ContactBanner from "@/components/ContactBanner";
import { getContact, getProductsByType, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Equipos Usados Revisados",
  description:
    "Equipos outdoor usados revisados y certificados por el taller ECO. La mitad del precio, el doble de confianza.",
};

export default async function UsadosPage() {
  const [page, usados, contact] = await Promise.all([
    getSettings("usados"),
    getProductsByType("usado"),
    getContact(),
  ]);

  return (
    <>
      <section className="bg-[#FAEEDA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.hero.eyebrow && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#C47A10] mb-3">
              {page.hero.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-6xl font-bold text-[#7a4a00] leading-tight mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {page.hero.title}
            {page.hero.titleAccent && (
              <>
                <br />
                <em className="text-[#C47A10] italic font-light">{page.hero.titleAccent}</em>
              </>
            )}
          </h1>
          {page.hero.description && (
            <p className="text-lg text-[#9a6010] max-w-xl leading-relaxed">{page.hero.description}</p>
          )}
        </div>
      </section>

      {/* Proceso de revisión */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {page.steps.map((s, i) => ({ step: String(i + 1).padStart(2, "0"), title: s.title, desc: s.description })).map((s) => (
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
                href={contact.links.usados}
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

      <ContactBanner
        title={page.banner.title}
        subtitle={page.banner.text}
        section="usados"
        buttonLabel={page.banner.button}
      />
    </>
  );
}
