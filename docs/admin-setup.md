# Nutri Coco content admin setup

The admin route is `/admin`. It uses Supabase Auth for sign-in, Postgres for content, and Supabase Storage for images. The public site reads published content directly from Supabase. Database row-level security and Storage policies restrict writes to accounts explicitly added to `public.admin_users`.

## 1. Create a Supabase project

Create a project on the Supabase Free plan. In the SQL Editor, run both migration files in order:

`supabase/migrations/202610210001_nutri_coco_content.sql`

`supabase/migrations/202610210002_story_categories_and_video.sql`

These create the admin allowlist, published content and gallery tables, the public media bucket, video/category support, and access policies. The bucket serves published media publicly but only allowlisted admins can upload, change, or delete it.

## 2. Create the first admin account

In Supabase Authentication, turn off public sign-ups and create the admin user yourself. Set a strong password directly in the Supabase dashboard. Do not put it in the source code, Vercel variables, or chat.

Copy the user's ID from **Authentication > Users**, then run this in the SQL Editor, replacing the placeholder with that ID:

```sql
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000')
on conflict (user_id) do nothing;
```

Only user IDs in this table pass the database and Storage admin policies. To remove admin access, delete that user's row from `public.admin_users`.

## 3. Configure the Vercel site

In Supabase **Project Settings > API**, copy the Project URL and the publishable key. Add these environment variables to the Vercel project for Production and Preview, and to `.env.local` for local development:

```text
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The publishable key is intended for browser use. Never add the `service_role` key to Vercel's `VITE_` variables or any client-side code. The database policies are the security boundary.

Redeploy the Vercel project after saving its variables. Then visit `/admin` and sign in with the admin account.

## Content and storage notes

- Posts and gallery images publish as soon as they are saved.
- Publish a story to have it appear under its selected category on “Fresh from Nutri Coco” and “View all stories.” New stories update already-open customer pages through Supabase Realtime.
- The admin supports blog articles, posts, news updates, and gallery photos. Article text uses paragraphs separated by blank lines.
- Story images are resized to at most 1800 pixels on the long edge and converted to WebP when the browser supports it. GIFs are kept as GIFs. MP4, WebM, and MOV videos can be uploaded up to 50 MB each.
- The public site keeps its existing bundled content and adds published Supabase content to it.
- Supabase Free currently includes 1 GB of file storage. This is finite, not unlimited; compressed photo size and monthly visits determine how long it lasts. Check Supabase's current [pricing page](https://supabase.com/pricing) before relying on the allowance for production.
- Supabase Free projects may pause after a week of inactivity. Customer visits that load dynamic content contact Supabase; public website traffic cannot be made zero while customers use the site.
- Use a commercial Vercel plan if required for the business site; Vercel's Hobby plan is restricted to non-commercial use.
