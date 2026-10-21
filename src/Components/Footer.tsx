import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Leaf, MapPin, Phone } from 'lucide-react'
import { clinic } from '../Data/clinic'

const links = [
  { id: 'home', to: '/#home', label: 'nav.home' },
  { id: 'services', to: '/#services', label: 'nav.services' },
  { id: 'blog', to: '/blog', label: 'blog.title' },
  { id: 'contact', to: '/#contact', label: 'nav.contact' },
  { id: 'admin', to: '/admin', label: 'footer.admin' },
] as const

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-brand-500/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link to="/#home" className="flex items-center gap-2.5">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
              <Leaf className="size-6 shrink-0" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-brand-900 bg-accent-500" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">Nutri Coco</span>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-accent-500">
                FRESH COCONUTS
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-white/70">{t('footer.tagline')}</p>
        </div>

        {/* Links */}
        <nav>
          <ul className="grid grid-cols-2 gap-3 sm:max-w-xs">
            {links.map(({ id, to, label }) => (
              <li key={id}>
                <Link
                  to={to}
                  className="font-semibold text-white/80 transition hover:text-accent-500"
                >
                  {t(label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="space-y-4 text-white/80">
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent-500" />
            {clinic.address}
          </p>
          <a
            href={`tel:+${clinic.whatsappNumber}`}
            className="flex items-center gap-3 font-semibold transition hover:text-white"
          >
            <Phone className="size-5 shrink-0 text-accent-500" />
            {clinic.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {clinic.name}. {t('footer.rights')}
      </div>
    </footer>
  )
}
