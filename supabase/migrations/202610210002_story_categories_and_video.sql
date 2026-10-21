-- Allow admin stories to publish into a selected public story category with video covers.
alter table public.site_content
  add column if not exists category text not null default 'fresh',
  add column if not exists media_type text not null default 'image';

alter table public.site_content
  drop constraint if exists site_content_category_check,
  add constraint site_content_category_check
    check (category in ('fresh', 'water', 'lime', 'news')),
  drop constraint if exists site_content_media_type_check,
  add constraint site_content_media_type_check
    check (media_type in ('image', 'video'));

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime'
    ]
where id = 'nutri-coco-media';

-- Realtime publication makes new stories appear on already-open customer pages.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'site_content'
     ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end;
$$;
