import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CalendarCheck, Phone } from 'lucide-react'
import { clinic } from '../Data/clinic'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  const { t } = useTranslation()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 16,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 16,
  })

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onPointerLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-white pb-24 pt-32 lg:pt-36"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
            backgroundImage:
            'radial-gradient(#b8d98b 1.2px, transparent 1.2px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse at 60% 40%, black 10%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 60% 40%, black 10%, transparent 70%)',
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-24 size-96 rounded-full bg-brand-200/50 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-accent-500/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        {/* Text */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur"
          >
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2rem,9vw,3rem)] font-bold leading-[1.08] text-balance text-brand-900 sm:text-6xl lg:text-7xl"
          >
            {t('hero.title')}{' '}
            <span className="relative inline-block bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
              {t('hero.highlight')}
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 8 Q75 -2 150 6 T298 5"
                  stroke="#84b547"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg lg:mx-0"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.a
              href="#booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent-500 px-4 py-3 font-bold text-white shadow-xl shadow-accent-500/30 sm:w-auto sm:px-7 sm:py-4"
            >
              <CalendarCheck className="size-5 shrink-0" />
              {t('hero.ctaPrimary')}
              <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.a>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full border-2 border-brand-200 bg-white px-4 py-3 font-bold text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50 sm:w-auto sm:px-7 sm:py-3.5"
            >
              {t('hero.ctaSecondary')}
            </motion.a>
          </motion.div>

          <motion.a
            variants={item}
            href={`tel:+${clinic.whatsappNumber}`}
            className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-brand-900/80 transition hover:text-brand-600"
          >
            <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-brand-600">
              <Phone className="size-4" />
            </span>
            {clinic.phoneDisplay}
          </motion.a>
        </motion.div>

        {/* Floating coconut photograph with the original 3D tilt interaction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="mx-auto w-full max-w-xl pb-8 lg:pl-6"
        >
          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1100 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl shadow-brand-900/15">
                <img src="/Gallery/Tropical%20Coconut%20Refresh%20%F0%9F%A5%A5%F0%9F%8C%B4.jpeg" alt="Fresh coconut water with a touch of lime" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-brand-900 shadow-lg">Fresh coconut · A touch of lime</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
