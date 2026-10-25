import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import ContentCard from "@/components/ContentCard";
import { getPosts, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "ECOtrips y ECOtips",
  description:
    "Aventuras reales, consejos prácticos y guías de outdoor. ECOtrips y ECOtips de Eurocamping.",
};

export default async function ContenidoPage() {
  const [page, posts] = await Promise.all([getSettings("contenido"), getPosts()]);
  const trips = posts.filter((p) => p.category === "ECOtrip");
  const tips = posts.filter((p) => p.category === "ECOtip");

  return (
    <>
      <section className="bg-[#f9fafb] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.hero.eyebrow && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
              {page.hero.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight"
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
          {page.hero.description && (
            <p className="text-lg text-[#6b7280] max-w-xl">{page.hero.description}</p>
          )}
        </div>
      </section>

      {trips.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={page.trips.eyebrow}
              title={page.trips.title}
              titleItalic={page.trips.titleAccent}
              description={page.trips.description}
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
              eyebrow={page.tips.eyebrow}
              title={page.tips.title}
              titleItalic={page.tips.titleAccent}
              description={page.tips.description}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {tips.map((post) => (
                <ContentCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="py-16 bg-white">
          <p className="max-w-7xl mx-auto px-4 text-center text-[#6b7280]">
            Pronto vas a encontrar acá nuevas aventuras y consejos.
          </p>
        </section>
      )}
    </>
  );
}
