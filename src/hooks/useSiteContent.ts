import { useEffect, useState } from 'react'
import { galleryItems as fallbackGalleryItems, type GalleryItem } from '../Data/content'
import { posts as fallbackPosts, type Post } from '../Data/posts'
import { supabase, type GalleryRow, type SiteContentRow } from '../lib/supabase'

function toPost(row: SiteContentRow): Post {
  const paragraphs = row.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
  const category = row.category

  return {
    slug: row.slug,
    title: row.title,
    date: row.created_at.slice(0, 10),
    category,
    excerpt: row.excerpt,
    cover: row.cover_url ?? undefined,
    coverIsVideo: row.media_type === 'video',
    content: paragraphs.map((text) => ({ type: 'p' as const, text })),
  }
}

export function useSitePosts() {
  const [items, setItems] = useState<readonly Post[]>(fallbackPosts)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    const client = supabase
    if (!client) return
    let active = true

    void client
      .from('site_content')
      .select('id, slug, kind, category, title, excerpt, body, cover_url, cover_path, media_type, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) {
          const dynamic = (data as SiteContentRow[]).map(toPost)
          const slugs = new Set(dynamic.map((post) => post.slug))
          setItems([...dynamic, ...fallbackPosts.filter((post) => !slugs.has(post.slug))])
        }
        setLoading(false)
      })

    const channel = client.channel('public-site-content')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, () => {
        void client.from('site_content')
          .select('id, slug, kind, category, title, excerpt, body, cover_url, cover_path, media_type, created_at')
          .order('created_at', { ascending: false }).limit(100)
          .then(({ data, error }) => {
            if (!active || error || !data) return
            const dynamic = (data as SiteContentRow[]).map(toPost)
            const slugs = new Set(dynamic.map((post) => post.slug))
            setItems([...dynamic, ...fallbackPosts.filter((post) => !slugs.has(post.slug))])
          })
      }).subscribe()

    return () => { active = false; void client.removeChannel(channel) }
  }, [])

  return { posts: items, loading }
}

export function useSiteGallery() {
  const [items, setItems] = useState<readonly GalleryItem[]>(fallbackGalleryItems)

  useEffect(() => {
    if (!supabase) return
    let active = true

    void supabase
      .from('gallery_items')
      .select('id, caption, image_url, storage_path, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) {
          const dynamic = (data as GalleryRow[]).map((row) => ({
            id: row.id,
            caption: row.caption,
            src: row.image_url,
          }))
          setItems([...dynamic, ...fallbackGalleryItems])
        }
      })

    return () => { active = false }
  }, [])

  return items
}
