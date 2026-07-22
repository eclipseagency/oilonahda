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
  'oilo-massage': '/services/nahda-dry-massage.webp',
  'swedish-60': '/services/nahda-mix-massage-v2.webp',
  'swedish-40': '/services/nahda-mix-massage-v2.webp',
  'hot-stone': '/services/nahda-hot-stone-massage.webp',
  'warm-olive-oil': '/services/nahda-addon-warm-oil-v2.webp',
  'air-cupping': '/services/nahda-addon-cupping-v2.webp',
  'wood-60': '/services/nahda-addon-wood-v2.webp',
  'wood-30': '/services/nahda-addon-wood-v2.webp',
  'warm-compress': '/services/nahda-addon-compress-v2.webp',
  'aromatherapy': '/services/nahda-aroma-oil-massage.webp',
  'reflexology-60': '/services/therapy.webp',
  'reflexology-40': '/services/therapy.webp',
  'reflexology-30': '/services/therapy.webp',
  'thai-60': images.thai,
  'thai-40': images.thai,
  'shiatsu': '/services/nahda-shiatsu-massage-v2.webp',
  'royal-bath': images.royalBath,
  'dead-sea-bath': '/services/nahda-bath-vip-v2.webp',
  'classic-bath': images.classicBath,
  'mani-pedi': images.maniPedi,
  'pedi': '/services/nahda-pedi.webp',
  'hand-pedi': '/services/nahda-mani-v2.webp',
  'vip-pedi-paraffin': '/services/nahda-mani-pedi-vip-v2.webp',
  'facial': images.facial,
  'facial-vitc': '/services/nahda-care.webp',
  'charcoal-mask': '/services/nahda-charcoal-mask.webp',
  'face-scrub': '/services/nahda-face-scrub.webp',
  'jacuzzi': images.jacuzzi,
  'royal-package': '/services/nahda-pkg-royal.webp',
  'vip-package': '/services/nahda-pkg-vip.webp',
  'offer-massage-pedi': '/services/nahda-offer-massage-pedi-v2.webp',
  'offer-massage-bath': '/services/eid-offer-bath.webp',
  'foot-crack-care': '/services/nahda-foot-peeling.webp',
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
