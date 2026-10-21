-- Replace the old category slugs on existing projects with Nutri Coco categories.
alter table public.site_content
  drop constraint if exists site_content_category_check;

update public.site_content
set category = case category
  when 'partners' then 'fresh'
  when 'health' then 'fresh'
  when 'events' then 'news'
  when 'gallery' then 'water'
  else category
end;

alter table public.site_content
  alter column category set default 'fresh',
  add constraint site_content_category_check
    check (category in ('fresh', 'water', 'lime', 'news'));
