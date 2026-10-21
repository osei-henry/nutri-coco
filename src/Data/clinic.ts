import { Citrus, Leaf, CupSoda, type LucideIcon } from 'lucide-react'

export const clinic = {
  name: 'Nutri Coco',
  whatsappNumber: '233550207703',
  phoneDisplay: '+233 55 020 7703',
  address: 'Airport City, Accra, Ghana',
  hours: [
    { days: 'Mon – Fri', time: '8:00 AM – 8:00 PM' },
    { days: 'Saturday', time: '9:00 AM – 2:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
} as const

export const services = [
  { id: 'fresh', icon: Leaf },
  { id: 'water', icon: CupSoda },
  { id: 'lime', icon: Citrus },
] as const satisfies readonly { id: string; icon: LucideIcon }[]

export type ServiceId = (typeof services)[number]['id']

export const purchaseOptions = ['delivery', 'inPerson'] as const


