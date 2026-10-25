# Guía del administrador — Eurocamping

Desde el panel podés cambiar productos, precios, notas, sucursales y textos del sitio.
Los cambios se ven en la web **al instante**: no hace falta llamar a nadie ni “subir una
versión nueva”.

## Entrar y salir

- Entrá a **`/admin`** (por ejemplo `https://www.eurocampingonline.com.ar/admin`) con tu
  email y contraseña.
- ¿No te acordás la contraseña? Tocá **“¿Olvidaste tu contraseña?”**. Te llega un mail con
  un enlace para elegir una nueva (revisá también la carpeta de spam).
- Para salir, **Cerrar sesión** (abajo del menú; en el celular, dentro del menú ☰).
- No hay registro abierto: para sumar a otra persona, pedíselo a quien maneja la parte
  técnica (ver al final).

## Cómo funciona cada pantalla

Todas las secciones tienen el mismo formato:

1. Un **listado** con buscador y filtros (por tipo, estado, etc.).
2. Tocás un elemento para **editarlo**, o **Nuevo…** para crear uno.
3. Abajo del formulario están los botones para guardar.

Los campos con **\*** son obligatorios. Si algo está mal, el campo se marca en rojo con
una explicación. Si intentás salir con cambios sin guardar, el panel te avisa.

### Borrador, publicado y archivado

Productos, publicaciones y filas del tarifario tienen estado:

| Estado | ¿Se ve en la web? | Para qué sirve |
| --- | --- | --- |
| **Borrador** | No | Preparar algo sin mostrarlo todavía |
| **Publicado** | Sí | Lo que ve el público |
| **Archivado** | No | Retirar algo sin borrarlo; se puede restaurar |

- **Guardar borrador** guarda sin publicar. **Publicar** lo muestra en la web.
- En algo ya publicado, **Guardar cambios** lo actualiza en la web y **Pasar a borrador**
  lo oculta.
- Para ver lo archivado, usá el filtro **Estado → Archivados** y abrilo para
  **Restaurar**.

Sucursales, servicios del taller y secciones del tarifario no tienen borrador: tienen la
casilla **Visible en el sitio**.

## Tareas frecuentes

### Actualizar precios de alquiler
**Tarifario de alquiler** → tocá la fila (ej. “Carpa 1-4 PAX”) → cambiá los importes →
**Guardar cambios**.
- Escribí **sólo números**, sin `$` ni puntos: `45000`. La web le da formato ($45.000).
- Dejá vacío un plazo que no se alquila: en la tabla aparece “—”.
- Las columnas (Día, Fin de semana, Semana…) se eligen en **Editar sección**.

### Cargar un equipo o producto nuevo
**Productos y equipos** → **Nuevo producto**.
- **Tipo**: *Equipo de alquiler*, *Producto nuevo* o *Usado*.
- **Categoría**: los equipos de alquiler con categoría aparecen en el catálogo con foto
  (`/alquilar/catalogo`).
- **Imagen principal**: **Elegir o subir** → **Subir nueva** (o elegí una ya subida).
  Completá el *texto alternativo* con una descripción corta (“Carpa naranja armada”):
  ayuda a buscadores y a personas con lector de pantalla.
- **Precio**: *Consultar* (sin precio), *Desde…* o *Precio fijo*, más la unidad (por día,
  por fin de semana…).
- **Destacado en el inicio**: aparece en “Elegidos para esta temporada” (hasta 6).
- Para que se vea en una fila del tarifario con “Ver foto”, en la fila del tarifario
  elegí este equipo en **Equipo del catálogo**.

### Escribir un ECOtrip o ECOtip
**ECOtrips y ECOtips** → **Nueva publicación**: título, categoría, resumen, portada y el
texto con el editor (negrita, subtítulos, listas, enlaces, imágenes).
- El tiempo de lectura se calcula solo.
- **Fecha de publicación**: vacía = el día que la publicás. Si ponés una fecha futura,
  aparece recién ese día (en el listado figura como *Programada*).
- **Destacada en el inicio**: se muestran las 2 destacadas más recientes.

### Cambiar horarios o datos de una sucursal
**Sucursales** → tocá la sucursal → editá → **Guardar cambios**.
- WhatsApp con código de país y área, sólo números: `5491162237233`.
- **Provincia o región** agrupa las sucursales en la página: escribila igual que en las
  demás.

### Cambiar textos, botones o WhatsApp del sitio
**Textos y configuración** → elegí la página:
- **Contacto, WhatsApp y pie de página**: números de WhatsApp de cada área, mensajes
  automáticos, email, redes sociales y textos del pie.
- **Inicio, Alquilar, Taller, Nosotros…**: títulos, bajadas, imágenes de portada,
  botones, pasos y listas de cada página.
- En los botones, el **destino** puede ser una página del sitio (`/alquilar`) o un enlace
  completo (`https://…`).

### Imágenes
**Imágenes** muestra todas las fotos subidas.
- **Subir imágenes**: JPG, PNG, WebP, AVIF o GIF de hasta **5 MB**.
- **Reemplazar**: cambia el archivo y se actualiza en **todos** los lugares donde se usa.
- **Eliminar**: sólo se puede si ningún contenido la usa; si está en uso, el panel te
  dice dónde, para que la cambies primero.

### Marcas, categorías y actividades
Listas que se usan para clasificar productos.
- **Categorías** son las secciones del catálogo de alquiler.
- **Actividades** aparecen en la portada (Camping, Ski…); elegí a qué página llevan.
- **Archivar** las saca de los formularios y de la web. No se puede archivar una que
  esté usando un producto publicado: primero cambiá esos productos.

## Inicio del panel

Accesos rápidos a lo más usado, contadores (publicados y borradores) y **Últimos
cambios**: qué se modificó, cuándo y quién.

## Altas y bajas de administradores

Por seguridad, las cuentas se crean desde la computadora de la persona a cargo de la
parte técnica, con el comando:

```bash
npm run admin:create -- --email persona@eurocamping.com.ar --name "Nombre Apellido"
```

Muestra una contraseña temporal: la persona entra y la cambia desde “¿Olvidaste tu
contraseña?”. Para quitar el acceso a alguien:
`npm run admin:create -- --email persona@eurocamping.com.ar --disable`.
