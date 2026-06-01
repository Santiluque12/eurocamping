import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import { products } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comprar Equipos Outdoor",
  description:
    "Equipamento outdoor nuevo y usado. Marcas como The North Face, Salomon, Mammut y más. Consultá por WhatsApp.",
};

export default function ComprarPage() {
  const nuevos = products.filter((p) => p.type === "nuevo");
  const usados = products.filter((p) => p.type === "usado");
  const rental = products.filter((p) => p.type === "rental");

  return (
    <>
      <section className="bg-[#f9fafb] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
            Catálogo ECO
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Equipate para
            <br />
            <em className="text-[#F5A623] not-italic font-light">tu próxima aventura</em>
          </h1>
          <p className="text-lg text-[#6b7280] max-w-xl">
            Productos nuevos, equipos usados revisados por nuestro taller, y
            equipos en alquiler. Todo en un solo lugar.
          </p>

          {/* Type filters */}
          <div className="flex gap-3 mt-8 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm bg-[#FFF3DC] text-[#F5A623] font-semibold px-4 py-2 rounded-full">
              ● Nuevo
            </span>
            <span className="flex items-center gap-1.5 text-sm bg-[#FAEEDA] text-[#C47A10] font-semibold px-4 py-2 rounded-full">
              ● Revisado ECO (usado)
            </span>
            <span className="flex items-center gap-1.5 text-sm bg-[#E6F1FB] text-[#2563A8] font-semibold px-4 py-2 rounded-full">
              ● Alquiler
            </span>
          </div>
        </div>
      </section>

      {/* Nuevos */}
      {nuevos.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Productos nuevos"
              title="Directo de"
              titleItalic="primera línea"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {nuevos.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Usados */}
      {usados.length > 0 && (
        <section id="usados" className="py-14 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Revisados ECO"
              title="Equipos usados,"
              titleItalic="calidad garantizada"
              description="Cada equipo pasa por nuestro taller antes de la venta. La mitad del precio, el doble de confianza."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {usados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rental preview */}
      {rental.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Disponibles en alquiler"
              title="¿No querés comprarlo?"
              titleItalic="Alquilalo"
              viewAllHref="/alquilar"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {rental.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Externo */}
      <section className="py-14 bg-[#FFF3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E08B00] mb-3">
            También en
          </p>
          <h2
            className="text-3xl font-bold text-[#1A1A1A] mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Encontranos en MercadoLibre y Kalon Sports
          </h2>
          <p className="text-[#7A5A00] mb-6 max-w-lg mx-auto">
            Nuestro catálogo completo también está disponible en nuestras tiendas
            oficiales. Comprá con la garantía de Eurocamping.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://www.mercadolibre.com.ar/tienda/eurocamping"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFE600] text-[#333] font-bold px-6 py-3 rounded-full hover:bg-[#f0d800] transition-colors text-sm"
            >
              Ver en MercadoLibre →
            </a>
            <Link
              href="/alquilar"
              className="bg-[#1A1A1A] text-white font-bold px-6 py-3 rounded-full hover:bg-[#3D3D3D] transition-colors text-sm"
            >
              Ver alquileres →
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppBanner />
    </>
  );
}
