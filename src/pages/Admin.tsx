import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useTranslation } from 'react-i18next'
import { ImagePlus, LoaderCircle, LogOut, Newspaper, Trash2, Upload } from 'lucide-react'
import { mediaBucket, supabase, type GalleryRow, type SiteCategory, type SiteContentKind, type SiteContentRow } from '../lib/supabase'

const inputClass = 'mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60'
const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const acceptedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
const acceptedTypes = [...acceptedImageTypes, ...acceptedVideoTypes]
const maxUploadBytes = 50 * 1024 * 1024
const freeStorageBytes = 1024 * 1024 * 1024

async function measureMediaUsage() {
  if (!supabase) return null
  let total = 0
  for (const folder of ['posts', 'gallery']) {
    let offset = 0
    while (true) {
      const { data, error } = await supabase.storage.from(mediaBucket).list(folder, { limit: 1000, offset })
      if (error || !data) return null
      for (const item of data) {
        const size = (item as { metadata?: { size?: number } }).metadata?.size
        if (typeof size === 'number') total += size
      }
      if (data.length < 1000) break
      offset += data.length
    }
  }
  return total
}

async function prepareMedia(file: File) {
  if (!acceptedTypes.includes(file.type)) {
    throw new Error('Choose a supported image or MP4, WebM, or MOV video.')
  }

  if (acceptedVideoTypes.includes(file.type)) {
    if (file.size > maxUploadBytes) throw new Error('Videos must be 50 MB or smaller.')
    return file
  }

  if (file.type === 'image/gif') {
    if (file.size > 10 * 1024 * 1024) throw new Error('GIF files must be 10 MB or smaller.')
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image compression is unavailable in this browser.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not prepare this image.')), 'image/webp', 0.82)
    })
    if (blob.size > maxUploadBytes) throw new Error('This image is too large to upload (50 MB maximum).')
    const name = file.name.replace(/\.[^.]+$/, '') || 'nutri-coco-image'
    return new File([blob], `${name}.webp`, { type: 'image/webp', lastModified: Date.now() })
  } catch (error) {
    if (error instanceof Error && error.message.includes('too large')) throw error
    if (file.size <= maxUploadBytes) return file
    throw new Error('This image is too large to upload (50 MB maximum).')
  }
}

async function uploadMedia(file: File, folder: 'posts' | 'gallery') {
  if (!supabase) throw new Error('Supabase is not configured yet.')
  const media = await prepareMedia(file)
  const extension = media.type === 'image/gif' ? 'gif'
    : media.type === 'video/mp4' ? 'mp4'
      : media.type === 'video/webm' ? 'webm'
        : media.type === 'video/quicktime' ? 'mov' : 'webp'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(mediaBucket).upload(path, media, {
    contentType: media.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(mediaBucket).getPublicUrl(path)
  return { path, url: data.publicUrl, type: acceptedVideoTypes.includes(media.type) ? 'video' as const : 'image' as const }
}

function slugify(value: string) {
  const base = value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'nutri-coco-update'
  return `${base}-${crypto.randomUUID().slice(0, 8)}`
}

export default function Admin() {
  const { t } = useTranslation()
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [adminAllowed, setAdminAllowed] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [posts, setPosts] = useState<SiteContentRow[]>([])
  const [gallery, setGallery] = useState<GalleryRow[]>([])
  const [storageUsed, setStorageUsed] = useState<number | null>(null)
  const [kind, setKind] = useState<SiteContentKind>('blog')
  const [category, setCategory] = useState<SiteCategory>('fresh')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [galleryCaption, setGalleryCaption] = useState('')
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }
    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setAuthReady(true)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthReady(true)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const loadContent = useCallback(async () => {
    if (!supabase) return
    setBusy(true)
    const [postResult, galleryResult] = await Promise.all([
      supabase.from('site_content').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('gallery_items').select('*').order('created_at', { ascending: false }).limit(100),
    ])
    const usage = await measureMediaUsage()
    setStorageUsed(usage)
    if (postResult.error || galleryResult.error) {
      setError(postResult.error?.message ?? galleryResult.error?.message ?? 'Could not load saved content.')
    } else {
      setPosts((postResult.data ?? []) as SiteContentRow[])
      setGallery((galleryResult.data ?? []) as GalleryRow[])
    }
    setBusy(false)
  }, [])

  useEffect(() => {
    if (!session?.user || !supabase) {
      setAdminAllowed(false)
      return
    }
    let active = true
    setCheckingAdmin(true)
    void supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return
        const allowed = !queryError && Boolean(data)
        setAdminAllowed(allowed)
        setCheckingAdmin(false)
        if (allowed) void loadContent()
      })
    return () => { active = false }
  }, [session, loadContent])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setBusy(true)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (signInError) {
      setError('Sign-in failed. Check the admin email and password.')
      return
    }
    setPassword('')
    setSession(data.session)
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
    setAdminAllowed(false)
    setPosts([])
    setGallery([])
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session?.user) return
    setError('')
    setSavedMessage('')
    setBusy(true)
    let uploaded: { path: string; url: string; type: 'image' | 'video' } | null = null
    try {
      if (cover) uploaded = await uploadMedia(cover, 'posts')
      const { error: insertError } = await supabase.from('site_content').insert({
        slug: slugify(title),
        kind,
        category,
        title: title.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        cover_url: uploaded?.url ?? null,
        cover_path: uploaded?.path ?? null,
        media_type: uploaded?.type ?? 'image',
      })
      if (insertError) throw insertError
      setTitle('')
      setExcerpt('')
      setBody('')
      setCover(null)
      setSavedMessage('Published. It is now visible on the public site.')
      await loadContent()
    } catch (publishError) {
      if (uploaded) await supabase.storage.from(mediaBucket).remove([uploaded.path])
      setError(publishError instanceof Error ? publishError.message : 'Could not publish this item.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadGallery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session?.user || galleryFiles.length === 0) return
    setError('')
    setSavedMessage('')
    setBusy(true)
    const uploadedPaths: string[] = []
    try {
      for (const file of galleryFiles) {
        const uploaded = await uploadMedia(file, 'gallery')
        uploadedPaths.push(uploaded.path)
        const { error: insertError } = await supabase.from('gallery_items').insert({
          caption: galleryCaption.trim() || file.name.replace(/\.[^.]+$/, ''),
          image_url: uploaded.url,
          storage_path: uploaded.path,
        })
        if (insertError) throw insertError
      }
      setGalleryFiles([])
      setGalleryCaption('')
      setSavedMessage(`${uploadedPaths.length} photo${uploadedPaths.length === 1 ? '' : 's'} published to the gallery.`)
      await loadContent()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not upload these images.')
    } finally {
      setBusy(false)
    }
  }

  async function deletePost(item: SiteContentRow) {
    if (!supabase || !window.confirm(`Delete “${item.title}” from the public site?`)) return
    setError('')
    setBusy(true)
    const { error: deleteError } = await supabase.from('site_content').delete().eq('id', item.id)
    if (!deleteError && item.cover_path) {
      const { error: storageError } = await supabase.storage.from(mediaBucket).remove([item.cover_path])
      if (storageError) setError(`The post was deleted, but its image could not be removed: ${storageError.message}`)
    } else if (deleteError) setError(deleteError.message)
    await loadContent()
    setBusy(false)
  }

  async function deleteGalleryItem(item: GalleryRow) {
    if (!supabase || !window.confirm('Delete this photo from the public gallery?')) return
    setError('')
    setBusy(true)
    const { error: deleteError } = await supabase.from('gallery_items').delete().eq('id', item.id)
    if (!deleteError) {
      const { error: storageError } = await supabase.storage.from(mediaBucket).remove([item.storage_path])
      if (storageError) setError(`The photo was removed from the gallery, but its file could not be deleted: ${storageError.message}`)
    } else setError(deleteError.message)
    await loadContent()
    setBusy(false)
  }

  return (
    <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
      <title>Admin | Nutri Coco</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="mx-auto max-w-6xl">
        {!supabase ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-brand-100 bg-white p-8 shadow-xl">
            <h1 className="font-display text-3xl font-bold text-brand-900">Admin setup needed</h1>
            <p className="mt-4 leading-relaxed text-ink/70">Add <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> to the Vercel environment variables, then create a new deployment.</p>
          </section>
        ) : !authReady || checkingAdmin ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-brand-700"><LoaderCircle className="size-6 animate-spin" />Checking admin access…</div>
        ) : !session ? (
          <section className="mx-auto max-w-md rounded-3xl border border-brand-100 bg-white p-7 shadow-xl sm:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-700"><Newspaper className="size-6" /></span>
            <h1 className="mt-5 font-display text-3xl font-bold text-brand-900">Nutri Coco admin</h1>
            <p className="mt-2 text-ink/70">Sign in with the admin account to publish site updates.</p>
            <form className="mt-7 space-y-5" onSubmit={signIn}>
              <label className="block text-sm font-bold text-brand-900">Admin email<input className={inputClass} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label className="block text-sm font-bold text-brand-900">Password<input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
              <button className={`${buttonClass} w-full`} disabled={busy}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : null}Sign in</button>
            </form>
          </section>
        ) : !adminAllowed ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-xl">
            <h1 className="font-display text-3xl font-bold text-brand-900">Admin access only</h1>
            <p className="mt-3 text-ink/70">This signed-in account is not on the Nutri Coco admin allowlist.</p>
            <button className={`${buttonClass} mt-6`} onClick={() => void signOut()}>Sign out</button>
          </section>
        ) : (
          <>
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Nutri Coco</p>
                <h1 className="mt-1 font-display text-3xl font-bold text-brand-900 sm:text-4xl">Content admin</h1>
                <p className="mt-2 text-ink/70">Saved items publish immediately to the public website.</p>
              </div>
              <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 font-bold text-brand-800 hover:bg-brand-50" onClick={() => void signOut()}><LogOut className="size-4" />Sign out</button>
            </header>

            {(error || savedMessage) && <p role={error ? 'alert' : 'status'} className={`mb-6 rounded-2xl p-4 text-sm font-semibold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{error || savedMessage}</p>}

            <section className="mb-7 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-bold text-brand-900">Image storage</span>
                <span className="text-ink/70">{storageUsed === null ? 'Usage unavailable' : `${(storageUsed / (1024 * 1024)).toFixed(1)} MB used of 1,024 MB`}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-100"><div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${storageUsed === null ? 0 : Math.min(100, storageUsed / freeStorageBytes * 100)}%` }} /></div>
              <p className="mt-2 text-xs text-ink/60">This reflects the current Supabase Free storage allowance. Photos are compressed before upload; storage is still finite.</p>
            </section>

            <div className="grid gap-7 lg:grid-cols-2">
              <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg sm:p-8">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-700"><Newspaper className="size-5" /></span><div><h2 className="text-xl font-bold text-brand-900">Publish a story</h2><p className="text-sm text-ink/60">Appears in Fresh from Nutri Coco and View all stories as soon as it is saved.</p></div></div>
                <form className="mt-6 space-y-4" onSubmit={publish}>
                  <label className="block text-sm font-bold text-brand-900">Content type<select className={inputClass} value={kind} onChange={(event) => setKind(event.target.value as SiteContentKind)}><option value="blog">Blog article</option><option value="post">Post</option><option value="news">News update</option></select></label>
                  <label className="block text-sm font-bold text-brand-900">Story category<select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value as SiteCategory)}><option value="fresh">{t('blog.categories.fresh')}</option><option value="water">{t('blog.categories.water')}</option><option value="lime">{t('blog.categories.lime')}</option><option value="news">{t('blog.categories.news')}</option></select></label>
                  <label className="block text-sm font-bold text-brand-900">Title<input className={inputClass} maxLength={160} required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                  <label className="block text-sm font-bold text-brand-900">Short description<input className={inputClass} maxLength={320} required value={excerpt} onChange={(event) => setExcerpt(event.target.value)} /></label>
                  <label className="block text-sm font-bold text-brand-900">Article or update<textarea className={`${inputClass} min-h-40 resize-y`} maxLength={50000} required value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write the content here. Leave a blank line between paragraphs." /></label>
                  <label className="block text-sm font-bold text-brand-900">Story image or video (optional)<input className={inputClass} type="file" accept={acceptedTypes.join(',')} onChange={(event) => setCover(event.target.files?.[0] ?? null)} /></label>
                  <p className="text-xs leading-relaxed text-ink/60">Images are compressed before upload. Videos may be MP4, WebM, or MOV up to 50 MB. Stories publish immediately in the selected category.</p>
                  <button className={buttonClass} disabled={busy}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}Publish now</button>
                </form>
              </section>

              <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg sm:p-8">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-700"><ImagePlus className="size-5" /></span><div><h2 className="text-xl font-bold text-brand-900">Add gallery photos</h2><p className="text-sm text-ink/60">These appear in the photo gallery. Use Publish a story above to choose a category and publish an image or video under View all stories.</p></div></div>
                <form className="mt-6 space-y-4" onSubmit={uploadGallery}>
                  <label className="block text-sm font-bold text-brand-900">Caption (optional)<input className={inputClass} maxLength={180} value={galleryCaption} onChange={(event) => setGalleryCaption(event.target.value)} /></label>
                  <label className="block text-sm font-bold text-brand-900">Photos<input className={inputClass} type="file" accept={acceptedImageTypes.join(',')} multiple required onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))} /></label>
                  <p className="text-xs leading-relaxed text-ink/60">Each photo is compressed for the free storage allowance. Maximum stored file size is 10 MB per image.</p>
                  <button className={buttonClass} disabled={busy || galleryFiles.length === 0}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}Publish {galleryFiles.length || ''} photo{galleryFiles.length === 1 ? '' : 's'}</button>
                </form>
              </section>
            </div>

            <section className="mt-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-brand-900">Published content</h2><button className="rounded-full border border-brand-200 px-4 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50" disabled={busy} onClick={() => void loadContent()}>Refresh</button></div>
              {posts.length === 0 ? <p className="mt-5 text-sm text-ink/60">No admin posts yet.</p> : <ul className="mt-4 divide-y divide-brand-100">{posts.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-600">{item.kind}</span><p className="font-semibold text-brand-900">{item.title}</p><time className="text-xs text-ink/50">{new Date(item.created_at).toLocaleString()}</time></div><button aria-label={`Delete ${item.title}`} className="grid size-10 place-items-center rounded-full text-red-600 hover:bg-red-50" disabled={busy} onClick={() => void deletePost(item)}><Trash2 className="size-4" /></button></li>)}</ul>}
            </section>

            <section className="mt-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg sm:p-8">
              <h2 className="text-xl font-bold text-brand-900">Gallery photos</h2>
              {gallery.length === 0 ? <p className="mt-5 text-sm text-ink/60">No admin gallery photos yet.</p> : <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{gallery.map((item) => <li key={item.id} className="overflow-hidden rounded-2xl border border-brand-100"><img src={item.image_url} alt={item.caption} className="aspect-video w-full object-cover" loading="lazy" /><div className="flex items-center justify-between gap-2 p-3"><p className="truncate text-sm font-semibold text-brand-900">{item.caption}</p><button aria-label={`Delete ${item.caption || 'photo'}`} className="grid size-9 shrink-0 place-items-center rounded-full text-red-600 hover:bg-red-50" disabled={busy} onClick={() => void deleteGalleryItem(item)}><Trash2 className="size-4" /></button></div></li>)}</ul>}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
