import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Check, MapPin, Clock, Wrench } from "lucide-react";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import SectionHeader from "@/components/SectionHeader";
import { WA_LINKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Taller de Reparaciones Outdoor",
  description:
    "El taller especializado en equipos outdoor más completo de Argentina. Carpas, bolsas de dormir, mochilas, calzado, skis y más. Más de 60 años de experiencia.",
};

const services = [
  {
    category: "Carpas y Tiendas",
    icon: "🏕",
    items: [
      "Reparación de costuras y seams",
      "Cambio de cremalleras (zippers)",
      "Impermeabilización de telas",
      "Reparación de varillas y arcos",
      "Parches en tela y malla",
      "Cambio de tirantes y tensores",
    ],
  },
  {
    category: "Bolsas de Dormir",
    icon: "🛏",
    items: [
      "Lavado y secado especializado",
      "Reparación de relleno (plumón/fibra)",
      "Cambio de cremalleras",
      "Parches en tela exterior",
      "Restauración de capucha",
    ],
  },
  {
    category: "Mochilas y Bolsos",
    icon: "🎒",
    items: [
      "Cambio de cremalleras y tiradores",
      "Reparación de sistema de suspensión",
      "Costura de correas y refuerzos",
      "Cambio de hebillas y ajustadores",
      "Impermeabilización",
    ],
  },
  {
    category: "Calzado Outdoor",
    icon: "👟",
    items: [
      "Reenmantequillado (re-soling) de botas",
      "Reparación de puntera y talón",
      "Cambio de cordones especiales",
      "Impermeabilización de cuero y tela",
      "Reparación de cierre de botas de ski",
    ],
  },
  {
    category: "Ski & Snowboard",
    icon: "🎿",
    items: [
      "Afilado de cantos (stone grinding)",
      "Encerado y preparación de base",
      "Reparación de base (P-tex)",
      "Ajuste y montaje de fijaciones",
      "Reparación de botas de ski",
      "Revisión pre-temporada completa",
    ],
  },
  {
    category: "Indumentaria Técnica",
    icon: "🧥",
    items: [
      "Reparación de costuras técnicas",
      "Cambio de cremalleras impermeables",
      "Restauración de DWR (impermeabilización)",
      "Parches en membrana Gore-Tex y similares",
      "Reparación de velcros y corchetes",
    ],
  },
];

const tallerInfo = [
  { icon: MapPin, label: "Dirección", value: "La Paz 830, Martínez, Buenos Aires" },
  { icon: Clock, label: "Recepción", value: "Lun–Vie 11–18hs · Sáb con turno previo" },
  { icon: Wrench, label: "Entrega", value: "Consultar tiempo según trabajo" },
];

export default function TallerPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1A1A1A] py-20 overflow-hidden">
        <Image
          src="/images/hero/taller.jpg"
          alt="Taller de equipos outdoor"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
            Taller ECO
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Más de 60 años
            <br />
            <em className="not-italic font-light text-[#F5A623]">reparando aventuras</em>
          </h1>
          <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">
            El taller especializado en equipos outdoor más completo de Argentina.
            Carpas, bolsas de dormir, mochilas, calzado, esquís y más.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={WA_LINKS.taller}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] font-bold px-6 py-3.5 rounded-full hover:bg-[#E08B00] transition-colors"
            >
              <MessageCircle size={18} />
              Pedir turno
            </a>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-4 mt-10">
            {tallerInfo.map((info) => (
              <div
                key={info.label}
                className="flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full"
              >
                <info.icon size={14} className="text-[#F5A623]" />
                <span>
                  <span className="font-semibold">{info.label}:</span> {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Descuentos y condiciones */}
      <section className="py-12 bg-[#FFF3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: "20% OFF",
                desc: "Pagando en efectivo del 1 Nov al 30 Abr. Sé previsor y ahorrá.",
                color: "#F5A623",
              },
              {
                label: "Servicio Express",
                desc: "+75% de recargo. Para cuando lo necesitás urgente y pagás en efectivo.",
                color: "#C47A10",
              },
              {
                label: "Guardería",
                desc: "Pasados los 15 días del trabajo terminado, se cobra guardado.",
                color: "#3D3D3D",
              },
            ].map((item) => (
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

      {/* Servicios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Lo que reparamos"
            title="Servicios del"
            titleItalic="taller"
            description="Si tu equipo outdoor tiene vida útil, lo reparamos. Consultanos."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <div
                key={service.category}
                className="border border-[#e5e7eb] rounded-2xl overflow-hidden"
              >
                <div className="bg-[#f9fafb] px-6 py-4 flex items-center gap-3 border-b border-[#e5e7eb]">
                  <span className="text-2xl">{service.icon}</span>
                  <h3
                    className="font-bold text-[#1a1a1a] tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {service.category}
                  </h3>
                </div>
                <ul className="p-4 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#1a1a1a]">
                      <Check size={14} className="text-[#F5A623] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifario invierno/verano */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tarifario orientativo"
            title="Precios de"
            titleItalic="referencia"
            description="Los precios finales dependen del trabajo específico. Pedí tu presupuesto sin cargo."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {[
              {
                season: "Temporada Invierno",
                emoji: "❄️",
                items: [
                  { name: "Afilado de cantos + encerado", price: "Desde $8.000" },
                  { name: "Reparación de base (P-tex por cm²)", price: "Desde $500/cm²" },
                  { name: "Montaje de fijaciones", price: "Desde $5.000" },
                  { name: "Service completo ski", price: "Desde $15.000" },
                  { name: "Reparación bota de ski", price: "Consultar" },
                  { name: "Revisión pre-temporada", price: "Desde $12.000" },
                ],
              },
              {
                season: "Temporada Verano",
                emoji: "☀️",
                items: [
                  { name: "Reparación de carpa (por costura)", price: "Desde $3.000" },
                  { name: "Cambio de cremallera (carpa/mochila)", price: "Desde $6.000" },
                  { name: "Impermeabilización de prenda", price: "Desde $5.000" },
                  { name: "Re-soling de bota", price: "Desde $18.000" },
                  { name: "Lavado bolsa de dormir", price: "Desde $4.000" },
                  { name: "Reparación mochila completa", price: "Desde $8.000" },
                ],
              },
            ].map((tarifa) => (
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
                      key={item.name}
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
          <p className="text-xs text-[#6b7280] mt-4 text-center">
            * Precios orientativos en pesos argentinos. Confirmá precio final antes de autorizar el trabajo.
          </p>
        </div>
      </section>

      <WhatsAppBanner
        title="Pedí tu presupuesto sin cargo"
        subtitle="Describinos el trabajo y te respondemos con tiempo estimado y precio."
        waLink={WA_LINKS.taller}
        buttonLabel="Pedir turno en el taller"
      />
    </>
  );
}
