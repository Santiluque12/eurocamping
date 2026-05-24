"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { buildWALink } from "@/lib/data";

const typeBadge: Record<
  Product["type"],
  { label: string; bg: string; text: string }
> = {
  nuevo: { label: "Nuevo", bg: "#EAF3DE", text: "#639922" },
  usado: { label: "Revisado ECO", bg: "#FAEEDA", text: "#C47A10" },
  rental: { label: "Alquiler", bg: "#E6F1FB", text: "#2563A8" },
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const badge = typeBadge[product.type];
  const waLink = buildWALink(
    `Hola, vi el sitio y quiero consultar por ${product.whatsappContext || product.title}`
  );

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] flex flex-col"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f9fafb]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span
          className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {product.badge || badge.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-semibold text-[#1a1a1a] leading-snug text-sm">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-[#374151] leading-relaxed flex-1">
            {product.description}
          </p>
        )}
        {product.price ? (
          <p className="text-base font-bold text-[#1D9E75]">{product.price}</p>
        ) : (
          <p className="text-sm text-[#374151]">Consultar precio</p>
        )}

        {/* CTAs */}
        <div className="flex gap-2 mt-auto">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1D9E75] text-white text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-[#0F6E56] transition-colors"
          >
            <MessageCircle size={14} />
            Consultar
          </a>
          {product.externalLink && (
            <a
              href={product.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border border-[#e5e7eb] text-[#1a1a1a] text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-[#f9fafb] transition-colors"
              aria-label="Ver en MercadoLibre"
            >
              <ShoppingCart size={14} />
              MeLi
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
