import { useState, useSyncExternalStore, useTransition } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, Leaf, Globe, Menu, X } from 'lucide-react'
import { languages } from '../i18n'

const MotionLink = motion.create(Link)

const items = [
  { id: 'home', to: '/#home', label: 'nav.home' },
  { id: 'services', to: '/#services', label: 'nav.services' },
  { id: 'blog', to: '/blog', label: 'blog.title' },
  { id: 'contact', to: '/#contact', label: 'nav.contact' },
] as const

const linkBase =
  'group relative px-3 py-2 text-sm font-semibold transition hover:text-brand-600'

const underlineBase =
  'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent-500 transition-transform duration-300'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const scrolled = useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true })
      return () => window.removeEventListener('scroll', onChange)
    },
    () => window.scrollY > 12,
    () => false,
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const current = i18n.resolvedLanguage ?? 'en'
  const currentLabel = languages.find((l) => l.code === current)?.label

  function changeLanguage(code: string) {
    setLangOpen(false)
    startTransition(async () => {
      await i18n.changeLanguage(code)
    })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-brand-100 bg-white/80 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex h-20 max-w-7xl items-center justify-between px-4 transition-opacity sm:px-6 ${
          isPending ? 'opacity-70' : ''
        }`}
      >
        {/* Logo */}
        <Link to="/#home" className="flex items-center gap-2.5">
          <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
            <Leaf className="size-5 shrink-0" />
            <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-accent-500" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-brand-900">
              Nutri Coco
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-accent-500">
              FRESH COCONUTS
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 xl:flex">
          {items.map(({ id, to, label }) =>
            id === 'blog' ? (
              <NavLink
                key={id}
                to={to}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'text-brand-600' : 'text-brand-900/80'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {t(label)}
                    <span
                      className={`${underlineBase} ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ) : (
              <Link
                key={id}
                to={to}
                className={`${linkBase} text-brand-900/80`}
              >
                {t(label)}
                <span
                  className={`${underlineBase} scale-x-0 group-hover:scale-x-100`}
                />
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              className="flex min-h-11 items-center gap-1.5 rounded-full border border-brand-100 bg-white/70 px-3 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
            >
              <Globe className="size-4 shrink-0 text-brand-600" />
              <span className="hidden sm:inline">{currentLabel}</span>
              <ChevronDown
                className={`size-4 shrink-0 transition-transform ${langOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {langOpen && (
              <button
                aria-label="Close language menu"
                onClick={() => setLangOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
            )}

            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-brand-100 bg-white p-1.5 shadow-xl shadow-brand-900/10"
                >
                  {languages.map(({ code, label }) => (
                    <li key={code} role="none">
                      <button
                        role="menuitem"
                        onClick={() => changeLanguage(code)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                          code === current
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-brand-900/80 hover:bg-brand-50'
                        }`}
                      >
                        {label}
                        {code === current && <Check className="size-4" />}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Book now (desktop) */}
          <MotionLink
            to="/#booking"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="group relative hidden overflow-hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent-500/30 sm:inline-block"
          >
            {t('nav.bookNow')}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </MotionLink>

          {/* Hamburger (mobile and tablet) */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-brand-100 bg-white/70 text-brand-900 xl:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-100 bg-white xl:hidden"
          >
            <nav className="mx-auto flex max-h-[calc(100dvh-5rem)] max-w-7xl flex-col gap-1 overflow-y-auto px-4 py-4">
              {items.map(({ id, to, label }) => (
                <Link
                  key={id}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-12 rounded-xl px-3 py-3 text-base font-semibold text-brand-900 transition hover:bg-brand-50"
                >
                  {t(label)}
                </Link>
              ))}
              <Link
                to="/#booking"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-accent-500 px-5 py-3 text-center font-bold text-white shadow-lg shadow-accent-500/30"
              >
                {t('nav.bookNow')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
