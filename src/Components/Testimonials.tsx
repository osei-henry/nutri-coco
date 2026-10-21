import { motion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'
import { testimonials } from '../Data/content'

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function Testimonials() {
  const { t } = useTranslation()

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-20 overflow-hidden bg-brand-900 py-16 text-white sm:py-24"
    >
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-0 size-96 rounded-full bg-brand-500/30 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-accent-500/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-5xl">
            {t('testimonials.title')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-200 to-accent-500" />
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map(({ id, name, role, quote }) => (
            <motion.figure
              key={id}
              variants={card}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors duration-300 hover:bg-white/10"
            >
              <Quote className="size-10 fill-accent-500 text-accent-500 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />

              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-white/90 sm:text-lg">
                {quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold shadow-lg">
                  {initials(name)}
                </span>
                <span>
                  <span className="block font-bold">{name}</span>
                  <span className="block text-sm text-white/60">{role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
