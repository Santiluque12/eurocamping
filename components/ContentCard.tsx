"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Post } from "@/types";

const categoryStyle: Record<Post["category"], { bg: string; text: string }> = {
  ECOtrip: { bg: "#E1F5EE", text: "#0F6E56" },
  ECOtip: { bg: "#E6F1FB", text: "#2563A8" },
};

interface ContentCardProps {
  post: Post;
}

export default function ContentCard({ post }: ContentCardProps) {
  const style = categoryStyle[post.category];

  return (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/contenido/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#f9fafb] mb-4">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#6b7280]">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>
          <h3
            className="text-xl font-bold text-[#1a1a1a] leading-snug group-hover:text-[#1D9E75] transition-colors"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {post.title}
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed">{post.excerpt}</p>
        </div>
      </Link>
    </motion.div>
  );
}
