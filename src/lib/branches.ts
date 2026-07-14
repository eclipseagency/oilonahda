// ════════════════════════════════════════════════════════════════
// Oilo Spa Al Nahda branch. Single source of truth for branch identity used by
// SEO metadata, JSON-LD LocalBusiness, booking, and the sitemap.
//
// NOTE: Al Nahda's address, map pin, hours and phone are confirmed (location
// from the client's Google Maps share link + own number 0556733851, June 2026).
// ════════════════════════════════════════════════════════════════

export type BranchId = 'al-nahda'

export interface BranchHours {
  dailyAr: string; dailyEn: string; dailyTime: string
  fridayAr: string; fridayEn: string; fridayTime: string
}

export interface Branch {
  id: BranchId
  slug: string                 // URL path segment
  nameAr: string; nameEn: string
  districtAr: string; districtEn: string
  taglineAr: string; taglineEn: string
  heroImage: string            // /public path
  cardImage: string            // image used on the selector hub
  addressAr: string; addressEn: string
  mapsLink: string
  geo: { lat: number; lng: number } | null   // null = not yet confirmed
  phone: string                // local format for tel:
  whatsapp: string             // intl digits for wa.me
  hours: BranchHours
  /** true when location data is confirmed; false = placeholder */
  locationConfirmed: boolean
}

// Al Nahda keeps its own hours (10 AM – 6 AM daily, Friday 4 PM – 6 AM).
const NAHDA_HOURS: BranchHours = {
  dailyAr: 'السبت – الخميس', dailyEn: 'Sat – Thu', dailyTime: '١٠ صباحًا – ٦ صباحًا',
  fridayAr: 'الجمعة', fridayEn: 'Friday', fridayTime: '٤ عصرًا – ٦ صباحًا',
}

export const branches: Record<BranchId, Branch> = {
  'al-nahda': {
    id: 'al-nahda',
    slug: 'al-nahda',
    nameAr: 'فرع النهضة', nameEn: 'Al Nahda Branch',
    districtAr: 'حي النهضة', districtEn: 'Al Nahda',
    taglineAr: 'فرعنا الجديد', taglineEn: 'Our new branch',
    heroImage: '/services/nahda-hero.webp',
    cardImage: '/services/nahda-hero.webp',
    addressAr: 'شارع سلمان الفارسي، حي النهضة، الرياض ١٠٠١١',
    addressEn: 'Salman Al Farisi Street, Al Nahda, Riyadh 10011',
    mapsLink: 'https://maps.app.goo.gl/XAj26BEYUN9rBZp58',
    geo: { lat: 24.7585401, lng: 46.8133352 },
    phone: '0556733851',
    whatsapp: '966556733851',
    hours: NAHDA_HOURS,
    locationConfirmed: true,
  },
}

export const branchList: Branch[] = [branches['al-nahda']]
