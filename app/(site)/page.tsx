import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import NeedCard from "@/components/NeedCard";
import ProductCard from "@/components/ProductCard";
import ContentCard from "@/components/ContentCard";
import ContactBanner from "@/components/ContactBanner";
import FadeUp from "@/components/FadeUp";
import {
  getContact,
  getFeaturedProducts,
  getHomeActivities,
  getHomePosts,
  getSettings,
  getSettingsImages,
} from "@/lib/content";
import type { NeedIcon } from "@/lib/settings/icons";

const NEED_COLORS = [
  { accentColor: "#2563A8", accentBg: "#E6F1FB" },
  { accentColor: "#3D3D3D", accentBg: "#F0F0F0" },
  { accentColor: "#F5A623", accentBg: "#FFF3DC" },
  { accentColor: "#C47A10", accentBg: "#FAEEDA" },
];

const NEED_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default async function HomePage() {
  const [home, contact, featuredProducts, featuredPosts, activities] = await Promise.all([
    getSettings("home"),
    getContact(),
    getFeaturedProducts(),
    getHomePosts(),
    getHomeActivities(),
  ]);
  const images = await getSettingsImages("home", home);
  const heroImage = home.hero.image ? images.get(home.hero.image) : null;
  const { hero, needs, products, rentalCard, tallerCard, content } = home;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-[#1A1A1A] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {hero.eyebrow && (
              <FadeUp as="p" className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-4">
                {hero.eyebrow}
              </FadeUp>
            )}
            <FadeUp
              as="h1"
              delay={0.12}
              className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {hero.title}
              {hero.titleAccent && (
                <>
                  <br />
                  <em className="text-[#F5A623] not-italic font-light">{hero.titleAccent}</em>
                </>
              )}
            </FadeUp>
            {hero.description && (
              <FadeUp as="p" delay={0.24} className="mt-6 text-lg text-white/75 leading-relaxed max-w-lg">
                {hero.description}
              </FadeUp>
            )}
            <FadeUp className="mt-8 flex flex-wrap gap-4" delay={0.36}>
              <Link
                href={hero.primaryCta.href}
                className="bg-[#F5A623] text-[#1A1A1A] font-semibold px-6 py-3.5 rounded-full hover:bg-[#E08B00] transition-colors"
              >
                {hero.primaryCta.label}
              </Link>
            </FadeUp>

            {/* Activity tags */}
            {activities.length > 0 && (
              <FadeUp className="mt-10 flex flex-wrap gap-2" delay={0.48}>
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
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* Needs Grid */}
      {needs.cards.length > 0 && (
        <section className="py-20 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={needs.eyebrow}
              title={needs.title}
              titleItalic={needs.titleAccent}
              description={needs.description}
            />
            <div className={`grid ${NEED_GRID[needs.cards.length] ?? NEED_GRID[4]} gap-4 mt-10`}>
              {needs.cards.map((card, i) => (
                <NeedCard
                  key={card.title}
                  icon={card.icon as NeedIcon}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  {...NEED_COLORS[i % NEED_COLORS.length]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={products.eyebrow}
              title={products.title}
              titleItalic={products.titleAccent}
              description={products.description}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rental + Taller cards */}
      <section className="py-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rental */}
            <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 flex flex-col gap-5">
              <span className="text-xs font-bold tracking-widest uppercase text-[#F5A623]">
                {rentalCard.eyebrow}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {rentalCard.title}
                <br />
                <em className="font-light not-italic text-[#F5A623]">{rentalCard.titleAccent}</em>
              </h2>
              <p className="text-white/70 leading-relaxed">{rentalCard.description}</p>
              <ul className="space-y-1.5 text-sm text-white/60">
                {rentalCard.bullets.map((b) => (
                  <li key={b}>✓ {b}</li>
                ))}
              </ul>
              <a
                href={contact.links.rental}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit bg-[#F5A623] text-[#1A1A1A] font-semibold px-6 py-3 rounded-full hover:bg-[#E08B00] transition-colors"
              >
                <MessageCircle size={18} />
                {rentalCard.ctaLabel}
              </a>
            </div>

            {/* Taller */}
            <div className="bg-[#F0F0F0] rounded-3xl p-8 md:p-10 flex flex-col gap-5">
              <span className="text-xs font-bold tracking-widest uppercase text-[#3D3D3D]">
                {tallerCard.eyebrow}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {tallerCard.title}
                <br />
                <em className="font-light not-italic text-[#3D3D3D]">{tallerCard.titleAccent}</em>
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed">{tallerCard.description}</p>
              <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
                {tallerCard.bullets.map((b) => (
                  <li key={b}>✓ {b}</li>
                ))}
              </ul>
              <a
                href={contact.links.taller}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit bg-[#1A1A1A] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3D3D3D] transition-colors"
              >
                <MessageCircle size={18} />
                {tallerCard.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      {featuredPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={content.eyebrow}
              title={content.title}
              titleItalic={content.titleAccent}
              description={content.description}
              viewAllHref="/contenido"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {featuredPosts.map((post) => (
                <ContentCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Banner */}
      <ContactBanner />
    </>
  );
}
