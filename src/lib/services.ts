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
