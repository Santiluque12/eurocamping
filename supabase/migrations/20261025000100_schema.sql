-- ============================================================================
-- Eurocamping · esquema de contenido administrable
-- ============================================================================

create extension if not exists pgcrypto;

-- ─── Tipos ──────────────────────────────────────────────────────────────────
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.product_type   as enum ('nuevo', 'usado', 'rental');
create type public.price_mode     as enum ('fixed', 'from', 'consult');
create type public.availability   as enum ('available', 'unavailable', 'consult');
create type public.rental_period  as enum ('day', 'weekend', 'three_days', 'four_days', 'week', 'fortnight');
create type public.post_category  as enum ('ECOtrip', 'ECOtip');

-- Formato de slug: minúsculas, números y guiones simples.
create domain public.slug as text
  check (value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(value) <= 120);

create domain public.currency_code as text
  check (value in ('ARS', 'USD'));

-- Enlaces http(s) o rutas internas que empiezan con "/".
create domain public.link_url as text
  check (value ~ '^(https?://[^\s]+|/[^\s]*)$' and char_length(value) <= 2048);

-- ─── Administradores ────────────────────────────────────────────────────────
-- Sólo las personas listadas acá pueden administrar. Tener una cuenta en
-- Supabase Auth no alcanza.
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin', 'editor')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = auth.uid() and a.active
  );
$$;

-- ─── Auditoría: timestamps y usuario responsable ────────────────────────────
create or replace function public.tg_stamp()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := coalesce(new.created_at, now());
    new.created_by := coalesce(new.created_by, auth.uid());
  else
    new.created_at := old.created_at;
    new.created_by := old.created_by;
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create table public.audit_log (
  id          bigint generated always as identity primary key,
  table_name  text not null,
  record_id   text not null,
  action      text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_by  uuid,
  changed_at  timestamptz not null default now(),
  summary     jsonb
);
create index audit_log_changed_at_idx on public.audit_log (changed_at desc);
create index audit_log_record_idx on public.audit_log (table_name, record_id);

create or replace function public.tg_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec jsonb;
  rid text;
begin
  rec := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  rid := coalesce(rec ->> 'id', rec ->> 'key', rec ->> 'rate_id', rec ->> 'product_id');
  insert into public.audit_log (table_name, record_id, action, changed_by, summary)
  values (
    tg_table_name,
    rid,
    tg_op,
    auth.uid(),
    jsonb_strip_nulls(jsonb_build_object(
      'name',   coalesce(rec ->> 'name', rec ->> 'title', rec ->> 'key'),
      'status', rec ->> 'status'
    ))
  );
  return null;
end;
$$;

-- Columnas de auditoría comunes (se agregan a cada tabla con la macro de abajo).
-- created_at, created_by, updated_at, updated_by

-- ─── Imágenes ───────────────────────────────────────────────────────────────
create table public.media (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text unique,          -- objeto en el bucket "media"
  external_url  text,                 -- imagen heredada (carpeta public/ o dominio externo)
  mime_type     text,
  size_bytes    integer check (size_bytes is null or size_bytes > 0),
  width         integer,
  height        integer,
  alt           text not null default '',
  original_name text,
  created_at    timestamptz not null default now(),
  created_by    uuid references auth.users (id) on delete set null,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users (id) on delete set null,
  constraint media_one_source check ((storage_path is null) <> (external_url is null)),
  constraint media_external_url_format check (external_url is null or external_url ~ '^(https://|/)')
);
create unique index media_external_url_key on public.media (external_url) where external_url is not null;

-- ─── Catálogos ──────────────────────────────────────────────────────────────
create table public.brands (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(btrim(name)) between 1 and 80),
  slug          public.slug not null unique,
  website_url   public.link_url,
  logo_media_id uuid references public.media (id) on delete restrict,
  show_on_site  boolean not null default true,
  sort_order    integer not null default 0,
  archived_at   timestamptz,
  created_at    timestamptz not null default now(),
  created_by    uuid references auth.users (id) on delete set null,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users (id) on delete set null
);
create unique index brands_name_key on public.brands (lower(btrim(name)));

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  slug        public.slug not null unique,
  description text,
  sort_order  integer not null default 0,
  archived_at timestamptz,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);
create unique index categories_name_key on public.categories (lower(btrim(name)));

create table public.activities (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(btrim(name)) between 1 and 60),
  slug         public.slug not null unique,
  emoji        text,
  link_href    public.link_url,
  show_in_home boolean not null default true,
  sort_order   integer not null default 0,
  archived_at  timestamptz,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users (id) on delete set null
);
create unique index activities_name_key on public.activities (lower(btrim(name)));

-- ─── Productos y equipos ────────────────────────────────────────────────────
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  legacy_key        text unique,       -- clave estable usada por el importador
  slug              public.slug not null unique,
  name              text not null check (char_length(btrim(name)) between 1 and 160),
  type              public.product_type not null,
  description       text,
  spec_line         text,              -- línea corta: talles, medidas, peso
  category_id       uuid references public.categories (id) on delete restrict,
  brand_id          uuid references public.brands (id) on delete restrict,
  main_image_id     uuid references public.media (id) on delete restrict,
  main_image_alt    text,
  price_mode        public.price_mode not null default 'consult',
  price_amount      numeric(12, 2) check (price_amount is null or price_amount >= 0),
  currency          public.currency_code not null default 'ARS',
  price_unit        text check (price_unit is null or price_unit in ('day', 'weekend', 'week', 'unit')),
  availability      public.availability not null default 'consult',
  tags              text[] not null default '{}',
  external_url      text check (external_url is null or external_url ~ '^https://[^\s]+$'),
  external_label    text,
  whatsapp_message  text,
  featured          boolean not null default false,
  sort_order        integer not null default 0,
  status            public.content_status not null default 'draft',
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  created_by        uuid references auth.users (id) on delete set null,
  updated_at        timestamptz not null default now(),
  updated_by        uuid references auth.users (id) on delete set null,
  constraint products_price_consistency check (
    (price_mode = 'consult' and price_amount is null)
    or (price_mode <> 'consult' and price_amount is not null)
  )
);
create index products_listing_idx on public.products (status, type, sort_order);
create index products_category_idx on public.products (category_id);
create index products_brand_idx on public.products (brand_id);

create table public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  media_id   uuid not null references public.media (id) on delete restrict,
  alt        text,
  sort_order integer not null default 0,
  unique (product_id, media_id)
);
create index product_images_product_idx on public.product_images (product_id, sort_order);

create table public.product_activities (
  product_id  uuid not null references public.products (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  primary key (product_id, activity_id)
);

-- ─── Tarifario de alquiler ──────────────────────────────────────────────────
create table public.rental_sections (
  id           uuid primary key default gen_random_uuid(),
  slug         public.slug not null unique,   -- ancla en /alquilar (#slug)
  title        text not null,
  title_accent text,
  nav_label    text not null,
  icon         text,
  description  text,
  periods      public.rental_period[] not null check (cardinality(periods) between 1 and 6),
  footnote     text,
  show_resorts boolean not null default false,  -- muestra el bloque "Tarifas por centro de ski"
  sort_order   integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users (id) on delete set null
);

create table public.rental_rates (
  id          uuid primary key default gen_random_uuid(),
  legacy_key  text unique,
  section_id  uuid not null references public.rental_sections (id) on delete restrict,
  group_name  text,                -- subgrupo opcional (p. ej. "Carpas")
  name        text not null check (char_length(btrim(name)) between 1 and 160),
  product_id  uuid references public.products (id) on delete set null,
  sort_order  integer not null default 0,
  status      public.content_status not null default 'draft',
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);
create index rental_rates_section_idx on public.rental_rates (section_id, sort_order);
create index rental_rates_product_idx on public.rental_rates (product_id);

create table public.rental_rate_prices (
  rate_id  uuid not null references public.rental_rates (id) on delete cascade,
  period   public.rental_period not null,
  amount   numeric(12, 2) not null check (amount >= 0),
  currency public.currency_code not null default 'ARS',
  primary key (rate_id, period)
);

-- ─── ECOtrips y ECOtips ─────────────────────────────────────────────────────
create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  legacy_key       text unique,
  slug             public.slug not null unique,
  title            text not null check (char_length(btrim(title)) between 1 and 200),
  category         public.post_category not null,
  excerpt          text,
  cover_media_id   uuid references public.media (id) on delete restrict,
  cover_alt        text,
  body_html        text not null default '',
  reading_minutes  integer not null default 1 check (reading_minutes >= 1),
  featured         boolean not null default false,
  seo_title        text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 170),
  status           public.content_status not null default 'draft',
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  created_by       uuid references auth.users (id) on delete set null,
  updated_at       timestamptz not null default now(),
  updated_by       uuid references auth.users (id) on delete set null
);
create index posts_listing_idx on public.posts (status, published_at desc);

-- ─── Sucursales ─────────────────────────────────────────────────────────────
create table public.branches (
  id            uuid primary key default gen_random_uuid(),
  legacy_key    text unique,
  name          text not null check (char_length(btrim(name)) between 1 and 120),
  city          text not null,
  region        text not null,
  address       text,
  phones        text[] not null default '{}',
  whatsapp      text check (whatsapp is null or whatsapp ~ '^[0-9]{8,15}$'),
  hours         text,
  maps_url      text check (maps_url is null or maps_url ~ '^https://[^\s]+$'),
  offers_rental boolean not null default false,
  services      text[] not null default '{}',
  season_label  text,
  notes         text,
  sort_order    integer not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  created_by    uuid references auth.users (id) on delete set null,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users (id) on delete set null
);
create index branches_order_idx on public.branches (is_visible, sort_order);

-- ─── Taller ─────────────────────────────────────────────────────────────────
-- kind = 'category': tarjeta de servicios con lista de trabajos.
-- kind = 'rate':     fila del tarifario orientativo (por temporada).
create table public.workshop_services (
  id               uuid primary key default gen_random_uuid(),
  legacy_key       text unique,
  kind             text not null check (kind in ('category', 'rate')),
  season           text check (season is null or season in ('invierno', 'verano')),
  name             text not null check (char_length(btrim(name)) between 1 and 160),
  description      text,
  icon             text,
  image_media_id   uuid references public.media (id) on delete restrict,
  items            text[] not null default '{}',
  price_mode       public.price_mode not null default 'consult',
  price_amount     numeric(12, 2) check (price_amount is null or price_amount >= 0),
  currency         public.currency_code not null default 'ARS',
  price_unit       text check (price_unit is null or price_unit in ('unit', 'cm2', 'hour')),
  whatsapp_message text,
  sort_order       integer not null default 0,
  is_visible       boolean not null default true,
  created_at       timestamptz not null default now(),
  created_by       uuid references auth.users (id) on delete set null,
  updated_at       timestamptz not null default now(),
  updated_by       uuid references auth.users (id) on delete set null,
  constraint workshop_rate_needs_season check (kind <> 'rate' or season is not null),
  constraint workshop_price_consistency check (
    (price_mode = 'consult' and price_amount is null)
    or (price_mode <> 'consult' and price_amount is not null)
  )
);

-- ─── Configuración general y textos de páginas ──────────────────────────────
create table public.site_settings (
  key        text primary key check (key in (
               'general', 'home', 'alquilar', 'catalogo', 'taller',
               'nosotros', 'sucursales', 'contenido', 'usados')),
  value      jsonb not null check (jsonb_typeof(value) = 'object'),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

-- ─── Reglas de integridad ───────────────────────────────────────────────────

-- Fecha de publicación automática al publicar.
create or replace function public.tg_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

-- No se puede archivar un catálogo que todavía usan productos publicados.
create or replace function public.tg_guard_catalog_archive()
returns trigger
language plpgsql
as $$
declare
  in_use integer;
begin
  if new.archived_at is not null and old.archived_at is null then
    if tg_table_name = 'brands' then
      select count(*) into in_use from public.products where brand_id = new.id and status = 'published';
    elsif tg_table_name = 'categories' then
      select count(*) into in_use from public.products where category_id = new.id and status = 'published';
    else
      select count(*) into in_use from public.product_activities pa
        join public.products p on p.id = pa.product_id
        where pa.activity_id = new.id and p.status = 'published';
    end if;
    if in_use > 0 then
      raise exception 'CATALOG_IN_USE:%', in_use using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

-- No se puede borrar una imagen referenciada desde la configuración (JSON).
-- Las referencias desde tablas ya las protege "on delete restrict".
create or replace function public.tg_guard_media_delete()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from public.site_settings s where s.value::text like '%' || old.id::text || '%') then
    raise exception 'MEDIA_IN_USE' using errcode = '23503';
  end if;
  return old;
end;
$$;

create trigger media_guard_delete before delete on public.media
  for each row execute function public.tg_guard_media_delete();

create trigger products_published_at before insert or update on public.products
  for each row execute function public.tg_published_at();
create trigger posts_published_at before insert or update on public.posts
  for each row execute function public.tg_published_at();

create trigger brands_guard_archive before update on public.brands
  for each row execute function public.tg_guard_catalog_archive();
create trigger categories_guard_archive before update on public.categories
  for each row execute function public.tg_guard_catalog_archive();
create trigger activities_guard_archive before update on public.activities
  for each row execute function public.tg_guard_catalog_archive();

-- Timestamps + auditoría en todas las tablas de contenido.
do $$
declare
  t text;
begin
  foreach t in array array[
    'media', 'brands', 'categories', 'activities', 'products', 'rental_sections',
    'rental_rates', 'posts', 'branches', 'workshop_services', 'site_settings'
  ] loop
    execute format('create trigger %I_stamp before insert or update on public.%I
                    for each row execute function public.tg_stamp()', t, t);
    execute format('create trigger %I_audit after insert or update or delete on public.%I
                    for each row execute function public.tg_audit()', t, t);
  end loop;
end;
$$;
