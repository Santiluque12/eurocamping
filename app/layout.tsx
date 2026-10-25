import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eurocamping · Todo el outdoor en un solo lugar",
    template: "%s · Eurocamping",
  },
  description:
    "Equipamiento outdoor nuevo y usado, alquiler para tu próxima aventura y el taller de reparaciones más completo de Argentina. Desde 1965.",
  keywords: [
    "outdoor Argentina",
    "camping",
    "kayak alquiler",
    "trekking",
    "ski",
    "Eurocamping",
    "ECOnline",
  ],
  openGraph: {
    siteName: "Eurocamping",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${barlowCondensed.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
