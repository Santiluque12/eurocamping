import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { getContact } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // El contenido sale de la base: se renderiza por request y las consultas
  // quedan en la Data Cache hasta que el administrador las invalida.
  await connection();

  // Si la configuración no carga, el menú y el pie se muestran sin datos de
  // contacto (no se inventan); el error de la página lo muestra error.tsx.
  const contact = await getContact().catch(() => null);

  return (
    <>
      <Navbar waLink={contact?.links.general ?? null} />
      <main className="flex-1">{children}</main>
      <Footer settings={contact?.settings ?? null} />
      {contact && <WhatsAppFloating href={contact.links.general} />}
    </>
  );
}
