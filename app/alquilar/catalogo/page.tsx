import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { buildWALink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Catálogo ECOrental | Eurocamping",
  description:
    "Catálogo completo de equipos en alquiler: indumentaria de nieve, ski, snowboard, camping y náutica. Consultá disponibilidad por WhatsApp.",
};

type RentalItem = {
  id: string;
  title: string;
  price: string;
  description: string;
  meta?: string;
  image: string;
};

const BASE = "https://www.eurocampingonline.com.ar/images/productos/";

// ─── INDUMENTARIA + ACCESORIOS ─────────────────────────────────────────────
const indumentaria: RentalItem[] = [
  {
    id: "botas-apreski",
    title: "Botas ApreSki",
    price: "Desde $130.000",
    description:
      "Trespass Dodo Junior. Forro fleece, suela de goma antideslizante, cierre cremallera, resistente al agua.",
    meta: "Talles 27–34 · Negro",
    image: `${BASE}trespass-dodo-junior-01.jpg`,
  },
  {
    id: "campera",
    title: "Campera",
    price: "Desde $325.000",
    description:
      "Trespass Evan Junior. Resistente al viento y agua, impermeabilidad 5.000mm, costuras termoselladas, capucha desmontable.",
    meta: "Talles 2/3 al 11/12 · Flint+Royal",
    image: `${BASE}trespass-evan-junior-01.jpg`,
  },
  {
    id: "pantalon-invierno",
    title: "Pantalón Invierno",
    price: "Desde $195.000",
    description:
      "Trespass Nando Junior. Impermeable 2000mm, windproof, tiradores removibles, cintura elastizada, ventilación lateral.",
    meta: "Talles 9/10 al 13/14 · Negro / Blanco / Aqua",
    image: `${BASE}tespass-nando-junior-01.jpg`,
  },
  {
    id: "conjunto-entero",
    title: "Conjunto Entero",
    price: "Consultar",
    description:
      "Nature Net Entero Baby. Enterito para bebés con cierre en cola, guantes y botitas incluidas cosidas. Capucha y ajuste en cintura.",
    meta: "9m · 18m · 30m",
    image: `${BASE}naturenet-baby-01.jpg`,
  },
  {
    id: "guantes",
    title: "Guantes",
    price: "Desde $104.000",
    description:
      "Trespass Gohan II. Resistentes al agua, acolchados livianos con correa ajustable de muñeca. Carcasa 100% Poliamida.",
    meta: "Talles XS · S · M · L · XL · Negro",
    image: `${BASE}trespass-gohan-II-01.jpg`,
  },
  {
    id: "antiparras",
    title: "Antiparras",
    price: "Desde $184.600",
    description:
      "Trespass Diligent. Doble lente esférica anti-fog ámbar, protección UV 400nm total, grip para casco, vincha regulable.",
    meta: "Blanco + Negro",
    image: `${BASE}trespass-diligent-01.jpg`,
  },
  {
    id: "ice-grip",
    title: "Ice Grip",
    price: "$19.500",
    description:
      "Trespass Ice Grip Clawz. Garras antideslizantes para hielo. Compatible con cualquier calzado. Gomas naturales + acero endurecido. Bolsa incluida.",
    meta: "Talle único",
    image: `${BASE}trespass-clawz-01.jpg`,
  },
  {
    id: "trineo",
    title: "Trineo",
    price: "$13.000",
    description:
      "Trespass Slippy. Plástico 3mm, con manija. Liviano y durable. 58 × 39 × 6 cm.",
    meta: "Negro / Rojo / Rosa",
    image: `${BASE}trespass-slippy-01.jpg`,
  },
  {
    id: "pala-nieve",
    title: "Pala de Nieve",
    price: "$97.500",
    description:
      "Trespass Mr Plow. Pala de emergencia desarmable. Mango y pala de polipropileno, eje cromado. Armada: 95 × 25 cm.",
    meta: "95 × 25 cm armada",
    image: `${BASE}trespass-mr-plow-01.jpg`,
  },
  {
    id: "kit-rescate",
    title: "Kit Rescate Avalancha",
    price: "Desde $910.000",
    description:
      "BCA ECOrental Kit. Beacon Tracker3 + Sonda Stealth 270 + Pala B-1 EXT. Incluye arnés y pilas AAA.",
    meta: "Sistema 3 antenas",
    image: `${BASE}bca-kit-rescate-avalancha-01.jpg`,
  },
  {
    id: "raquetas-nieve",
    title: "Raquetas de Nieve",
    price: "Desde $312.000",
    description:
      "ECO Plastic Snowshoe. Fijaciones regulables para cualquier calzado, crampones en punta. 63 × 24 cm, 950 g.",
    meta: "950 g · 63 × 24 cm",
    image: `${BASE}eco-plastic-snowshoe-01.jpg`,
  },
  {
    id: "polainas",
    title: "Polainas",
    price: "Consultar",
    description:
      "Doite Trekker. Nylon, repele agua, abertura lateral con cierre y correas ajustables. También disponible Ultrex en Cordura 500 Ripstop.",
    meta: "Talles S · M · L · XL",
    image: `${BASE}doite-trekker-tb.jpg`,
  },
  {
    id: "botas-trekking",
    title: "Botas Trekking",
    price: "Desde $171.600",
    description:
      "Trespass Rhone. Cuero impermeable y respirable, suela de goma en una pieza, ojales metálicos. 320 g.",
    meta: "Talles 41–46 · Negro / Marrón",
    image: `${BASE}trespass-rhone-01.jpg`,
  },
  {
    id: "pantalon-trekking",
    title: "Pantalón Trekking",
    price: "Consultar",
    description:
      "Raffike Ghiblis Lady. Desmontable, secado rápido, tiro bajo, bolsillos cargo. Se transforma en pescador.",
    meta: "Talles XXS al XL",
    image: `${BASE}raffike-pantghiblis-01.jpg`,
  },
  {
    id: "cubre-pantalon",
    title: "Cubre Pantalón",
    price: "$91.000",
    description:
      "Trespass Qikpac. Impermeable 5000mm, respirable, costuras selladas. Se guarda en bolsa de malla incluida.",
    meta: "Talles XS–XXL · Negro",
    image: `${BASE}trespass-qikpac-01.jpg`,
  },
  {
    id: "sombrero",
    title: "Sombrero",
    price: "Desde $26.000",
    description:
      "ECO Neck Flap. Tipo australiano, cubre nuca, protección solar, repele agua. 70% Poliester + 30% Nylon.",
    meta: "Talle único · Varios colores",
    image: `${BASE}eco-sombrero-neck-flap-01.jpg`,
  },
];

// ─── SKI + SNOWBOARD ───────────────────────────────────────────────────────
const ski: RentalItem[] = [
  {
    id: "esquis",
    title: "Esquís",
    price: "Desde $130.000",
    description:
      "Elan, Kästle, Salomon, Pale, Rossignol, Roxy. Desde 90 cm a 180+ cm. Para principiantes, intermedios y avanzados.",
    meta: "4 páginas de modelos disponibles",
    image: `${BASE}elan-voyager-tb.jpg`,
  },
  {
    id: "snowboard",
    title: "Snowboard",
    price: "Desde $130.000",
    description:
      "Burton, Rossignol. Modelos para niños y adultos. All-mountain, freestyle, freeride. Con opción de fijaciones.",
    meta: "2 páginas de modelos",
    image: `${BASE}burton-family-tree-tb.jpg`,
  },
  {
    id: "botas-ski",
    title: "Botas de Ski",
    price: "Desde $130.000",
    description:
      "Rossignol, Dalbello. Para principiantes, intermedios y expertos. Flex 50 a 120. También repuestos: escarpines, ganchos, tacos.",
    meta: "2 páginas de modelos",
    image: `${BASE}dalbello-lupo-tb.jpg`,
  },
  {
    id: "cascos",
    title: "Cascos",
    price: "Desde $52.000",
    description:
      "ECO, Trespass, Rossignol, Carrera. Para adultos, mujer y junior. Con y sin ventilación, unisex y específicos.",
    meta: "2 páginas de modelos",
    image: `${BASE}casco-eco-zolo-th.jpg`,
  },
];

// ─── CAMPING ───────────────────────────────────────────────────────────────
const camping: RentalItem[] = [
  {
    id: "carpa-1-4",
    title: "Carpa 1 a 4 PAX",
    price: "Desde $390.000",
    description:
      "Trespass Ghabhar 4. Doble piel, impermeable 1500mm, retardante fuego ISO 6940. 285 × 240 × 130 cm. 4,3 kg.",
    meta: "4,3 kg · 285 × 240 × 130 cm · Naranja / Azul",
    image: `${BASE}trespass-carpa-ghabhar-01.jpg`,
  },
  {
    id: "carpa-5-6",
    title: "Carpa 5 a 6 PAX",
    price: "Consultar",
    description:
      "National Geographic Rockport V. 5 personas, 1500mm, piso polietileno, gancho para lámpara, bolsillos malla. 5,3 kg.",
    meta: "5,3 kg · 4 m × 2,6 m",
    image: `${BASE}national-geographic-rockport-5-pax-01.jpg`,
  },
  {
    id: "carpa-comedor",
    title: "Carpa Comedor",
    price: "Desde $390.000",
    description:
      "Waterdog Screenhouse. 3 × 3 m, mosquitero poly mesh, 2 entradas + 2 ventanas, costuras termoselladas, protección UV. 6,5 kg.",
    meta: "6,5 kg · 3 × 3 × 2 m",
    image: `${BASE}waterdog-screenhouse-01.jpg`,
  },
  {
    id: "carpa-alta-montana",
    title: "Carpa Alta Montaña",
    price: "Consultar",
    description:
      "Doite Kailas. 3 personas, 3000mm, tratamiento UV, varillas duraluminium 9,5mm. 2,20 × 1,90 × 1,10 m. 5 kg.",
    meta: "5 kg · 2,2 × 1,9 × 1,1 m",
    image: `${BASE}doite-kailas-01.jpg`,
  },
  {
    id: "bolsa-2est",
    title: "Bolsa de Dormir 2 Estaciones",
    price: "Desde $65.000",
    description:
      "Trespass Snooze. Confort +12°C, límite +8°C. Rectangular, cierre bidireccional. 220 × 75 cm. 1,4 kg.",
    meta: "+8°C a +18°C · 1,4 kg",
    image: `${BASE}trespass-snooze-01.jpg`,
  },
  {
    id: "bolsa-3est",
    title: "Bolsa de Dormir 3 Estaciones",
    price: "Desde $143.000",
    description:
      "Trespass Doze. Confort +13°C, límite 0°C, extremo -3°C. Cierre bidireccional, bolso de compresión. 1,7 kg.",
    meta: "-3°C a +22°C · 1,7 kg",
    image: `${BASE}trespass-doze-01.jpg`,
  },
  {
    id: "bolsa-alta-montana",
    title: "Bolsa de Dormir Alta Montaña",
    price: "Desde $253.500",
    description:
      "Trespass Echotec. 4 estaciones, tipo momia. Confort +5°C, límite -10°C, extremo -15°C. Relleno 300 g/m². 2,2 kg.",
    meta: "-15°C a +5°C · 2,2 kg",
    image: `${BASE}trespass-echotec-01.jpg`,
  },
  {
    id: "bolsa-liner",
    title: "Bolsa de Dormir Liner",
    price: "Consultar",
    description:
      "National Geographic Liner. Saco sábana algodón 100%, formato sarcófago. Ideal hostales y refugios. 220 × 80 cm. 270 g.",
    meta: "270 g · 220 × 80 cm",
    image: `${BASE}national-geographic-linner-01.jpg`,
  },
  {
    id: "aislante",
    title: "Aislante",
    price: "Desde $6.500",
    description:
      "ECO Colchoneta Aluminio 10mm. Espuma PU aluminizada, no absorbe agua, liviana. 180 × 50 cm, 10mm espesor.",
    meta: "180 × 50 cm · 10mm",
    image: `${BASE}colchoneta-eco-aluminio10mm-01.jpg`,
  },
  {
    id: "aislante-alta-montana",
    title: "Aislante Alta Montaña",
    price: "Consultar",
    description:
      "Doite Eco Wavy. Tridimensional moldeada, poliuretano alta densidad. No inflable, no absorbe humedad. 1,80 × 0,50 m. 360 g.",
    meta: "360 g · 1,80 × 0,50 m",
    image: `${BASE}doite-ecowavy-01.jpg`,
  },
  {
    id: "colchoneta-autoinflable",
    title: "Colchoneta Autoinflable",
    price: "Desde $136.500",
    description:
      "Trespass Serene. Se infla en 4–7 soplos, waterproof, válvula push rápida. 188 × 65 × 7 cm. 2,75 kg.",
    meta: "2,75 kg · 188 × 65 × 7 cm",
    image: `${BASE}trespass-serene-autoinflable-01.jpg`,
  },
  {
    id: "colchon-single",
    title: "Colchón Inflable Single",
    price: "Desde $58.500",
    description:
      "Trespass Blimp. 1 plaza, superficie flocada, estructura en espiral interna. 185 × 74 × 13 cm. Máx 140 kg. (Sin inflador)",
    meta: "185 × 74 × 13 cm · Máx 140 kg",
    image: `${BASE}trespass-blimp-01.jpg`,
  },
  {
    id: "colchon-doble",
    title: "Colchón Inflable Doble",
    price: "Desde $84.500",
    description:
      "Trespass Duoblimp. 2 plazas, infla/desinfla en 3 min, kit de reparación incluido. 185 × 137 × 13 cm. Máx 290 kg.",
    meta: "185 × 137 × 13 cm · Máx 290 kg",
    image: `${BASE}trespass-duoblimp-01.jpg`,
  },
  {
    id: "inflador-5000",
    title: "Inflador 5000CC",
    price: "Consultar",
    description:
      "Doite Inflador 5000CC. Doble acción, alta circulación de aire, picos intercambiables, manguera flexible.",
    meta: "30 × 22 × 8 cm plegado",
    image: `${BASE}doite-5000CC-01.jpg`,
  },
  {
    id: "inflador-electrico",
    title: "Inflador Eléctrico",
    price: "$104.000",
    description:
      "Trespass Cyclone. Inalámbrico, 200 L/min, 8 minutos autonomía, modos inflar/desinflar, 3 adaptadores. Carga USB.",
    meta: "390 g · 10 × 10 × 10 cm",
    image: `${BASE}trespass-cyclone-01.jpg`,
  },
  {
    id: "mochila",
    title: "Mochila (10–85 lt)",
    price: "Desde $325.000",
    description:
      "Trespass Trek 66. 66 litros, asas acolchadas, cinturón lumbar, protector de lluvia incluido. Polyester 600D Ripstop PVC. 2,05 kg.",
    meta: "2,05 kg · 50 × 35 × 72 cm",
    image: `${BASE}trespass-trek-66-01.jpg`,
  },
  {
    id: "mochila-bebe",
    title: "Mochila Porta Bebé",
    price: "Consultar",
    description:
      "Doite Kiddy. Anatómica, múltiples compartimientos, apoya cabeza, mudador. Capacidad hasta 16 kg de niño.",
    meta: "",
    image: `${BASE}doite-kiddy-01.jpg`,
  },
  {
    id: "mochila-hidrante",
    title: "Mochila Hidrante",
    price: "Consultar",
    description:
      "Navajo Eco con Hidrante. 8 litros + bolsa hidrante 2 litros. Para running y ciclismo. Nylon Ripstop, cinta reflectiva.",
    meta: "",
    image: `${BASE}navajo-ecohidrante-01.jpg`,
  },
  {
    id: "baston",
    title: "Bastón Trekking (par)",
    price: "Desde $36.400",
    description:
      "Masters Walk 3 secciones. Sistema anti-shock. Cerrado 60 cm, máximo 130 cm. 290 g. Precio por unidad.",
    meta: "290 g · 60–130 cm",
    image: `${BASE}masters-walk3-01.jpg`,
  },
  {
    id: "silla-3en1",
    title: "Silla 3 en 1",
    price: "Desde $104.000",
    description:
      "Trespass Jubilee. Mochila + silla liviana + bolso térmico 1,8 L. 1 kg. Ideal picnic y excursiones. 44 × 37 × 33 cm abierta.",
    meta: "1 kg · Bolso térmico 1,8 L",
    image: `${BASE}trespass-jubilee-01.jpg`,
  },
  {
    id: "mesa",
    title: "Mesa (4 PAX)",
    price: "Consultar",
    description:
      "Coleman Exponent. Centro de preparación outdoor. Aluminio resistente, estante lateral, fregadero removible, tableros de juegos.",
    meta: "1,80 × 1,25 m abierta",
    image: `${BASE}coleman-exponent-01.jpg`,
  },
  {
    id: "marmita",
    title: "Marmita",
    price: "Consultar",
    description: "Brogas Set 7 piezas para 2 personas.",
    meta: "",
    image: `${BASE}brogas-marmitasx2-01.jpg`,
  },
  {
    id: "calentador",
    title: "Calentador",
    price: "Desde $97.500",
    description:
      "Brogas Plus 410. Gas butano, encendido electrónico, incluye adaptador y funda. 24 × 19 × 7 cm. 250 g.",
    meta: "250 g",
    image: `${BASE}brogas-plus-410-01.jpg`,
  },
  {
    id: "linterna",
    title: "Linterna Frontal",
    price: "$52.000",
    description:
      "Trespass Blackout. 250 lúmenes, haz enfocado + amplio, 5 posiciones de inclinación. Funciones: ambiente, alta y señal. 95 g.",
    meta: "250 lm · 95 g",
    image: `${BASE}trespass-blackout-01.jpg`,
  },
  {
    id: "conservadora",
    title: "Conservadora (36–48QT)",
    price: "Consultar",
    description:
      "Coleman 48QT. Insulación Thermozone, tapa hermética, 2 manijas. Capacidad 63 latas. 63 × 34 × 37 cm.",
    meta: "63 × 34 × 37 cm · 48QT",
    image: `${BASE}coleman-48Q-01.jpg`,
  },
  {
    id: "termo",
    title: "Termo 7,6 lt",
    price: "Consultar",
    description:
      "Coleman 7,6 litros. Para bebidas frías. Boca ancha, pico vertedor, canilla inferior. 33 cm altura. Polietileno.",
    meta: "33 cm × 23 cm diám.",
    image: `${BASE}coleman-76l-01.jpg`,
  },
  {
    id: "parrilla",
    title: "Parrilla Enrollable",
    price: "$117.000",
    description:
      "ECO Enrollable. Hierro zincado, varillas trefiladas 6mm, patas reforzadas, manijas laterales, funda de tela. 60 × 40 cm. 3,9 kg.",
    meta: "3,9 kg · 60 × 40 cm",
    image: `${BASE}eco-parrilla-enrollable-01.jpg`,
  },
  {
    id: "binocular",
    title: "Binocular",
    price: "Consultar",
    description:
      "Hokenn Orbital 10×50. Campo visual 99m a 1000m, lentes ruby/fmg azul, prisma Porro BAK-7, resistente al agua, adaptable a trípode.",
    meta: "",
    image: `${BASE}hokenn-orbital10-50-01.jpg`,
  },
  {
    id: "telescopio",
    title: "Telescopio",
    price: "Consultar",
    description:
      "Max U See F360×50. 3 lentes, espejo zenital, trípode. Apertura 50mm, focal 360mm. Para principiantes.",
    meta: "850 g · 43 × 21 × 11 cm",
    image: `${BASE}maxusee-telescopio-F360x50-01.jpg`,
  },
  {
    id: "tanque-agua",
    title: "Tanque de Agua",
    price: "Desde $325.000",
    description:
      "Oasis Tank. Para vehículos outdoor. Manguera 360°, válvula llenado/vaciado. Disponible en 10 / 15 / 20 / 25 litros.",
    meta: "10 lt · 15 lt · 20 lt · 25 lt",
    image: `${BASE}tanque-de-agua-oasis-tank-01.jpg`,
  },
];

// ─── NÁUTICA ────────────────────────────────────────────────────────────────
const nautica: RentalItem[] = [
  {
    id: "kayak-simple",
    title: "Kayak Simple + 1 Remo",
    price: "Desde $286.000",
    description:
      "Atlantikayak K1. Abierto, inhundible, autovaciable, quilla-timón. 2,65m eslora × 0,72m manga. 20 kg. Máx 100 kg.",
    meta: "2,65 × 0,72 m · 20 kg",
    image: `${BASE}atlantikayak-k1-01.jpg`,
  },
  {
    id: "kayak-doble",
    title: "Kayak Doble + 2 Remos",
    price: "Desde $598.000",
    description:
      "Atlantikayak Triplo. 2 cockpits, capacidad 3 personas. Gran desempeño en olas de mar. 3,95 × 0,85 m. 33 kg.",
    meta: "3,95 × 0,85 m · 33 kg",
    image: `${BASE}atlantik-triplo-01.jpg`,
  },
  {
    id: "kayak-rigido",
    title: "Kayak Rígido Desarmable",
    price: "Desde $481.000",
    description:
      "Leos Kayak Alumine. Desarmable en 2 mitades estancas. Ideal pesca y paseo. 2,85 × 0,76 m. 23 kg. Máx 120 kg.",
    meta: "2,85 × 0,76 m · 23 kg",
    image: `${BASE}leos-alumine-01.jpg`,
  },
  {
    id: "sup-rigido",
    title: "Stand Up Paddle Rígido",
    price: "Desde $520.000",
    description:
      "Atlantikayak SUP. Diseño estable e hidrodinámico. Polietileno roto-moldeado, musleras para remar sentado. 3,30 × 0,83 m. Máx 90 kg.",
    meta: "3,30 × 0,83 m",
    image: `${BASE}atlantikayak-sup-01.jpg`,
  },
  {
    id: "sup-inflable",
    title: "Stand Up Paddle Inflable",
    price: "Desde $975.000",
    description:
      "Swell Allround. 10.2 × 32 × 4 pulgadas. Incluye quilla 7 pulgadas, inflador doble accion, leash 10 pies, remo 3 partes y mochila. Max 85 kg.",
    meta: "Máx 85 kg · Kit completo",
    image: `${BASE}swell-allroundinflable-01.jpg`,
  },
  {
    id: "surfboard",
    title: "Surf Board (Softboard)",
    price: "Desde $520.000",
    description:
      "Mare Surfboard Fun 7'5. Para principiantes, material soft anti-impacto. 226 × 55 × 7 cm. 51,4 L. 4,25 kg. Máx 90 kg.",
    meta: "226 × 55 × 7 cm · 4,25 kg",
    image: `${BASE}mare-fun-7-5-01.jpg`,
  },
  {
    id: "skimboard",
    title: "Skimboard",
    price: "Consultar",
    description:
      "Cachalote Rental. Madera Maple laminada. Para practicar en la playa con olas de orilla. 112 × 48 cm.",
    meta: "112 × 48 cm",
    image: `${BASE}cachalote-rental-01.jpg`,
  },
  {
    id: "kayak-inflable-simple",
    title: "Kayak Inflable Simple",
    price: "Consultar",
    description:
      "Sevylor K1 Quikpak. Se pliega en sí mismo. PVC 21 gauge. 2,40 × 0,90 m. Incluye paleta aluminio y bomba. Máx 180 kg.",
    meta: "2,40 × 0,90 m",
    image: `${BASE}sevylor-k1quikpak-01.jpg`,
  },
  {
    id: "kayak-inflable-doble",
    title: "Kayak Inflable Doble",
    price: "Consultar",
    description:
      "Sevylor Colorado. Tipo canoa, estabilidad + maniobra. Ideal aguas con oleaje, pesca y buceo. 3,35 × 0,95 m. Máx 225 kg.",
    meta: "3,35 × 0,95 m · Máx 225 kg",
    image: `${BASE}sevylor-colorado-01.jpg`,
  },
  {
    id: "packraft",
    title: "Packraft",
    price: "Desde $975.000",
    description:
      "ECO Bote Packraft 2. 310 × 110 × 35 cm inflado. PVC Ripstop 600. Máx 227 kg. Plegado 35 × 35 × 50 cm. 9 kg. Para backcountry.",
    meta: "9 kg · Plegado 35 × 35 × 50 cm",
    image: `${BASE}eco-bote-packraft-2-01.jpg`,
  },
  {
    id: "isla-flotante",
    title: "Isla Flotante",
    price: "$780.000",
    description:
      "ECO Remolcable. Plataforma inflable recreativa. 260 × 250 × 25 cm. Cap. 700 kg. PVC 900 micrones. 17 kg.",
    meta: "260 × 250 × 25 cm · 17 kg",
    image: `${BASE}eco-isla-flotante-01.jpg`,
  },
  {
    id: "remolque",
    title: "Remolque",
    price: "Consultar",
    description:
      "Sportsstuff Thrash Half Pipe. Lados angulados para gran estabilidad. Múltiples manijas. 1,50 × 1,50 m.",
    meta: "1,50 × 1,50 m",
    image: `${BASE}sportsstuff-thrashhalfpipe7661-02m.jpg`,
  },
  {
    id: "chaleco",
    title: "Chaleco Salvavidas",
    price: "Desde $58.500",
    description:
      "Atlantikayak Salvavidas. Espuma de celda cerrada. Talles 6/8/10/12/14 (hasta 140 kg). Dispositivo de flotación homologado.",
    meta: "Talles hasta 140 kg",
    image: `${BASE}atlantikayak-salvavidas-kayak-01.jpg`,
  },
  {
    id: "porta-kayak",
    title: "Porta Kayak",
    price: "Desde $195.000",
    description:
      "Atlantikayak Porta Equipaje Desmontable. Rack universal para cualquier vehículo, sin herramientas, 5 posiciones de amarre.",
    meta: "",
    image: `${BASE}atlantikayak-desmontable-01.jpg`,
  },
  {
    id: "carrito",
    title: "Carrito Portador",
    price: "Consultar",
    description:
      "Liviano y desarmable, gran capacidad de carga. Ideal para kayaks y tablas de windsurf.",
    meta: "",
    image: `${BASE}carrito-portador-01.jpg`,
  },
  {
    id: "traje-neoprene",
    title: "Traje Neoprene",
    price: "Consultar",
    description:
      "National Geographic Shorty. Manga corta, espesor 2mm, mayor flotabilidad. Ideal para principiantes.",
    meta: "",
    image: `${BASE}nationalgeographic-shorty-01.jpg`,
  },
  {
    id: "botas-nauticas",
    title: "Botas Náuticas",
    price: "Desde $75.400",
    description:
      "Hydrox Linux 3mm. Neoprene 3mm, suela antideslizante, ribeteada con lycra.",
    meta: "Talles XS al XL",
    image: `${BASE}hydrox-linux-01.jpg`,
  },
  {
    id: "funda-estanca",
    title: "Funda Estanca (Teléfono)",
    price: "Desde $78.000",
    description:
      "Aquapac Funda Extreme. Impermeabilidad IPX8 (10m), sistema Dock para accesorios, compatible con la mayoría de smartphones.",
    meta: "",
    image: `${BASE}aquapac-funda-extreme-01.jpg`,
  },
  {
    id: "snorkel",
    title: "Snorkel",
    price: "Consultar",
    description:
      "National Geographic Swordfish. Máscara + snorkel. Gran campo visual, lente templado, silicona hipoalergénica. Apto pileta, río, lago y mar.",
    meta: "",
    image: `${BASE}ng-swordfish-01.jpg`,
  },
  {
    id: "patas-rana",
    title: "Patas de Rana",
    price: "Consultar",
    description:
      "National Geographic Tuna 44. Pie cerrado, alta calidad para snorkeling. Colores azul + amarillo.",
    meta: "Talles S/M y M/L",
    image: `${BASE}nationalgeographic-tuna44-01.jpg`,
  },
];

// ─── CATEGORÍAS ─────────────────────────────────────────────────────────────
const categories = [
  { id: "indumentaria", label: "Indumentaria", items: indumentaria },
  { id: "ski", label: "Ski + Snowboard", items: ski },
  { id: "camping", label: "Camping", items: camping },
  { id: "nautica", label: "Náutica", items: nautica },
];

function ProductCard({ item }: { item: RentalItem }) {
  const waLink = buildWALink(
    `Hola, quiero consultar disponibilidad de alquiler: ${item.title}`
  );
  return (
    <div
      id={item.id}
      className="bg-[#242424] rounded-xl overflow-hidden border border-[#333] flex flex-col hover:border-[#F5A623] transition-colors group scroll-mt-32"
    >
      <div className="relative h-48 bg-[#333] overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3
          className="text-[#F5A623] font-bold text-sm uppercase tracking-wide leading-snug"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {item.title}
        </h3>
        <p className="text-[#F5A623] font-bold text-base">{item.price}</p>
        <p className="text-[#bbb] text-xs leading-relaxed flex-1 line-clamp-4">
          {item.description}
        </p>
        {item.meta && (
          <p className="text-[#777] text-xs">{item.meta}</p>
        )}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#E08B00] text-[#1A1A1A] text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
        >
          <MessageCircle size={14} />
          Consultar disponibilidad
        </a>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/alquilar"
            className="inline-flex items-center gap-2 text-[#777] hover:text-[#F5A623] text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Ver tarifario
          </Link>
          <p className="text-xs font-bold tracking-widest uppercase text-[#F5A623] mb-3">
            ECOrental
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Catálogo completo
            <br />
            <em className="text-[#F5A623] not-italic font-light">de alquiler</em>
          </h1>
          <p className="text-[#aaa] text-lg max-w-xl">
            Indumentaria de nieve, ski, snowboard, camping y náutica. Todo listo para tu próxima aventura.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-[#2a2a2a] text-[#ccc] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition-colors border border-[#333]"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <nav className="sticky top-16 z-30 bg-[#1A1A1A] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 py-3.5 px-5 text-sm font-semibold text-[#777] hover:text-[#F5A623] border-b-2 border-transparent hover:border-[#F5A623] transition-colors whitespace-nowrap"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Category sections */}
      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          className="py-16 bg-[#1A1A1A] scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b-2 border-[#F5A623] pb-3 mb-10">
              <h2
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {cat.label}
                <span className="ml-3 text-base font-normal text-[#777]">
                  {cat.items.length} productos
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cat.items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer CTA */}
      <section className="bg-[#111] py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-[#F5A623] font-bold text-xs tracking-widest uppercase mb-3">
            ¿No encontrás lo que buscás?
          </p>
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Escribinos por WhatsApp
          </h2>
          <p className="text-[#aaa] mb-8">
            Nuestro equipo te ayuda a armar el kit ideal para tu actividad.
          </p>
          <a
            href={buildWALink("Hola, quiero consultar disponibilidad de alquiler")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#E08B00] text-[#1A1A1A] font-bold px-8 py-4 rounded-full text-base transition-colors"
          >
            <MessageCircle size={20} />
            Consultar disponibilidad
          </a>
        </div>
      </section>
    </>
  );
}
