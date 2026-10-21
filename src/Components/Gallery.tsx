import { useEffect, useEffectEvent, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '../Data/content'
import { useSiteGallery } from '../hooks/useSiteContent'

const gradients = [
  'from-brand-500 to-brand-700',
  'from-accent-500 to-accent-600',
  'from-brand-600 to-accent-500',
  'from-brand-700 to-brand-900',
] as const

function Picture({
  item,
  index,
  large = false,
}: {
  item: GalleryItem
  index: number
  large?: boolean
}) {
  if (item.src) {
    return (
      <img
        src={item.src}
        alt={item.caption}
        loading="lazy"
        className={
          large
            ? 'max-h-[65dvh] max-w-[calc(100vw-2rem)] rounded-2xl object-contain sm:max-h-[75vh] sm:rounded-3xl'
            : 'size-full bg-white object-cover object-top'
        }
      />
    )
  }
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br ${
        gradients[index % gradients.length]
      } ${large ? 'h-[60vh] w-[min(90vw,48rem)] rounded-3xl' : 'size-full'}`}
    >
      <Camera className={large ? 'size-24 text-white/90' : 'size-12 text-white/90'} />
    </div>
  )
}

export default function Gallery() {
  const { t } = useTranslation()
  const galleryItems = useSiteGallery()
  const [open, setOpen] = useState<number | null>(null)
  const total = galleryItems.length

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (open === null) return
    if (e.key === 'Escape') setOpen(null)
    if (e.key === 'ArrowRight') setOpen((open + 1) % total)
    if (e.key === 'ArrowLeft') setOpen((open - 1 + total) % total)
  })

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current = open === null ? null : galleryItems[open]

  return (
    <section
      id="gallery"
      className="relative scroll-mt-20 overflow-hidden bg-brand-50 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-balance text-brand-900 sm:text-5xl">
            {t('gallery.title')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{t('gallery.subtitle')}</p>
        </motion.div>

        {/* Photo grid */}
        <div className="mt-10 grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-3 min-[400px]:auto-rows-[10rem] sm:mt-14 sm:auto-rows-[13rem] sm:gap-4 md:grid-cols-3">
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ${
                item.tall ? 'row-span-2' : ''
              }`}
            >
              <div className="size-full transition-transform duration-500 group-hover:scale-110">
                <Picture item={item} index={i} />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/85 to-transparent p-4 text-left text-sm font-semibold text-white opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                {item.caption}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[70] grid place-items-center bg-brand-900/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <button
              aria-label={t('gallery.close')}
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
            >
              <X className="size-6" />
            </button>

            <button
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation()
                setOpen((open - 1 + total) % total)
              }}
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:left-6"
            >
              <ChevronLeft className="size-7" />
            </button>

            <button
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation()
                setOpen((open + 1) % total)
              }}
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:right-6"
            >
              <ChevronRight className="size-7" />
            </button>

            <motion.figure
              key={current.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[calc(100dvh-2rem)] max-w-full flex-col items-center"
            >
              <Picture item={current} index={open} large />
              <figcaption className="mt-3 max-w-[calc(100vw-2rem)] text-center text-base font-semibold text-white sm:mt-4 sm:text-lg">
                {current.caption}
                <span className="ml-3 text-sm font-normal text-white/60">
                  {open + 1} / {total}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
