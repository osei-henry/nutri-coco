import { motion, useScroll } from 'motion/react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CalendarDays, MessageCircle } from 'lucide-react'
import type { Block } from '../Data/posts'
import { categoryMeta, formatDate } from '../Data/blog'
import { clinic } from '../Data/clinic'
import { useSitePosts } from '../hooks/useSiteContent'

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          key={index}
          className="mt-10 font-display text-2xl font-bold text-brand-900 sm:text-3xl"
        >
          {block.text}
        </h2>
      )
    case 'p':
      return (
        <p key={index} className="mt-5 text-base leading-relaxed text-ink/80 sm:text-lg">
          {block.text}
        </p>
      )
    case 'image':
      return (
        <figure key={index} className="mt-8">
          <img
            src={block.src}
            alt={block.caption ?? ''}
            loading="lazy"
            className="w-full rounded-3xl shadow-xl shadow-brand-900/10"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-ink/60">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'video': {
      const isFile = /\.(mp4|webm)$/i.test(block.src)
      return (
        <figure key={index} className="mt-8">
          <div className="aspect-video overflow-hidden rounded-3xl bg-brand-900 shadow-xl shadow-brand-900/10">
            {isFile ? (
              <video src={block.src} controls className="size-full" />
            ) : (
              <iframe
                src={block.src}
                title={block.caption ?? 'Video'}
                allowFullScreen
                loading="lazy"
                className="size-full"
              />
            )}
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-ink/60">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }
  }
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const { t, i18n } = useTranslation()
  const { scrollYProgress } = useScroll()
  const { posts, loading } = useSitePosts()
  const post = posts.find((item) => item.slug === slug)

  if (loading && !post) {
    return <section className="grid min-h-screen place-items-center bg-brand-50 px-4 pt-20">Loading…</section>
  }

  if (!post) {
    return (
      <section className="grid min-h-screen place-items-center bg-brand-50 px-4 pt-20 text-center">
        <div>
          <p className="font-display text-7xl font-bold text-brand-600">404</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 font-bold text-accent-500"
          >
            <ArrowLeft className="size-5" />
            {t('blog.back')}
          </Link>
        </div>
      </section>
    )
  }

  const { icon: Icon, gradient } = categoryMeta[post.category]
  const shareLink = `https://wa.me/?text=${encodeURIComponent(
    `${post.title}\n${window.location.href}`,
  )}`

  return (
    <>
      <title>{`${post.title} | ${clinic.name}`}</title>

      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand-500 to-accent-500"
      />

      <article className="bg-white pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-bold text-brand-600 transition-colors hover:text-accent-500"
          >
            <ArrowLeft className="size-5" />
            {t('blog.back')}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-brand-100 px-3 py-1 font-bold text-brand-700">
              {t(`blog.categories.${post.category}`)}
            </span>
            {post.date && (
              <time
                dateTime={post.date}
                className="flex items-center gap-1.5 font-semibold text-ink/60"
              >
                <CalendarDays className="size-4" />
                {formatDate(post.date, i18n.resolvedLanguage ?? 'en')}
              </time>
            )}
          </div>

          <h1 className="mt-4 font-display text-[clamp(2rem,9vw,3rem)] font-bold leading-tight text-balance text-brand-900 sm:text-5xl">
            {post.title}
          </h1>

          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-8 overflow-hidden rounded-3xl shadow-2xl shadow-brand-900/15"
          >
            {post.cover && post.coverIsVideo ? (
              <video src={post.cover} controls playsInline className="w-full" />
            ) : post.cover ? (
              <img src={post.cover} alt="" className="w-full" />
            ) : (
              <div
                className={`grid h-56 place-items-center bg-gradient-to-br sm:h-72 ${gradient}`}
              >
                <Icon className="size-20 text-white/90" />
              </div>
            )}
          </motion.div>

          {/* Post content */}
          <div>{post.content.map(renderBlock)}</div>

          {/* Share and book */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white sm:flex-row">
            <motion.a
              href="/#booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-accent-500 px-7 py-3.5 font-bold shadow-lg shadow-accent-500/30"
            >
              {t('nav.bookNow')}
            </motion.a>
            <motion.a
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-7 py-3.5 font-bold shadow-lg shadow-emerald-500/30"
            >
              <MessageCircle className="size-5" />
              WhatsApp
            </motion.a>
          </div>
        </div>
      </article>
    </>
  )
}
