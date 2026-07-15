// Oilo membership tiers.
// Prices are demo/placeholder — grounded in real per-session value (~240 SAR for a
// 60-min massage / classic Moroccan bath). Member sessions are redeemable on any
// massage or Moroccan bath; premium baths, packages and offers get the tier discount.
// Real service catalogue lives in ./services.ts and is what these memberships cover.

export type MembershipKey = '5' | '10' | '20'

export interface MembershipTier {
  key: MembershipKey
  sessions: number
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
  price: number          // member price (demo)
  originalPrice: number  // sum of sessions at normal value
  discount: number       // member discount on all services, %
  validAr: string
  validEn: string
  popular?: boolean
  perksAr: string[]
  perksEn: string[]
}

// Anchor: 1 session = 240 SAR (legacy membership valuation).
const SESSION_VALUE = 240

export const membershipTiers: MembershipTier[] = [
  {
    key: '5',
    sessions: 5,
    nameAr: 'عضوية البداية',
    nameEn: 'Essential',
    taglineAr: 'بداية مثالية لروتين عناية منتظم',
    taglineEn: 'The perfect start to a regular care routine',
    price: 1080,
    originalPrice: 5 * SESSION_VALUE, // 1200
    discount: 10,
    validAr: 'صالحة ٣ أشهر',
    validEn: 'Valid for 3 months',
    perksAr: [
      '٥ جلسات مساج أو حمام مغربي كلاسيكي',
      'خصم ١٠٪ على كل الخدمات والباقات الإضافية',
      'مشروبات ساخنة وباردة مع كل زيارة',
      'جاكوزي مجاني في زيارتك الأولى',
    ],
    perksEn: [
      '5 massage or classic Moroccan bath sessions',
      '10% off all extra services and packages',
      'Hot & cold beverages on every visit',
      'Complimentary jacuzzi on your first visit',
    ],
  },
  {
    key: '10',
    sessions: 10,
    nameAr: 'عضوية النخبة',
    nameEn: 'Elite',
    taglineAr: 'الأكثر اختيارًا — توازن مثالي بين القيمة والدلال',
    taglineEn: 'Most chosen — the ideal balance of value and indulgence',
    price: 2040,
    originalPrice: 10 * SESSION_VALUE, // 2400
    discount: 15,
    validAr: 'صالحة ٦ أشهر',
    validEn: 'Valid for 6 months',
    popular: true,
    perksAr: [
      '١٠ جلسات مساج أو حمام مغربي كلاسيكي',
      'خصم ١٥٪ على كل الخدمات والباقات',
      'أولوية في الحجز وأوقات مرنة',
      'جاكوزي مجاني مع كل جلسة',
      'بطاقة هدية بقيمة ٢٠٠ ﷼',
    ],
    perksEn: [
      '10 massage or classic Moroccan bath sessions',
      '15% off all services and packages',
      'Priority booking and flexible times',
      'Complimentary jacuzzi with every session',
      '200 SAR gift card',
    ],
  },
  {
    key: '20',
    sessions: 20,
    nameAr: 'العضوية الملكية',
    nameEn: 'Royal',
    taglineAr: 'تجربة سنة كاملة من الراحة والعناية الفاخرة',
    taglineEn: 'A full year of relaxation and premium care',
    price: 3840,
    originalPrice: 20 * SESSION_VALUE, // 4800
    discount: 20,
    validAr: 'صالحة ١٢ شهرًا',
    validEn: 'Valid for 12 months',
    perksAr: [
      '٢٠ جلسة مساج أو حمام مغربي كلاسيكي',
      'خصم ٢٠٪ على كل الخدمات والعروض',
      'أعلى أولوية في الحجز',
      'جاكوزي ومشروبات مجانية مع كل زيارة',
      'ترقية مجانية لباقتين ملكيتين',
      'مدير عناية شخصي لتنسيق جلساتك',
    ],
    perksEn: [
      '20 massage or classic Moroccan bath sessions',
      '20% off all services and offers',
      'Highest booking priority',
      'Free jacuzzi & beverages on every visit',
      'Two complimentary Royal package upgrades',
      'A personal care manager to plan your sessions',
    ],
  },
]

export function getMembershipTier(key: string): MembershipTier | undefined {
  return membershipTiers.find(t => t.key === key)
}
