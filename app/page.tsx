"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  Tent,
  Wrench,
  MessageCircle,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import NeedCard from "@/components/NeedCard";
import ProductCard from "@/components/ProductCard";
import ContentCard from "@/components/ContentCard";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import { products, posts, activities, WA_LINKS } from "@/lib/data";

function fadeUpProps(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 },
  };
}

const needCards = [
  {
    icon: ShoppingBag,
    title: "Comprar nuevo",
    description: "Equipamento de primera marca con la mejor atención especializada.",
    href: "/comprar",
    accentColor: "#4a7012",
    accentBg: "#EAF3DE",
  },
  {
    icon: Package,
    title: "Buscar usado",
    description: "Equipos revisados y certificados por nuestro taller. La mitad del precio, el doble de confianza.",
    href: "/comprar/usados",
    accentColor: "#C47A10",
    accentBg: "#FAEEDA",
  },
  {
    icon: Tent,
    title: "Alquilar",
    description: "Desde esquís hasta kayaks y carpas. Equipos actualizados para todos los niveles.",
    href: "/alquilar",
    accentColor: "#2563A8",
    accentBg: "#E6F1FB",
  },
  {
    icon: Wrench,
    title: "Reparar",
    description: "El taller especializado en outdoor más completo del país. Más de 60 años de experiencia.",
    href: "/taller",
    accentColor: "#1D9E75",
    accentBg: "#E1F5EE",
  },
];

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);
  const featuredPosts = posts.slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#085041]">
        <Image
          src="/images/hero/home.jpg"
          alt="Paisaje patagónico"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <motion.p
              className="text-xs font-bold tracking-widest uppercase text-[#6EDBB5] mb-4"
              {...fadeUpProps(0)}
            >
              Eurocamping · Desde 1965
            </motion.p>
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
              {...fadeUpProps(0.12)}
            >
              Todo el outdoor
              <br />
              <em className="text-[#6EDBB5] italic font-light">en un solo lugar.</em>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-white/85 leading-relaxed max-w-lg"
              {...fadeUpProps(0.24)}
            >
              Equipamento nuevo y usado, alquiler para tu próxima aventura, y el
              taller de reparaciones más completo de Argentina.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              {...fadeUpProps(0.36)}
            >
              <Link
                href="/comprar"
                className="bg-[#1D9E75] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#0F6E56] transition-colors"
              >
                Ver productos
              </Link>
              <Link
                href="/alquilar"
                className="border border-white/40 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Reservar alquiler
              </Link>
            </motion.div>

            {/* Activity tags */}
            <motion.div
              className="mt-10 flex flex-wrap gap-2"
              {...fadeUpProps(0.48)}
            >
              {activities.map((act) => (
                <Link
                  key={act.label}
                  href={act.href}
                  className="flex items-center gap-1.5 text-sm bg-white/10 text-white/90 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <span>{act.emoji}</span>
                  {act.label}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Needs Grid */}
      <section className="py-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="¿Qué buscás?"
            title="Encontrá lo que necesitás"
            description="Desde equipos nuevos hasta reparaciones. Somos tu base de operaciones outdoor."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {needCards.map((card) => (
              <NeedCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Disponibles ahora"
            title="Elegidos para"
            titleItalic="esta temporada"
            viewAllHref="/comprar"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Rental + Taller cards */}
      <section className="py-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rental */}
            <div className="bg-[#E1F5EE] rounded-3xl p-8 md:p-10 flex flex-col gap-5">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0F6E56]">
                ECOrental
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#085041] leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Alquilá sin
                <br />
                <em className="font-light italic">complicaciones.</em>
              </h2>
              <p className="text-[#0F6E56] leading-relaxed">
                Kayaks, carpas, skis, snowboards, indumentaria y más. Modelos
                actualizados cada temporada. Entrega en destino disponible.
              </p>
              <ul className="space-y-1.5 text-sm text-[#0F6E56]">
                <li>✓ 20% de descuento pagando con 30 días de anticipación</li>
                <li>✓ Cambios ilimitados durante el período de alquiler</li>
                <li>✓ Soporte del taller propio incluido</li>
                <li>✓ Sistema Fastrack: sin colas, entrega en alojamiento</li>
              </ul>
              <a
                href={WA_LINKS.rental}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit bg-[#1D9E75] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0F6E56] transition-colors"
              >
                <MessageCircle size={18} />
                Ver disponibilidad
              </a>
            </div>

            {/* Taller */}
            <div className="bg-[#EAF3DE] rounded-3xl p-8 md:p-10 flex flex-col gap-5">
              <span className="text-xs font-bold tracking-widest uppercase text-[#3a5a0a]">
                Taller ECO
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#3a5a0a] leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Más de 60 años
                <br />
                <em className="font-light italic">reparando aventuras.</em>
              </h2>
              <p className="text-[#4a7012] leading-relaxed">
                Carpas, bolsas de dormir, mochilas, calzado outdoor, tablas de
                ski y más. Trabajo especializado con piezas originales.
              </p>
              <ul className="space-y-1.5 text-sm text-[#4a7012]">
                <li>✓ Recepción y entrega en sucursal Martínez (La Paz 830)</li>
                <li>✓ 20% OFF pagando en efectivo (Nov–Abr)</li>
                <li>✓ Servicio express disponible</li>
                <li>✓ Presupuesto sin costo</li>
              </ul>
              <a
                href={WA_LINKS.taller}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit bg-[#639922] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#4a7012] transition-colors"
              >
                <MessageCircle size={18} />
                Pedir turno
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Contenido ECO"
            title="Trips, tips y"
            titleItalic="aventuras reales."
            description="Historias de personas reales en la naturaleza. Sin filtros ni estudios."
            viewAllHref="/contenido"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {featuredPosts.map((post) => (
              <ContentCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Banner */}
      <WhatsAppBanner />
    </>
  );
}
