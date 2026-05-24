# ECOnline — Eurocamping

Sitio web oficial de Eurocamping, la tienda outdoor más completa de Argentina desde 1965.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para iconos
- **Google Fonts**: Fraunces (display) + DM Sans (body)

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy en Vercel

1. Subir el proyecto a un repositorio GitHub
2. Conectar en [vercel.com](https://vercel.com) → "Import Project"
3. Vercel detecta Next.js automáticamente — click en **Deploy**

No requiere variables de entorno. El número de WhatsApp está en `lib/data.ts`.

## Personalización rápida

### Cambiar número de WhatsApp
En `lib/data.ts` → `WA_NUMBER = "5491162237233"`

### Agregar producto
En `lib/data.ts` → array `products`:
```ts
{
  id: "X", title: "...", type: "nuevo"|"usado"|"rental",
  price: "$XX.000" | null, image: "URL", activities: ["camping"],
  whatsappContext: "descripción para WA"
}
```

### Agregar post
En `lib/data.ts` → array `posts`:
```ts
{ slug: "url-del-post", category: "ECOtrip"|"ECOtip",
  title: "...", excerpt: "...", image: "URL", readTime: "X min", date: "YYYY-MM-DD" }
```
