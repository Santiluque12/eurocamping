"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { WA_LINKS } from "@/lib/data";

const navLinks = [
  { label: "Trips & Tips", href: "/contenido" },
  { label: "Comprar", href: "/comprar" },
  { label: "Alquilar", href: "/alquilar" },
  { label: "Taller", href: "/taller" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span
            className="font-display text-2xl font-bold tracking-tight text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            EC
            <span className="text-[#1D9E75]">O</span>
            nline
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
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
            className="flex items-center gap-2 bg-[#1D9E75] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#0F6E56] transition-colors"
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
              className="text-2xl font-medium text-[#1a1a1a] py-2 border-b border-[#e5e7eb]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/nosotros"
            onClick={() => setOpen(false)}
            className="text-2xl font-medium text-[#1a1a1a] py-2 border-b border-[#e5e7eb]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Nosotros
          </Link>
          <a
            href={WA_LINKS.general}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#1D9E75] text-white text-lg font-semibold px-6 py-4 rounded-full mt-4"
          >
            <MessageCircle size={20} />
            Escribinos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
