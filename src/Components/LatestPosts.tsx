import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { useSitePosts } from '../hooks/useSiteContent'
import PostCard from './PostCard'

export default function LatestPosts() {
  const { t } = useTranslation()
  const { posts } = useSitePosts()
  const latest = posts.slice(0, 3)

  return (
    <section
      id="latest"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-brand-50 to-white py-16 sm:py-24"
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
            {t('blog.latest')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        </motion.div>

        {/* Newest posts */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 font-bold text-white shadow-xl shadow-brand-600/30"
            >
              {t('blog.viewAll')}
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
