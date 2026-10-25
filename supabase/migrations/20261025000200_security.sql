-- ============================================================================
-- Seguridad: Row Level Security
--  · anon / visitantes: sólo leen contenido publicado y visible.
--  · administradores (public.admin_users activos): leen y escriben todo.
--  · cualquier otra cuenta autenticada: igual que un visitante.
-- ============================================================================

alter table public.admin_users        enable row level security;
alter table public.audit_log          enable row level security;
alter table public.media              enable row level security;
alter table public.brands             enable row level security;
alter table public.categories         enable row level security;
alter table public.activities         enable row level security;
alter table public.products           enable row level security;
alter table public.product_images     enable row level security;
alter table public.product_activities enable row level security;
alter table public.rental_sections    enable row level security;
alter table public.rental_rates       enable row level security;
alter table public.rental_rate_prices enable row level security;
alter table public.posts              enable row level security;
alter table public.branches           enable row level security;
alter table public.workshop_services  enable row level security;
alter table public.site_settings      enable row level security;

-- ─── Escritura y lectura completa para administradores ──────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'media', 'brands', 'categories', 'activities', 'products', 'product_images',
    'product_activities', 'rental_sections', 'rental_rates', 'rental_rate_prices',
    'posts', 'branches', 'workshop_services', 'site_settings'
  ] loop
    execute format(
      'create policy "admins manage %1$s" on public.%1$I
         for all to authenticated
         using ((select public.is_admin()))
         with check ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- ─── Lectura pública ────────────────────────────────────────────────────────
create policy "public reads published products" on public.products
  for select to anon, authenticated
  using (status = 'published');

create policy "public reads images of published products" on public.product_images
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));

create policy "public reads activities of published products" on public.product_activities
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));

create policy "public reads active brands" on public.brands
  for select to anon, authenticated using (archived_at is null);

create policy "public reads active categories" on public.categories
  for select to anon, authenticated using (archived_at is null);

create policy "public reads active activities" on public.activities
  for select to anon, authenticated using (archived_at is null);

create policy "public reads visible rental sections" on public.rental_sections
  for select to anon, authenticated using (is_visible);

create policy "public reads published rental rates" on public.rental_rates
  for select to anon, authenticated
  using (status = 'published'
         and exists (select 1 from public.rental_sections s where s.id = section_id and s.is_visible));

create policy "public reads prices of published rates" on public.rental_rate_prices
  for select to anon, authenticated
  using (exists (select 1 from public.rental_rates r where r.id = rate_id and r.status = 'published'));

create policy "public reads published posts" on public.posts
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "public reads visible branches" on public.branches
  for select to anon, authenticated using (is_visible);

create policy "public reads visible workshop services" on public.workshop_services
  for select to anon, authenticated using (is_visible);

create policy "public reads site settings" on public.site_settings
  for select to anon, authenticated using (true);

-- Una imagen es pública sólo si la usa algo público. Así una imagen subida
-- para un borrador no aparece en consultas públicas.
create policy "public reads media in public use" on public.media
  for select to anon, authenticated
  using (
    exists (select 1 from public.products p where p.main_image_id = media.id and p.status = 'published')
    or exists (select 1 from public.product_images pi join public.products p on p.id = pi.product_id
               where pi.media_id = media.id and p.status = 'published')
    or exists (select 1 from public.posts po where po.cover_media_id = media.id
               and po.status = 'published' and po.published_at <= now())
    or exists (select 1 from public.brands b where b.logo_media_id = media.id and b.archived_at is null)
    or exists (select 1 from public.workshop_services w where w.image_media_id = media.id and w.is_visible)
    or exists (select 1 from public.site_settings s where s.value::text like '%' || media.id::text || '%')
  );

-- ─── Administradores y auditoría ────────────────────────────────────────────
-- Nadie se puede dar de alta como administrador desde la API: las altas se
-- hacen con el script `npm run admin:create` (clave de servicio) o por SQL.
create policy "users read own admin row" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "admins read audit log" on public.audit_log
  for select to authenticated using ((select public.is_admin()));

-- Las funciones de trigger no deben ejecutarse directamente.
revoke execute on function public.tg_audit() from public, anon, authenticated;
