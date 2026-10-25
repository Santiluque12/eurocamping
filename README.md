# ECOnline — Eurocamping

Sitio web de Eurocamping, la tienda outdoor más completa de Argentina desde 1965,
con panel de administración en `/admin`.

- **Guía para quien administra el contenido:** [docs/GUIA-ADMINISTRADOR.md](docs/GUIA-ADMINISTRADOR.md)

## Arquitectura

| Pieza | Tecnología |
| --- | --- |
| Sitio y panel | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Base de datos | Supabase PostgreSQL, con Row Level Security (RLS) |
| Usuarios del panel | Supabase Auth (email + contraseña, sin registro público) |
| Imágenes | Supabase Storage, bucket público `media` (5 MB, JPG/PNG/WebP/AVIF/GIF) |
| Editor de publicaciones | Tiptap; el HTML se sanitiza en el servidor al guardar y al mostrar |

**Flujo de datos**

- La web pública lee con la clave anónima (`lib/content`). RLS sólo devuelve contenido
  publicado y visible: los borradores no salen en ninguna consulta pública, aunque
  la persona tenga sesión iniciada.
- Las lecturas públicas quedan en la caché de Next con etiquetas (`lib/supabase/public.ts`).
  Cada acción del panel invalida las etiquetas afectadas (`updateTag`), así que los
  cambios se ven al instante, sin recompilar ni desplegar.
- Si la base no responde, las páginas muestran un estado de error (`app/(site)/error.tsx`);
  no hay datos de respaldo en el código.
- Cada Server Action del panel verifica sesión y permiso (`lib/admin/action.ts`), valida
  con zod (`lib/admin/schemas.ts`) y escribe con la sesión del usuario, por lo que RLS
  vuelve a controlar el permiso en la base.
- Todas las tablas registran `created_at/by` y `updated_at/by`, y un historial en
  `audit_log` (se ve en “Últimos cambios” del inicio del panel).

**Estructura**

```
app/(site)/            páginas públicas
app/admin/             panel (login, recuperación y secciones)
lib/content/           consultas públicas
lib/admin/             autorización, acciones y validación del panel
lib/settings/spec.ts   campos editables de cada página (valida y arma el formulario)
supabase/migrations/   esquema, seguridad (RLS) y Storage
scripts/               importador inicial y alta de administradores
```

## Desarrollo local

Requisitos: Node 20+, Docker Desktop abierto.

```bash
npm install
npm run db:start                 # Supabase local (API en http://127.0.0.1:54421)
cp .env.example .env.local       # completar con los datos que muestra db:start
npm run db:import                # carga el contenido inicial
npm run admin:create -- --email vos@eurocamping.com.ar --name "Tu Nombre"
npm run dev                      # http://localhost:3000 y http://localhost:3000/admin
```

- Supabase Studio local: http://127.0.0.1:54423
- Mails locales (recuperación de contraseña): http://127.0.0.1:54424
- `npm run db:reset` recrea la base desde las migraciones (borra los datos locales).
- `npm run db:types` regenera `lib/supabase/database.types.ts` tras cambiar el esquema.

## Variables de entorno

Documentadas en [.env.example](.env.example).

| Variable | Dónde | Notas |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel y `.env.local` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel y `.env.local` | clave pública (anon / publishable) |
| `NEXT_PUBLIC_SITE_URL` | Vercel y `.env.local` | dominio del sitio; se usa en el mail de recuperación |
| `SUPABASE_SERVICE_ROLE_KEY` | **sólo** `.env.local` de una computadora de confianza | la usan el importador y `admin:create`. Nunca en Vercel ni con prefijo `NEXT_PUBLIC_` |

## Puesta en producción

> ⚠️ Vercel despliega automáticamente cada push a `main`. Si se sube este código antes
> de cargar las variables de Supabase en Vercel, **el sitio en producción muestra la
> página de error**. Hacé los pasos 1 a 5 antes de hacer push a `main`.

1. **Crear el proyecto** en [supabase.com](https://supabase.com) (región São Paulo, la más
   cercana).
2. **Aplicar las migraciones**:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-del-proyecto>
   npx supabase db push
   ```
3. **Configurar Auth** en el panel de Supabase:
   - *Authentication → Sign In / Providers*: desactivar **Allow new users to sign up**.
     Dejar **Email** habilitado (es el ingreso de los administradores).
   - *Authentication → URL Configuration*: **Site URL** = dominio del sitio
     (`https://www.…`), y en **Redirect URLs** agregar `https://<dominio>/auth/confirm`.
   - *Authentication → SMTP*: configurar un servidor de correo propio. El de Supabase
     sólo envía unos pocos mails por hora y está pensado para pruebas.
4. **Cargar el contenido y el primer administrador** desde una computadora de confianza,
   con un `.env.local` que apunte al proyecto de producción (URL, anon key y service role key
   de *Project Settings → API*):
   ```bash
   npm run db:import -- --dry-run   # revisar qué va a crear
   npm run db:import                # crea; se puede repetir sin duplicar
   npm run admin:create -- --email persona@eurocamping.com.ar --name "Nombre Apellido"
   ```
   `admin:create` muestra una contraseña temporal una sola vez; la persona la cambia
   desde “¿Olvidaste tu contraseña?”. Para dar de baja: `-- --email … --disable`.
   El reporte `scripts/output/import-report.md` lista el contenido incompleto a revisar.
5. **Variables en Vercel** (*Project → Settings → Environment Variables*, Production y
   Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `NEXT_PUBLIC_SITE_URL`.
6. Push a `main` (o redeploy) y probar `/admin`.

## Importador inicial

`scripts/import-legacy.ts` traslada el contenido que antes estaba en el código
(`scripts/legacy/`): productos, equipos y tarifario, publicaciones, sucursales, taller,
marcas, categorías, actividades y textos de cada página. Cada registro tiene una clave
estable (slug o `legacy_key`) y se inserta sólo si no existe: repetirlo **no duplica ni
pisa** lo que se haya editado después en el panel.

## Copiar imágenes externas a Storage

Algunas fotos importadas se muestran desde el sitio viejo (`www.eurocampingonline.com.ar`).
`npm run media:migrate` las descarga, valida (tipo y ≤ 5 MB) y las sube a
`legacy/externas/` del bucket, actualizando la misma fila de `media` (los productos
que las usan no cambian). Se puede repetir: sólo procesa las que siguen siendo externas;
el importador reconoce las ya copiadas y no las duplica.

```bash
ENV_FILE=.env.supabase-prod npm run media:migrate -- --dry-run   # revisar
ENV_FILE=.env.supabase-prod npm run media:migrate                # copiar
```

## Seguridad (resumen)

- Sin registro público. Sólo pueden administrar las cuentas listadas y activas en
  `admin_users`; una cuenta de Auth sin esa fila no puede leer borradores ni escribir.
- RLS en todas las tablas y políticas de Storage: visitantes sólo leen lo publicado;
  sólo administradores escriben o suben archivos.
- La clave de servicio no se usa en la aplicación web.
- El contenido enriquecido se filtra con una lista blanca (`lib/richtext.ts`); los enlaces
  sólo admiten `https:` y `mailto:`.
- Las imágenes se validan en el navegador y otra vez en el servidor (tipo y tamaño);
  no se puede borrar una imagen mientras la use algún contenido.
