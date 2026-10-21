import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export const mediaBucket = 'nutri-coco-media'

export type SiteContentKind = 'blog' | 'post' | 'news'
export type SiteCategory = 'partners' | 'health' | 'events' | 'gallery'

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
