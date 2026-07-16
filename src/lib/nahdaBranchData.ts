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

const SERVICE_IMAGE_OVERRIDES: Record<string, string> = {
  'warm-olive-oil-60': '/services/nahda-addon-warm-oil.webp',
  'foot-peeling': '/services/nahda-pedi.webp',
  'paraffin-hand-mask': '/services/nahda-mani.webp',
  'paraffin-foot-mask': '/services/nahda-pedi.webp',
  'oil-bath-steam': '/services/nahda-oil.webp',
  'oil-bath-protein-keratin': '/services/nahda-oil.webp',
  'charcoal-mask': '/services/nahda-care.webp',
  'face-scrub': '/services/nahda-care.webp',
  'moroccan-clay-mask': '/services/nahda-care.webp',
  'regular-facial-cleansing': '/services/nahda-care.webp',
  'vitamin-c-facial': '/services/nahda-care.webp',
  'senior-facial-cleansing': '/services/nahda-care.webp',
  'combination-skin-cleansing': '/services/nahda-care.webp',
  'mix-facial-cleansing': '/services/nahda-care.webp',
  'nose-strip': '/services/nahda-care.webp',
}

// Each service prefers its own branch image where one exists. The remaining
// entries above are small add-ons with no photo of their own; they borrow the
// shot of the area they happen in, which is why a few still coincide.
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
