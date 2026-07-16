import { nahdaServices, type NahdaCategory } from './nahdaServices'

export type ServiceCategory = 'massage' | 'bath' | 'grooming' | 'package' | 'offer'

export interface Service {
  key: string
  category: ServiceCategory
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  duration?: string
  durationEn?: string
  price?: number
  originalPrice?: number
  includes?: { ar: string; en: string }[]
  // Set for menu items that are types of one treatment (see SERVICE_VARIANTS).
  variantGroup?: string
  variantGroupNameAr?: string
  variantGroupNameEn?: string
  variantLabelAr?: string
  variantLabelEn?: string
}

// Some menu items are types of a single treatment, not separate treatments:
// the five facial cleansings are one procedure in one room at five price
// points, and the two oil baths differ only by what goes in the hair. Listing
// them as sibling cards forced every card to show the same room photo. They
// share a card with a type toggle instead — the way the 60/40 min massages do.
type VariantMeta = {
  group: string
  groupNameAr: string; groupNameEn: string
  labelAr: string; labelEn: string
}
const FACIAL = { group: 'facial-cleansing', groupNameAr: 'تنظيف البشرة', groupNameEn: 'Facial Cleansing' }
const OIL_BATH = { group: 'oil-bath', groupNameAr: 'حمام زيت', groupNameEn: 'Oil Bath' }

export const SERVICE_VARIANTS: Record<string, VariantMeta> = {
  'regular-facial-cleansing': { ...FACIAL, labelAr: 'عادي', labelEn: 'Regular' },
  'vitamin-c-facial': { ...FACIAL, labelAr: 'فيتامين سي', labelEn: 'Vitamin C' },
  'senior-facial-cleansing': { ...FACIAL, labelAr: 'كبار السن', labelEn: 'Senior' },
  'combination-skin-cleansing': { ...FACIAL, labelAr: 'مختلطة', labelEn: 'Combination' },
  'mix-facial-cleansing': { ...FACIAL, labelAr: 'مكس', labelEn: 'Mix' },
  'oil-bath-steam': { ...OIL_BATH, labelAr: 'بالبخار', labelEn: 'Steam' },
  'oil-bath-protein-keratin': { ...OIL_BATH, labelAr: 'بروتين أو كرياتين', labelEn: 'Protein / Keratin' },
}

export function variantFields(key: string) {
  const v = SERVICE_VARIANTS[key]
  if (!v) return {}
  return {
    variantGroup: v.group,
    variantGroupNameAr: v.groupNameAr,
    variantGroupNameEn: v.groupNameEn,
    variantLabelAr: v.labelAr,
    variantLabelEn: v.labelEn,
  }
}

// Collapse a service list into cards: variants of one treatment share a card,
// as do same-named duration variants. Preserves menu order.
export function groupServices(list: Service[]): Service[][] {
  const out: Service[][] = []
  const seen = new Map<string, number>()
  for (const s of list) {
    const key = s.variantGroup ?? s.nameEn
    const at = seen.get(key)
    if (at !== undefined) out[at].push(s)
    else { seen.set(key, out.length); out.push([s]) }
  }
  return out
}

const CATEGORY_MAP: Record<NahdaCategory, ServiceCategory> = {
  massage: 'massage',
  bath: 'bath',
  pedicure: 'grooming',
  oilBath: 'grooming',
  facial: 'grooming',
  package: 'package',
  offer: 'offer',
}

export const services: Service[] = nahdaServices.map((service) => ({
  key: service.key,
  category: CATEGORY_MAP[service.category],
  nameAr: service.nameAr,
  nameEn: service.nameEn,
  descriptionAr: service.descriptionAr,
  descriptionEn: service.descriptionEn,
  duration: service.durationAr,
  durationEn: service.durationEn,
  price: service.price,
  includes: service.includes,
  ...variantFields(service.key),
}))

export const categories: { key: ServiceCategory; nameAr: string; nameEn: string }[] = [
  { key: 'massage', nameAr: 'المساج', nameEn: 'Massage' },
  { key: 'bath', nameAr: 'الحمام المغربي', nameEn: 'Moroccan Bath' },
  { key: 'grooming', nameAr: 'العناية والبديكير', nameEn: 'Care & Pedicure' },
  { key: 'package', nameAr: 'الباقات', nameEn: 'Packages' },
  { key: 'offer', nameAr: 'العروض', nameEn: 'Offers' },
]

export function getServiceByKey(key: string): Service | undefined {
  return services.find(s => s.key === key)
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter(s => s.category === category)
}
