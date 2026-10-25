"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, ImageOff } from "lucide-react";
import type { Product } from "@/types";

const typeBadge: Record<
  Product["type"],
  { label: string; bg: string; text: string }
> = {
  nuevo: { label: "Nuevo", bg: "#FFF3DC", text: "#E08B00" },
  usado: { label: "Revisado ECO", bg: "#FAEEDA", text: "#C47A10" },
  rental: { label: "Alquiler", bg: "#E6F1FB", text: "#2563A8" },
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const badge = typeBadge[product.type];

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] flex flex-col"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f9fafb]">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#d1d5db]">
            <ImageOff size={32} aria-hidden />
          </div>
        )}
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
          <p className="text-base font-bold text-[#F5A623]">{product.price}</p>
        ) : (
          <p className="text-sm text-[#374151]">Consultar precio</p>
        )}
        {product.availability === "unavailable" && (
          <p className="text-xs font-semibold text-[#9ca3af]">Sin disponibilidad por ahora</p>
        )}

        {/* CTAs */}
        <div className="flex gap-2 mt-auto">
          <a
            href={product.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5A623] text-[#1A1A1A] text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-[#E08B00] transition-colors"
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
              aria-label={`Ver en ${product.externalLabel || "MercadoLibre"}`}
            >
              <ShoppingCart size={14} />
              {product.externalLabel === "Mercado Libre" || !product.externalLabel ? "MeLi" : product.externalLabel}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
