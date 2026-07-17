// ════════════════════════════════════════════════════════════════
// Adapts the Al Nahda menu (nahdaServices) into the SAME shape the
// homepage design consumes, so /al-nahda renders with the identical
// layout/components — only the content differs.
//
// NOTE: service card images are brand placeholders for now; unique
// per-service Al Nahda images are the pending "image review" task.
// ════════════════════════════════════════════════════════════════
import { variantFields, type Service, type ServiceCategory } from '@/lib/services'
import { nahdaServices, type NahdaCategory } from '@/lib/nahdaServices'
import { branches } from '@/lib/branches'

const b = branches['al-nahda']

// Map the Nahda category set onto the homepage's ServiceCategory tabs.
const CATEGORY_MAP: Record<NahdaCategory, ServiceCategory> = {
  massage: 'massage',
  bath: 'bath',
  pedicure: 'grooming',
  oilBath: 'grooming',
  facial: 'grooming',
  package: 'package',
  offer: 'offer',
}

// Al Nahda cards use the branch's own image set.
const NAHDA_IMG = '/services/nahda-hero.webp'
export const nahdaAboutImage = NAHDA_IMG

export const nahdaServicesAsServices: Service[] = nahdaServices.map(s => ({
  key: s.key,
  category: CATEGORY_MAP[s.category] ?? 'grooming',
  nameAr: s.nameAr,
  nameEn: s.nameEn,
  descriptionAr: s.descriptionAr,
  descriptionEn: s.descriptionEn,
  duration: s.durationAr,
  durationEn: s.durationEn,
  price: s.price,
  includes: s.includes,
  ...variantFields(s.key),
}))

// Only for keys whose file isn't named plainly after them.
//
// The -v2 files had their contents replaced (they used to be copies of another
// service's photo). public/ is served `immutable, max-age=31536000`, so a
// browser that already fetched the old bytes will never ask again — the
// filename is the cache key, and a new one is the only way the new picture ever
// reaches a returning visitor. Rename rather than overwrite when a photo
// changes; do not add a ?v= query, next/image rejects it unless every local
// image path is enumerated in images.localPatterns.
const SERVICE_IMAGE_OVERRIDES: Record<string, string> = {
  'addon-compress': '/services/nahda-addon-compress-v2.webp',
  'addon-cupping': '/services/nahda-addon-cupping-v2.webp',
  'addon-foot': '/services/nahda-addon-foot-v2.webp',
  'addon-wood': '/services/nahda-addon-wood-v2.webp',
  'addon-warm-oil': '/services/nahda-addon-warm-oil-v2.webp',
  'warm-olive-oil-60': '/services/nahda-addon-warm-oil-v2.webp',
  'bath-vip': '/services/nahda-bath-vip-v2.webp',
  'mani': '/services/nahda-mani-v2.webp',
  'mani-pedi-vip': '/services/nahda-mani-pedi-vip-v2.webp',
  'mix-massage': '/services/nahda-mix-massage-v2.webp',
  'offer-massage-pedi': '/services/nahda-offer-massage-pedi-v2.webp',
  'shiatsu-massage': '/services/nahda-shiatsu-massage-v2.webp',
  // Variants of one card, sharing that card's photo by design (SERVICE_VARIANTS).
  'oil-bath-steam': '/services/nahda-oil.webp',
  'oil-bath-protein-keratin': '/services/nahda-oil.webp',
  'regular-facial-cleansing': '/services/nahda-care.webp',
  'vitamin-c-facial': '/services/nahda-care.webp',
  'senior-facial-cleansing': '/services/nahda-care.webp',
  'combination-skin-cleansing': '/services/nahda-care.webp',
  'mix-facial-cleansing': '/services/nahda-care.webp',
}

// Every other service resolves to its own /services/nahda-<key>.webp.
export const nahdaServiceImages: Record<string, string> = Object.fromEntries(
  nahdaServices.map(s => [s.key, SERVICE_IMAGE_OVERRIDES[s.key] ?? `/services/nahda-${s.key}.webp`]),
)

// Tabs to show on the Nahda services section (same component, branch tabs).
export const nahdaCategoriesTabs: { key: ServiceCategory; nameAr: string; nameEn: string }[] = [
  { key: 'massage', nameAr: 'المساج', nameEn: 'Massage' },
  { key: 'bath', nameAr: 'الحمامات المغربية', nameEn: 'Moroccan Baths' },
  { key: 'grooming', nameAr: 'العناية والبديكير', nameEn: 'Care & Pedicure' },
  { key: 'package', nameAr: 'الباقات', nameEn: 'Packages' },
  { key: 'offer', nameAr: 'العروض', nameEn: 'Offers' },
]

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
