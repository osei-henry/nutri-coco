import { motion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Leaf } from 'lucide-react'

const offers = [
  { id: 'whole', image: '/doctors/Coconut.jpeg', alt: 'Fresh coconut', crop: 'object-center' },
  { id: 'water', image: '/doctors/image.png', alt: 'Fresh coconut water', crop: 'object-center' },
  { id: 'lime', image: '/doctors/How%20To%20Make%20The%20Perfect%20Lemon%20Cucumber%20Mint%20Infused%20Water%20At%20Home%20Best%20Organic%20Lemon%20Mint%20Water%20Reci.jpeg', alt: 'A fresh lime drink', crop: 'object-center' },
]
const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const card: Variants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Doctors() {
  const { t } = useTranslation()
  return <section id="doctors" className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24">
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold leading-tight text-balance text-brand-900 sm:text-5xl">{t('doctors.title')}</h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{t('doctors.subtitle')}</p>
      </motion.div>
      <motion.div variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map(({ id, image, alt, crop }) => <motion.article key={id} variants={card} whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }} className="group overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm hover:shadow-2xl hover:shadow-brand-500/15">
          <div className="relative h-64 overflow-hidden bg-brand-50"><img src={image} alt={alt} loading="lazy" className={`size-full object-cover transition-transform duration-700 group-hover:scale-105 ${crop}`} /><span className="absolute bottom-4 right-5 grid size-11 place-items-center rounded-full bg-accent-500 text-white shadow-lg"><Leaf className="size-5" /></span></div>
          <div className="p-6 text-center"><h3 className="text-xl font-bold text-brand-900">{t(`doctors.roles.${id}`)}</h3><a href="#booking" className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white">{t('nav.bookNow')}<ArrowRight className="size-4" /></a></div>
        </motion.article>)}
      </motion.div>
    </div>
  </section>
}
