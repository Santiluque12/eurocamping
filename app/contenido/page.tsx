import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import ContentCard from "@/components/ContentCard";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "ECOtrips y ECOtips",
  description:
    "Aventuras reales, consejos prácticos y guías de outdoor. ECOtrips y ECOtips de Eurocamping.",
};

export default function ContenidoPage() {
  const trips = posts.filter((p) => p.category === "ECOtrip");
  const tips = posts.filter((p) => p.category === "ECOtip");

  return (
    <>
      <section className="bg-[#f9fafb] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Trips, tips y
            <br />
            <em className="text-[#F5A623] not-italic font-light">aventuras reales</em>
          </h1>
          <p className="text-lg text-[#6b7280] max-w-xl">
            Historias de personas reales en la naturaleza. Sin filtros, sin estudios.
          </p>
        </div>
      </section>

      {trips.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="ECOtrips"
              title="Aventuras para"
              titleItalic="inspirarse"
              description="Rutas, logística y lo que necesitás saber para tu próxima expedición."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {trips.map((post) => (
                <ContentCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {tips.length > 0 && (
        <section className="py-16 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="ECOtips"
              title="Consejos para"
              titleItalic="equiparte mejor"
              description="Guías prácticas escritas por personas que usan el equipo en campo real."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {tips.map((post) => (
                <ContentCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
