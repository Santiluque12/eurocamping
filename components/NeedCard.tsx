"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NeedCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  accentColor?: string;
  accentBg?: string;
}

export default function NeedCard({
  icon: Icon,
  title,
  description,
  href,
  accentColor = "#1D9E75",
  accentBg = "#E1F5EE",
}: NeedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="flex flex-col gap-4 bg-white rounded-2xl border border-[#e5e7eb] p-6 h-full group"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accentBg }}
        >
          <Icon size={24} style={{ color: accentColor }} strokeWidth={1.5} />
        </div>
        <div>
          <h3
            className="font-bold text-lg text-[#1a1a1a] mb-1 group-hover:text-[#1D9E75] transition-colors"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {title}
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed">{description}</p>
        </div>
        <span
          className="text-sm font-semibold mt-auto"
          style={{ color: accentColor }}
        >
          Ver más →
        </span>
      </Link>
    </motion.div>
  );
}
