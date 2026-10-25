import WhatsAppBanner from "@/components/WhatsAppBanner";
import { getContact } from "@/lib/content";

/** Banner de WhatsApp con los datos de “Contacto” de la configuración. */
export default async function ContactBanner(props: {
  title?: string;
  subtitle?: string;
  section?: "general" | "rental" | "taller" | "usados";
  buttonLabel?: string;
}) {
  const { settings, links } = await getContact();
  return (
    <WhatsAppBanner
      title={props.title || settings.contact.bannerTitle}
      subtitle={props.subtitle || settings.contact.hours}
      waLink={links[props.section ?? "general"]}
      buttonLabel={props.buttonLabel || settings.contact.bannerButton}
    />
  );
}
