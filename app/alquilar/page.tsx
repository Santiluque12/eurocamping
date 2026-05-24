import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Check, MapPin, Clock } from "lucide-react";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import SectionHeader from "@/components/SectionHeader";
import { WA_LINKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alquiler de Equipos Outdoor",
  description:
    "Alquilá kayaks, carpas, skis, snowboards, mochilas e indumentaria con el servicio Fastrack de Eurocamping. El precio más bajo garantizado.",
};

const rentalCategories = [
  {
    name: "Ski & Snowboard",
    icon: "🎿",
    items: [
      { name: "Set completo ski (tablas + fijaciones + bastones)", price: "Desde $22.000/día" },
      { name: "Botas de ski", price: "Desde $8.000/día" },
      { name: "Set snowboard completo", price: "Desde $20.000/día" },
      { name: "Casco", price: "Desde $4.000/día" },
      { name: "Antiparras", price: "Desde $3.500/día" },
      { name: "Fin de semana completo (4x5)", price: "Consultar" },
    ],
  },
  {
    name: "Náutica & Kayak",
    icon: "🚣",
    items: [
      { name: "Kayak simple", price: "Desde $15.000/día" },
      { name: "Kayak doble", price: "Desde $18.000/día" },
      { name: "Kayak de mar simple", price: "Desde $20.000/día" },
      { name: "Paddle surf / SUP", price: "Desde $12.000/día" },
      { name: "Chaleco salvavidas", price: "Incluido" },
    ],
  },
  {
    name: "Camping",
    icon: "🏕",
    items: [
      { name: "Carpa 2 personas", price: "Desde $10.000/día" },
      { name: "Carpa 4 personas", price: "Desde $14.000/día" },
      { name: "Bolsa de dormir", price: "Desde $5.000/día" },
      { name: "Colchoneta autoinflable", price: "Desde $3.500/día" },
      { name: "Mochila trekking 60L", price: "Desde $6.000/día" },
      { name: "Linterna frontal", price: "Desde $1.500/día" },
    ],
  },
  {
    name: "Indumentaria",
    icon: "🧥",
    items: [
      { name: "Campera de ski", price: "Desde $8.000/día" },
      { name: "Pantalón de ski", price: "Desde $6.000/día" },
      { name: "Traje de neoprene", price: "Desde $9.000/día" },
      { name: "Guantes de ski", price: "Desde $2.500/día" },
      { name: "Medias de ski", price: "Desde $1.500/día" },
    ],
  },
];

const ventajas = [
  "Modelos nuevos con actualización permanente cada temporada",
  "El precio más bajo garantizado — encontrás más barato, lo igualamos",
  "Equipos para todos los niveles y edades",
  "Cambios ilimitados durante el período de alquiler",
  "Personal especializado para asesorarte",
  "Soporte del taller propio ante cualquier inconveniente",
  "Sistema Fastrack: sin colas, entrega en alojamiento en centros de ski",
  "20% OFF pagando en efectivo con 30 días de anticipación",
  "Envío de kayaks y carpas: consultar",
  "Créditos para futuras compras",
];

export default function AlquilarPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1D9E75] py-20 overflow-hidden">
        <Image
          src="/images/hero/alquilar.jpg"
          alt="Ski en Patagonia"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E1F5EE] mb-3">
            ECOrental
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Alquilá sin
            <br />
            <em className="italic font-light">complicaciones.</em>
          </h1>
          <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">
            Kayaks, carpas, skis, snowboards y más. Entrega con turno asignado,
            sin esperas, con asesoramiento personalizado.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={WA_LINKS.rental}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#1D9E75] font-bold px-6 py-3.5 rounded-full hover:bg-[#E1F5EE] transition-colors"
            >
              <MessageCircle size={18} />
              Consultar disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Por qué elegir ECOrental"
            title="Todo incluido,"
            titleItalic="nada complicado."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
            {ventajas.map((v) => (
              <div
                key={v}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#e5e7eb]"
              >
                <Check size={18} className="text-[#1D9E75] shrink-0 mt-0.5" />
                <span className="text-sm text-[#1a1a1a]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario orientativo"
            title="¿Qué querés"
            titleItalic="alquilar?"
            description="Precios orientativos. Confirmá disponibilidad y precio final por WhatsApp."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {rentalCategories.map((cat) => (
              <div
                key={cat.name}
                className="border border-[#e5e7eb] rounded-2xl overflow-hidden"
              >
                <div className="bg-[#E1F5EE] px-6 py-4 flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3
                    className="font-bold text-lg text-[#085041]"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {cat.name}
                  </h3>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center px-6 py-3 gap-4"
                    >
                      <span className="text-sm text-[#1a1a1a]">{item.name}</span>
                      <span className="text-sm font-semibold text-[#1D9E75] shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fastrack */}
      <section className="py-16 bg-[#085041]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#1D9E75] mb-3">
                Sistema Fastrack
              </p>
              <h2
                className="text-4xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Sin colas,
                <br />
                <em className="italic font-light text-[#1D9E75]">sin estrés.</em>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Reservá y pagá tu equipo en Buenos Aires antes de llegar al
                centro de ski. Nosotros te lo entregamos en tu alojamiento.
                Arrancás a esquiar desde el primer momento.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  "Ahorrás tiempo y dinero",
                  "Sin colas en el centro de ski",
                  "Sin cupones de tarjeta como garantía",
                  "Sin paquetes completos obligatorios",
                  "Tarifas de leasing para alquileres frecuentes",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#1D9E75]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 text-center">
              <p
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Promoción 4×5
              </p>
              <p className="text-white/70 text-sm mb-4">
                Alquilás 4 unidades y la 5ta la tenés de regalo para tu próximo
                alquiler. Válido en indumentaria, ski/snowboard, náutica y camping.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#1D9E75] font-semibold">
                <MapPin size={14} />
                Solo en sucursal Martínez · La Paz 830
              </div>
              <a
                href={WA_LINKS.rental}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1ea855] transition-colors"
              >
                <MessageCircle size={16} />
                Reservar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="El proceso"
            title="Cómo funciona"
            titleItalic="el alquiler"
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {[
              {
                num: "01",
                title: "Consultá",
                desc: "Escribinos por WhatsApp con los equipos que necesitás, fechas y destino.",
              },
              {
                num: "02",
                title: "Reservá con turno",
                desc: "Te asignamos un turno para retirar sin esperas. Podés pagar en efectivo o transferencia.",
              },
              {
                num: "03",
                title: "Disfrutá",
                desc: "Retirás el equipo en sucursal o te lo llevamos al destino. Cambios ilimitados incluidos.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center gap-4">
                <span
                  className="text-5xl font-bold text-[#1D9E75]/20"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-bold text-[#1a1a1a]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppBanner
        title="Consultá disponibilidad ahora"
        subtitle="Te respondemos en minutos con disponibilidad y precios actualizados."
        waLink={WA_LINKS.rental}
        buttonLabel="Consultar alquiler"
      />
    </>
  );
}
