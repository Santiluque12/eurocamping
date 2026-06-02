"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { WA_LINKS } from "@/lib/data";

const navLinks = [
  { label: "Alquilar", href: "/alquilar" },
  { label: "Comprar", href: "/comprar" },
  { label: "Trips & Tips", href: "/contenido" },
  { label: "Taller", href: "/taller" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-eco-black.png"
            alt="Eurocamping Outdoor"
            width={108}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-[#1a1a1a] hover:text-[#F5A623] transition-colors tracking-tight"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sucursales"
            className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
          >
            Sucursales
          </Link>
          <Link
            href="/nosotros"
            className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
          >
            Nosotros
          </Link>
          <a
            href={WA_LINKS.general}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#F5A623] text-[#1A1A1A] text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#E08B00] transition-colors"
          >
            <MessageCircle size={16} />
            Escribinos
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors"
          aria-label="Abrir menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-[#1a1a1a] py-2 border-b border-[#e5e7eb] tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/nosotros"
            onClick={() => setOpen(false)}
            className="text-2xl font-bold text-[#1a1a1a] py-2 border-b border-[#e5e7eb] tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Nosotros
          </Link>
          <a
            href={WA_LINKS.general}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#F5A623] text-[#1A1A1A] text-lg font-semibold px-6 py-4 rounded-full mt-4"
          >
            <MessageCircle size={20} />
            Escribinos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
