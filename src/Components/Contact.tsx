import { motion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Clock, MapPin, MessageCircle, Navigation } from 'lucide-react'
import { clinic } from '../Data/clinic'

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${clinic.name} ${clinic.address}`,
)}`

const whatsappLink = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(
  'Hello, I would like to ask a question.',
)}`

const cardClass =
  'group rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-500/10'

const iconClass =
  'grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 size-96 rounded-full bg-brand-100/60 blur-3xl"
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
          <h2 className="font-display text-3xl font-bold leading-tight text-balance text-brand-900 sm:text-5xl">
            {t('contact.title')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Info cards */}
          <motion.div
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-5"
          >
            <motion.div variants={item} className={cardClass}>
              <div className="flex gap-4">
                <span className={`${iconClass} bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-500/30`}>
                  <MapPin className="size-6" />
                </span>
                <div>
                  <h3 className="font-bold text-brand-900">{t('contact.address')}</h3>
                  <p className="mt-1 text-ink/70">{clinic.address}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className={cardClass}>
              <div className="flex gap-4">
                <span className={`${iconClass} bg-gradient-to-br from-accent-500 to-accent-600 shadow-accent-500/30`}>
                  <Clock className="size-6" />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-900">{t('contact.hours')}</h3>
                  <ul className="mt-2 space-y-2">
                    {clinic.hours.map(({ days, time }) => (
                      <li
                        key={days}
                        className="flex justify-between gap-4 border-b border-brand-100 pb-2 text-sm last:border-0"
                      >
                        <span className="font-semibold text-brand-900">{days}</span>
                        <span className="text-ink/70">{time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className={cardClass}>
              <div className="flex items-center gap-4">
                <span className={`${iconClass} bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30`}>
                  <MessageCircle className="size-6" />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-900">{t('contact.whatsapp')}</h3>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block font-semibold text-emerald-600 underline-offset-4 hover:underline"
                  >
                    {clinic.phoneDisplay}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-brand-100 shadow-xl shadow-brand-900/10"
          >
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              <rect width="400" height="300" fill="#f3f8ed" />
              {/* Parks and water */}
              <rect x="20" y="30" width="90" height="70" rx="12" fill="#d7f0df" />
              <rect x="290" y="190" width="95" height="85" rx="12" fill="#d7f0df" />
              <path d="M0 250 Q100 215 200 255 T400 235 L400 300 L0 300 Z" fill="#d6e7bb" />
              {/* Roads */}
              <g stroke="#fff" strokeLinecap="round" fill="none">
                <path d="M-10 120 L410 100" strokeWidth="16" />
                <path d="M150 -10 L190 310" strokeWidth="14" />
                <path d="M300 -10 L270 310" strokeWidth="12" />
                <path d="M-10 200 L410 190" strokeWidth="9" />
                <path d="M60 -10 L90 310" strokeWidth="8" />
              </g>
              {/* Buildings */}
              <g fill="#dce8d3">
                <rect x="200" y="30" width="40" height="40" rx="6" />
                <rect x="320" y="30" width="50" height="45" rx="6" />
                <rect x="210" y="130" width="45" height="40" rx="6" />
                <rect x="320" y="125" width="45" height="45" rx="6" />
                <rect x="100" y="130" width="35" height="45" rx="6" />
              </g>
            </svg>

            {/* Pin */}
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-full">
              <span className="absolute left-1/2 top-full size-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent-500/40" />
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <span className="max-w-[calc(100vw-5rem)] rounded-full bg-white px-3 py-1.5 text-center text-xs font-bold text-brand-900 shadow-lg">
                  {clinic.name}
                </span>
                <MapPin className="size-12 fill-accent-500 text-white drop-shadow-lg" />
              </motion.div>
            </div>

            <motion.a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-brand-600/30"
            >
              <Navigation className="size-4" />
              Google Maps
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
