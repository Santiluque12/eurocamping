import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { posts } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "No encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const categoryStyle =
    post.category === "ECOtrip"
      ? { bg: "#FFF3DC", text: "#E08B00" }
      : { bg: "#E6F1FB", text: "#2563A8" };

  return (
    <article className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/contenido"
          className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#F5A623] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Volver al contenido
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
          >
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#6b7280]">
            <Clock size={12} />
            {post.readTime} de lectura
          </span>
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-6"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {post.title}
        </h1>
        <p className="text-lg text-[#6b7280] leading-relaxed mb-8">{post.excerpt}</p>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="prose prose-lg max-w-none text-[#1a1a1a]">
          <p>
            Este artículo está en preparación. Pronto tendremos el contenido completo
            de {post.title}.
          </p>
          <p>
            Mientras tanto, podés escribirnos por WhatsApp para más información sobre
            esta aventura o consultar nuestro equipo de expertos.
          </p>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#e5e7eb]">
            <h2
              className="text-2xl font-bold text-[#1a1a1a] mb-6"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/contenido/${p.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <p className="font-semibold text-[#1a1a1a] group-hover:text-[#F5A623] transition-colors text-sm">
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
