import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { categories, type Category } from '../Data/posts'
import PostCard from '../Components/PostCard'
import { clinic } from '../Data/clinic'
import { useSitePosts } from '../hooks/useSiteContent'

type Filter = Category | 'all'

const filters: readonly Filter[] = ['all', ...categories]

export default function Blog() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const { posts } = useSitePosts()

  const visible =
    filter === 'all'
      ? posts
      : posts.filter((post) => post.category === filter)

  return (
    <>
      <title>{`${t('blog.title')} | ${clinic.name}`}</title>

      <section className="relative min-h-screen overflow-hidden bg-brand-50 pb-24 pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-20 size-96 rounded-full bg-brand-200/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-10 size-96 rounded-full bg-accent-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-display text-[clamp(2rem,9vw,3.75rem)] font-bold leading-tight text-balance text-brand-900 sm:text-6xl">
              {t('blog.title')}
            </h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{t('blog.subtitle')}</p>
          </motion.div>

          {/* Category filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {filters.map((f) => {
              const active = f === filter
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative min-h-11 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-5 ${
                    active ? 'text-white' : 'text-brand-700 hover:bg-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="blog-filter"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 shadow-lg shadow-brand-600/30"
                    />
                  )}
                  <span className="relative">
                    {f === 'all' ? t('blog.all') : t(`blog.categories.${f}`)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Posts (the key makes the cards animate in again on every filter) */}
          {visible.length > 0 ? (
            <div
              key={filter}
              className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-16 text-center text-base text-ink/60 sm:text-lg">
              {t('blog.empty')}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
