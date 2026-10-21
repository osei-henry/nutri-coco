import {
  Citrus,
  Droplets,
  Leaf,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from './posts'

export const categoryMeta = {
  fresh: { icon: Leaf, gradient: 'from-brand-500 to-brand-700' },
  water: { icon: Droplets, gradient: 'from-brand-600 to-brand-700' },
  lime: { icon: Citrus, gradient: 'from-accent-500 to-accent-600' },
  news: { icon: Newspaper, gradient: 'from-brand-700 to-brand-900' },
} as const satisfies Record<Category, { icon: LucideIcon; gradient: string }>

const dateLocales: Record<string, string> = {
  en: 'en-GB',
  tw: 'en-GB',
  ga: 'en-GB',
  ha: 'ha',
  fr: 'fr',
}

export function formatDate(iso: string, lang: string) {
  return new Intl.DateTimeFormat(dateLocales[lang] ?? 'en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
