import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export const mediaBucket = 'nutri-coco-media'

export type SiteContentKind = 'blog' | 'post' | 'news'
export type SiteCategory = 'fresh' | 'water' | 'lime' | 'news'

export type SiteContentRow = {
  id: string
  slug: string
  kind: SiteContentKind
  category: SiteCategory
  title: string
  excerpt: string
  body: string
  cover_url: string | null
  cover_path: string | null
  media_type: 'image' | 'video'
  created_at: string
}

export type GalleryRow = {
  id: string
  caption: string
  image_url: string
  storage_path: string
  created_at: string
}
