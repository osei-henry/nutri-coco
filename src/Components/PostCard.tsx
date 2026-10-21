import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  CalendarDays,
} from 'lucide-react'
import type { Post } from '../Data/posts'
import { categoryMeta, formatDate } from '../Data/blog'

export default function PostCard({
  post,
  index = 0,
}: {
  post: Post
  index?: number
}) {
  const { t, i18n } = useTranslation()
  const { icon: Icon, gradient } = categoryMeta[post.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
      className="h-full"
    >
      <motion.article
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="h-full"
      >
        <Link
          to={`/blog/${post.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand-500/15"
        >
          {/* Cover */}
          <div className="relative h-48 overflow-hidden">
            {post.cover && post.coverIsVideo ? (
              <video src={post.cover} muted playsInline preload="metadata" className="size-full object-cover" />
            ) : post.cover ? (
              <img
                src={post.cover}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div
                className={`grid size-full place-items-center bg-gradient-to-br ${gradient}`}
              >
                <Icon className="size-16 text-white/90 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-125" />
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 shadow">
              {t(`blog.categories.${post.category}`)}
            </span>
          </div>

          {/* Text */}
          <div className="flex flex-1 flex-col p-6">
            {post.date && (
              <time
                dateTime={post.date}
                className="flex items-center gap-1.5 text-sm font-semibold text-ink/50"
              >
                <CalendarDays className="size-4" />
                {formatDate(post.date, i18n.resolvedLanguage ?? 'en')}
              </time>
            )}
            <h3 className="mt-3 text-xl font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-3 leading-relaxed text-ink/70">
              {post.excerpt}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-accent-500">
              {t('blog.readMore')}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </div>
        </Link>
      </motion.article>
    </motion.div>
  )
}
