// ════════════════════════════════════════════════════════════════
// Adapts the standalone Al Nahda build to use the same public service
// catalog and card images as the main Oilo Spa site.
// ════════════════════════════════════════════════════════════════
import { categories, services, type Service, type ServiceCategory } from '@/lib/services'
import { images } from '@/lib/images'
import { branches } from '@/lib/branches'

const b = branches['al-nahda']

export const nahdaAboutImage = images.about

export const nahdaServicesAsServices: Service[] = services

export const nahdaServiceImages: Record<string, string> = {
  'oilo-massage': images.oiloMassage,
  'swedish-60': images.swedish,
  'swedish-40': images.swedish,
  'hot-stone': images.hotStone,
  'thai-60': images.thai,
  'thai-40': images.thai,
  'shiatsu': images.shiatsu,
  'royal-bath': images.royalBath,
  'dead-sea-bath': images.deadSeaBath,
  'classic-bath': images.classicBath,
  'mani-pedi': images.maniPedi,
  'pedi': '/services/nahda-pedi.webp',
  'facial': images.facial,
  'facial-vitc': images.facial,
  'charcoal-mask': images.facial,
  'face-scrub': images.facial,
  'jacuzzi': images.jacuzzi,
  'royal-package': images.candles,
  'vip-package': images.royalBath,
  'offer-massage-pedi': images.maniPedi,
  'foot-crack-care': '/services/nahda-foot-crack-care.webp',
}

// Tabs to show on the Nahda services section (same component, branch tabs).
export const nahdaCategoriesTabs: { key: ServiceCategory; nameAr: string; nameEn: string }[] = categories

export const nahdaLocation = {
  addressAr: b.addressAr,
  addressEn: b.addressEn,
  mapsLink: b.mapsLink,
  geo: b.geo ?? undefined,
  phone: b.phone,
  whatsapp: b.whatsapp,
  hoursDailyLabelAr: b.hours.dailyAr,
  hoursDailyLabelEn: b.hours.dailyEn,
  hoursDailyTime: b.hours.dailyTime,
  hoursFridayLabelAr: b.hours.fridayAr,
  hoursFridayLabelEn: b.hours.fridayEn,
  hoursFridayTime: b.hours.fridayTime,
}

export const nahdaWhatsapp = b.whatsapp
