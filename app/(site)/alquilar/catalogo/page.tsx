import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft, ImageOff } from "lucide-react";
import { getContact, getRentalCatalog, getSettings } from "@/lib/content";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo ECOrental | Eurocamping",
  description:
    "Catálogo completo de equipos en alquiler: indumentaria de nieve, ski, snowboard, camping y náutica. Consultá disponibilidad por WhatsApp.",
};

function ProductCard({ item }: { item: Product }) {
  return (
    <div
      id={item.slug}
      className="bg-[#242424] rounded-xl overflow-hidden border border-[#333] flex flex-col hover:border-[#F5A623] transition-colors group scroll-mt-32"
    >
      <div className="relative h-48 bg-[#333] overflow-hidden shrink-0">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#555]">
            <ImageOff size={32} aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3
          className="text-[#F5A623] font-bold text-sm uppercase tracking-wide leading-snug"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {item.title}
        </h3>
        <p className="text-[#F5A623] font-bold text-base">{item.price ?? "Consultar"}</p>
        {item.description && (
          <p className="text-[#bbb] text-xs leading-relaxed flex-1 line-clamp-4">
            {item.description}
          </p>
        )}
        {item.specLine && (
          <p className="text-[#777] text-xs">{item.specLine}</p>
        )}
        {item.availability === "unavailable" && (
          <p className="text-[#777] text-xs font-semibold">Sin disponibilidad por ahora</p>
        )}
        <a
          href={item.waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#E08B00] text-[#1A1A1A] text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
        >
          <MessageCircle size={14} />
          Consultar disponibilidad
        </a>
      </div>
    </div>
  );
}

export default async function CatalogoPage() {
  const [page, categories, contact] = await Promise.all([getSettings("catalogo"), getRentalCatalog(), getContact()]);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/alquilar"
            className="inline-flex items-center gap-2 text-[#777] hover:text-[#F5A623] text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Ver tarifario
          </Link>
          {page.hero.eyebrow && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
              {page.hero.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight"
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
          {page.hero.description && <p className="text-[#aaa] text-lg max-w-xl">{page.hero.description}</p>}
          <div className="flex gap-3 mt-8 flex-wrap">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-[#2a2a2a] text-[#ccc] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition-colors border border-[#333]"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <nav className="sticky top-16 z-30 bg-[#1A1A1A] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 py-3.5 px-5 text-sm font-semibold text-[#777] hover:text-[#F5A623] border-b-2 border-transparent hover:border-[#F5A623] transition-colors whitespace-nowrap"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {categories.length === 0 && (
        <section className="py-20 bg-[#1A1A1A]">
          <p className="max-w-7xl mx-auto px-4 text-center text-[#aaa]">
            Estamos actualizando el catálogo. Consultanos por WhatsApp.
          </p>
        </section>
      )}

      {/* Category sections */}
      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          className="py-16 bg-[#1A1A1A] scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b-2 border-[#F5A623] pb-3 mb-10">
              <h2
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {cat.label}
                <span className="ml-3 text-base font-normal text-[#777]">
                  {cat.items.length} {cat.items.length === 1 ? "producto" : "productos"}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cat.items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer CTA */}
      <section className="bg-[#111] py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {page.cta.eyebrow && (
            <p className="text-[#F5A623] font-bold text-xs tracking-widest uppercase mb-3">
              {page.cta.eyebrow}
            </p>
          )}
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {page.cta.title}
          </h2>
          <p className="text-[#aaa] mb-8">{page.cta.text}</p>
          <a
            href={contact.links.rental}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#E08B00] text-[#1A1A1A] font-bold px-8 py-4 rounded-full text-base transition-colors"
          >
            <MessageCircle size={20} />
            Consultar disponibilidad
          </a>
        </div>
      </section>
    </>
  );
}
