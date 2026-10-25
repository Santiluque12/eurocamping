import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administración", template: "%s · Admin Eurocamping" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f3f4f6] text-[#1a1a1a]">{children}</div>;
}
