-- ============================================================================
-- Almacenamiento de imágenes (bucket "media")
--  · lectura pública por URL (las imágenes se muestran en el sitio)
--  · sólo administradores suben, reemplazan o borran
--  · Storage valida tipo y tamaño en el servidor
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admins upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "admins update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "admins delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "admins list media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
