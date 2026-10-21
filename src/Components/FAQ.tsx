import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

const ids = ['order', 'delivery', 'products', 'location'] as const

export default function FAQ() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<(typeof ids)[number] | null>('order')

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-96 rounded-full bg-brand-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-balance text-brand-900 sm:text-5xl">
            {t('faq.title')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{t('faq.subtitle')}</p>
        </motion.div>

        {/* Questions */}
        <div className="mt-12 space-y-4">
          {ids.map((id, i) => {
            const isOpen = open === id
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/10'
                    : 'border-brand-100 bg-white hover:border-brand-200'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left sm:gap-4 sm:p-5"
                >
                  <span className="text-base font-bold leading-snug text-brand-900 sm:text-lg">
                    {t(`faq.items.${id}.q`)}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`grid size-9 shrink-0 place-items-center rounded-full ${
                      isOpen
                        ? 'bg-accent-500 text-white'
                        : 'bg-brand-100 text-brand-600'
                    }`}
                  >
                    <Plus className="size-5 shrink-0" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-base leading-relaxed text-ink/75 sm:px-5 sm:pb-5 sm:text-lg">
                        {t(`faq.items.${id}.a`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
