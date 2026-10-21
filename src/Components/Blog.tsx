import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { sortedPosts } from '../Data/posts'

export default function Blog() {
  const { t } = useTranslation()

  return (
    <section id="blog" className="relative overflow-hidden bg-brand-50/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[.18em] text-accent-600">
            {t('blog.latest')}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
            {t('blog.title')}
          </h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post, index) => {
            const media = post.content.find(
              (block) => block.type === 'image' || block.type === 'video',
            )

            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-lg shadow-brand-900/5"
              >
                {media?.type === 'image' && (
                  <img
                    src={media.src}
                    alt={media.caption ?? post.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                )}
                {media?.type === 'video' && (
                  <video
                    className="aspect-video w-full bg-brand-900 object-cover"
                    controls
                    preload="metadata"
                    aria-label={post.title}
                  >
                    <source src={media.src} type="video/mp4" />
                    Your browser does not support embedded videos.
                  </video>
                )}
                <div className="p-6 sm:p-7">
                  <span className="text-xs font-bold uppercase tracking-[.15em] text-accent-600">
                    {t(`blog.categories.${post.category}`)}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-brand-900">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {post.excerpt}
                  </p>
                  {media?.type === 'image' && media.caption && (
                    <p className="mt-4 text-xs font-medium text-ink/50">
                      {media.caption}
                    </p>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
