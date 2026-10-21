import { useActionState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Leaf,
  MessageCircle,
  Phone,
  Send,
  Truck,
  User,
} from 'lucide-react'
import { clinic, purchaseOptions, services } from '../Data/clinic'

type Values = {
  name: string
  phone: string
  service: string
  purchaseMode: string
  notes: string
}

type FormState = {
  status: 'idle' | 'error' | 'success'
  values: Values
  link?: string
}

const emptyValues: Values = {
  name: '',
  phone: '',
  service: '',
  purchaseMode: 'delivery',
  notes: '',
}

const initialState: FormState = { status: 'idle', values: emptyValues }

const inputBase =
  'w-full rounded-xl border bg-brand-50/50 py-3 pr-4 text-ink outline-none transition focus:bg-white focus:ring-4'

const inputOk =
  'border-brand-100 focus:border-brand-500 focus:ring-brand-500/15'

const inputBad =
  'border-accent-500 bg-accent-500/5 focus:border-accent-500 focus:ring-accent-500/15'

export default function Booking() {
  const { t, i18n } = useTranslation()

  const [state, formAction, isPending] = useActionState(
    (_previous: FormState, formData: FormData): FormState => {
      const get = (key: keyof Values) => String(formData.get(key) ?? '').trim()
      const values: Values = {
        name: get('name'),
        phone: get('phone'),
        service: get('service'),
        purchaseMode: get('purchaseMode') || 'delivery',
        notes: get('notes'),
      }

      const phoneOk = values.phone.replace(/\D/g, '').length >= 9
      if (!values.name || !phoneOk || !values.service) {
        toast.error(t('booking.error'))
        return { status: 'error', values }
      }

      // The message for the manager is always written in English
      const en = i18n.getFixedT('en')
      const message = [
        `Hello ${clinic.name}, I would like to place an order.`,
        '',
        `Name: ${values.name}`,
        `Phone: ${values.phone}`,
        `Order: ${en(`services.items.${values.service}.title`)}`,
        `Purchase option: ${en(`booking.${values.purchaseMode}`)}`,
        ...(values.notes ? [`Notes: ${values.notes}`] : []),
      ].join('\n')

      const link = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(link, '_blank', 'noopener,noreferrer')
      toast.success(t('booking.success'), { duration: 7000 })

      return { status: 'success', values: emptyValues, link }
    },
    initialState,
  )

  const showErrors = state.status === 'error'
  const phoneOk = state.values.phone.replace(/\D/g, '').length >= 9
  const bad = {
    name: showErrors && !state.values.name,
    phone: showErrors && !phoneOk,
    service: showErrors && !state.values.service,
  }

  const cls = (invalid: boolean) =>
    `${inputBase} ${invalid ? inputBad : inputOk}`

  return (
    <section
      id="booking"
      className="relative scroll-mt-20 overflow-hidden bg-brand-50 py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 size-96 rounded-full bg-accent-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 size-96 rounded-full bg-brand-200/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5">
        {/* Info panel */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-2xl shadow-brand-900/25 sm:p-8 lg:col-span-2"
        >
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-16 -top-16 size-56 rounded-full bg-accent-500/40 blur-2xl"
          />
          <div className="relative">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <CalendarDays className="size-7 shrink-0" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-balance sm:text-4xl">
              {t('booking.title')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {t('booking.subtitle')}
            </p>

            <a
              href={`tel:+${clinic.whatsappNumber}`}
              className="mt-8 flex items-center gap-3 font-semibold transition hover:text-brand-100"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15">
                <Phone className="size-5 shrink-0" />
              </span>
              {clinic.phoneDisplay}
            </a>

            <h3 className="mt-8 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/70">
              <Clock className="size-4 shrink-0" />
              {t('contact.hours')}
            </h3>
            <ul className="mt-3 space-y-2">
              {clinic.hours.map(({ days, time }) => (
                <li
                  key={days}
                  className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-white/10 pb-2 text-sm"
                >
                  <span className="font-semibold">{days}</span>
                  <span className="text-white/80">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>

        {/* Form */}
        <motion.form
          action={formAction}
          noValidate
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-brand-100 bg-white p-4 shadow-xl shadow-brand-900/10 sm:p-8 lg:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-brand-900">
                {t('booking.name')}
              </span>
              <span className="relative block">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand-500" />
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  defaultValue={state.values.name}
                  className={`${cls(bad.name)} pl-11`}
                />
              </span>
            </label>

            {/* Phone */}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-brand-900">
                {t('booking.phone')}
              </span>
              <span className="relative block">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand-500" />
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  defaultValue={state.values.phone}
                  className={`${cls(bad.phone)} pl-11`}
                />
              </span>
            </label>

            {/* Service */}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-brand-900">
                {t('booking.service')}
              </span>
              <span className="relative block">
                <Leaf className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand-500" />
                <select
                  name="service"
                  defaultValue={state.values.service}
                  className={`${cls(bad.service)} pl-11`}
                >
                  <option value="" disabled>
                    {t('booking.selectService')}
                  </option>
                  {services.map(({ id }) => (
                    <option key={id} value={id}>
                      {t(`services.items.${id}.title`)}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            {/* Delivery or in-person purchase */}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-brand-900">
                {t('booking.insurance')}
              </span>
              <span className="relative block">
                <Truck className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand-500" />
                <select
                  name="purchaseMode"
                  defaultValue={state.values.purchaseMode}
                  className={`${cls(false)} pl-11`}
                >
                  {purchaseOptions.map((option) => (
                    <option key={option} value={option}>
                      {t(`booking.${option}`)}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            {/* Notes */}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-brand-900">
                {t('booking.notes')}
              </span>
              <textarea
                name="notes"
                rows={3}
                defaultValue={state.values.notes}
                className={`${cls(false)} resize-none pl-4`}
              />
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative mt-7 flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-500 px-3 py-3 text-base font-bold text-white shadow-xl shadow-emerald-500/30 disabled:opacity-70 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg"
          >
            <MessageCircle className="size-5 shrink-0 sm:size-6" />
            {isPending ? t('booking.sending') : t('booking.submit')}
            <Send className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </motion.button>

          {/* Success message with a backup link in case the pop-up was blocked */}
          <AnimatePresence>
            {state.status === 'success' && state.link && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                className="mt-5 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50"
              >
                <div className="flex items-start gap-3 p-4">
                  <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      {t('booking.success')}
                    </p>
                    <a
                      href={state.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm font-bold text-emerald-700 underline underline-offset-4"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  )
}
