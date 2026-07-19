import { categories, services, type ServiceCategory } from './services'

export type NahdaCategory = ServiceCategory

export interface NahdaService {
  key: string
  category: NahdaCategory
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  durationAr?: string
  durationEn?: string
  price?: number
  originalPrice?: number
  includes?: { ar: string; en: string }[]
}

export const nahdaCategories: { id: NahdaCategory; titleAr: string; titleEn: string }[] =
  categories.map((category) => ({
    id: category.key,
    titleAr: category.nameAr,
    titleEn: category.nameEn,
  }))

export const nahdaServices: NahdaService[] = services.map((service) => ({
  key: service.key,
  category: service.category,
  nameAr: service.nameAr,
  nameEn: service.nameEn,
  descriptionAr: service.descriptionAr,
  descriptionEn: service.descriptionEn,
  durationAr: service.duration,
  durationEn: service.durationEn,
  price: service.price,
  originalPrice: service.originalPrice,
  includes: service.includes,
}))

export const nahdaBridalNoteAr = 'تتوفر خدمة تجهيز العرسان مع حلاق خاص (يلزم حجز مسبق).'
export const nahdaBridalNoteEn = 'Groom preparation with a dedicated barber is available by advance booking.'
