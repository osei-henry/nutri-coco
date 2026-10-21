import { motion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Truck, Leaf } from 'lucide-react'
import { clinic } from '../Data/clinic'

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const pop: Variants = { hidden: { opacity: 0, y: 24, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } } }
const wa = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent('Hello Nutri Coco, I would like to place an order.')}`
const highlights = [
  { heading: 'insurance.insurers', values: ['booking.delivery', 'booking.inPerson'], Icon: Truck },
  { heading: 'insurance.cards', values: ['services.items.fresh.title', 'services.items.water.title', 'services.items.lime.title'], Icon: Leaf },
]

export default function Insurance() {
  const { t } = useTranslation()
  return <section id="insurance" className="relative scroll-mt-20 overflow-hidden bg-brand-50 py-16 sm:py-24">
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold leading-tight text-balance text-brand-900 sm:text-5xl">{t('insurance.title')}</h2><div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" /><p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{t('insurance.subtitle')}</p>
      </motion.div>
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {highlights.map(({ heading, values, Icon }) => <div key={heading} className="rounded-3xl border border-brand-100 bg-white p-7 shadow-sm"><h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-brand-900"><span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-600"><Icon className="size-6" /></span>{t(heading)}</h3><motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-3 sm:grid-cols-2">{values.map((label) => <motion.li key={label} variants={pop} whileHover={{ scale: 1.04, y: -3 }} className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 font-semibold text-brand-900"><span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white"><Icon className="size-5" /></span>{t(label)}</motion.li>)}</motion.ul></div>)}
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 p-7 text-center text-white shadow-xl sm:flex-row sm:text-left"><p className="max-w-2xl text-base font-medium leading-relaxed sm:text-lg">{t('insurance.note')}</p><motion.a href={wa} target="_blank" rel="noreferrer" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-accent-500 px-6 py-3.5 font-bold text-white shadow-lg"><MessageCircle className="size-5" />{t('booking.submit')}</motion.a></motion.div>
    </div>
  </section>
}
