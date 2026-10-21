-- Nutri Coco public content with writes restricted to explicitly allowlisted admins.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

create policy "Admins can read their own allowlist row"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_nutri_coco_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_nutri_coco_admin() from public, anon;
grant execute on function public.is_nutri_coco_admin() to authenticated;

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null check (kind in ('blog', 'post', 'news')),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text not null check (char_length(excerpt) between 1 and 320),
  body text not null check (char_length(body) between 1 and 50000),
  cover_url text,
  cover_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  caption text not null default '' check (char_length(caption) <= 180),
  image_url text not null,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists site_content_created_at_idx
  on public.site_content (created_at desc);
create index if not exists gallery_items_created_at_idx
  on public.gallery_items (created_at desc);

alter table public.site_content enable row level security;
alter table public.gallery_items enable row level security;

revoke all on public.site_content, public.gallery_items from anon, authenticated;
grant select on public.site_content, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.site_content, public.gallery_items to authenticated;

create policy "Published content is public"
  on public.site_content for select to anon, authenticated using (true);
create policy "Admins manage site content"
  on public.site_content for all to authenticated
  using ((select public.is_nutri_coco_admin()))
  with check ((select public.is_nutri_coco_admin()));

create policy "Published gallery is public"
  on public.gallery_items for select to anon, authenticated using (true);
create policy "Admins manage gallery items"
  on public.gallery_items for all to authenticated
  using ((select public.is_nutri_coco_admin()))
  with check ((select public.is_nutri_coco_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'nutri-coco-media',
  'nutri-coco-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can list Nutri Coco media"
  on storage.objects for select to authenticated
  using (bucket_id = 'nutri-coco-media' and (select public.is_nutri_coco_admin()));
create policy "Admins can upload Nutri Coco media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'nutri-coco-media' and (select public.is_nutri_coco_admin()));
create policy "Admins can update Nutri Coco media"
  on storage.objects for update to authenticated
  using (bucket_id = 'nutri-coco-media' and (select public.is_nutri_coco_admin()))
  with check (bucket_id = 'nutri-coco-media' and (select public.is_nutri_coco_admin()));
create policy "Admins can delete Nutri Coco media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'nutri-coco-media' and (select public.is_nutri_coco_admin()));
