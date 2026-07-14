// ════════════════════════════════════════════════════════════════
// Adapts the Al Nahda menu (nahdaServices) into the SAME shape the
// homepage design consumes, so /al-nahda renders with the identical
// layout/components — only the content differs.
//
// NOTE: service card images are brand placeholders for now; unique
// per-service Al Nahda images are the pending "image review" task.
// ════════════════════════════════════════════════════════════════
import type { Service, ServiceCategory } from '@/lib/services'
import { nahdaServices } from '@/lib/nahdaServices'
import { branches } from '@/lib/branches'

const b = branches['al-nahda']

// Map the Nahda category set onto the homepage's ServiceCategory tabs.
const CATEGORY_MAP: Record<string, ServiceCategory> = {
  massage: 'massage',
  addon: 'grooming',
  pedicure: 'grooming',
  bath: 'bath',
  package: 'package',
  offer: 'offer',
}

// Al Nahda cards use the branch's own image set.
const NAHDA_IMG = '/services/nahda-hero.webp'
export const nahdaAboutImage = NAHDA_IMG

const AD_SAFE_SERVICE_COPY: Record<string, Partial<Pick<Service, 'nameAr' | 'nameEn' | 'descriptionAr' | 'descriptionEn'>>> = {
  'dry-massage': {
    nameAr: 'جلسة عافية جافة',
    nameEn: 'Dry Wellness Session',
    descriptionAr: 'جلسة احترافية تركز على نقاط التوتر وتساعد على الراحة وتوازن الجسم، وتناسب من لا يفضلون الزيوت.',
    descriptionEn: 'A professional wellness session focused on tension points, comfort and body balance, ideal for guests who prefer no oils.',
  },
  'chinese-massage': {
    nameAr: 'جلسة توازن صينية',
    nameEn: 'Chinese Balance Session',
    descriptionAr: 'تقنيات عناية متخصصة لراحة الجسم ودعم الإحساس بالتوازن والنشاط.',
    descriptionEn: 'Specialized body-care techniques for comfort, balance and renewed energy.',
  },
  'shiatsu-massage': {
    nameAr: 'جلسة شياتسو للتوازن',
    nameEn: 'Shiatsu Balance Session',
    descriptionAr: 'جلسة مستوحاة من تقنيات شياتسو التقليدية لدعم الاسترخاء والتوازن الداخلي.',
    descriptionEn: 'A session inspired by traditional Shiatsu techniques to support relaxation and inner balance.',
  },
  'aroma-oil-massage': {
    nameAr: 'جلسة زيوت عطرية',
    nameEn: 'Aromatic Oil Wellness Session',
    descriptionAr: 'جلسة عناية بزيوت عطرية مختارة لتعزيز الشعور بالراحة والهدوء.',
    descriptionEn: 'A wellness session with selected aromatic oils for comfort and calm.',
  },
  'swedish-massage': {
    nameAr: 'جلسة سويدية للاسترخاء',
    nameEn: 'Swedish Relaxation Session',
    descriptionAr: 'جلسة عافية بتقنيات لطيفة تساعد على الراحة وتخفيف الإجهاد اليومي.',
    descriptionEn: 'A gentle wellness session that supports comfort and eases everyday stress.',
  },
  'hot-stone-massage': {
    nameAr: 'جلسة أحجار دافئة',
    nameEn: 'Warm Stone Wellness Session',
    descriptionAr: 'جلسة عناية باستخدام أحجار دافئة لتعزيز الراحة والاسترخاء.',
    descriptionEn: 'A body-care session using warm stones to support comfort and relaxation.',
  },
  'mix-massage': {
    nameAr: 'جلسة عناية منوعة',
    nameEn: 'Signature Wellness Session',
    descriptionAr: 'مزيج من تقنيات العناية الاحترافية في جلسة واحدة لتجربة متوازنة.',
    descriptionEn: 'A blend of professional care techniques in one balanced session.',
  },
  'addon-warm-oil': { nameAr: 'إضافة الزيت الدافئ', nameEn: 'Warm Oil Add-on' },
  'addon-compress': { nameAr: 'إضافة الكمادات العشبية', nameEn: 'Herbal Compress Add-on' },
  'addon-wood': { nameAr: 'إضافة أدوات العناية الخشبية', nameEn: 'Wood Therapy Add-on' },
  'addon-cupping': { nameAr: 'إضافة كاسات الهواء', nameEn: 'Cupping Add-on' },
  'addon-foot': { nameAr: 'إضافة عناية القدمين', nameEn: 'Foot Care Add-on' },
  'mani-pedi-vip': { nameAr: 'بديكير بريميوم يد وقدم مع قناع البارافين', nameEn: 'Premium Manicure & Pedicure with Paraffin Mask' },
  'bath-classic': { nameAr: 'عناية مغربية تقليدية', nameEn: 'Traditional Moroccan Body Care' },
  'bath-herbal': { nameAr: 'عناية الأعشاب', nameEn: 'Herbal Body Care' },
  'bath-vip': { nameAr: 'عناية بريميوم', nameEn: 'Premium Body Care' },
  'bath-royal': { nameAr: 'عناية ملكية', nameEn: 'Royal Body Care' },
  'pkg-vip': { nameAr: 'باقة بريميوم', nameEn: 'Premium Package' },
  'pkg-grooms-day': { nameAr: 'باقة تجهيز العريس - يوم واحد', nameEn: 'Groom Care Package - One Day' },
  'pkg-grooms-program': { nameAr: 'برنامج تجهيز العريس - 3 أسابيع', nameEn: 'Groom Care Program - 3 Weeks' },
  'offer-massage-bath': {
    nameAr: 'عرض خاص: مساج استرخائي + حمام مغربي',
    nameEn: 'Special Offer: Relaxing Massage + Moroccan Bath',
    descriptionAr: 'مساج احترافي يخفف التوتر ويعيد النشاط مع حمام مغربي لتنقية الجسم واستعادة الحيوية.',
    descriptionEn: 'A professional massage for relaxation and renewed energy, paired with a Moroccan bath for a refreshing body cleanse.',
  },
  'offer-massage-pedi': {
    nameAr: 'عرض خاص: مساج + بديكير',
    nameEn: 'Special Offer: Massage + Pedicure',
    descriptionAr: 'مساج للاسترخاء واستعادة النشاط مع بديكير اليدين والقدمين للعناية الكاملة.',
    descriptionEn: 'A relaxing massage paired with hand and foot pedicure for complete care.',
  },
}

function adSafeText(text: string) {
  return text
    .replace(/المساج/g, 'جلسات العافية')
    .replace(/جلسات مساج/g, 'جلسات عافية')
    .replace(/مساج/g, 'جلسة عافية')
    .replace(/الحمامات المغربية/g, 'العناية المغربية')
    .replace(/حمام مغربي/g, 'عناية مغربية')
    .replace(/حمام/g, 'عناية')
    .replace(/massage sessions/gi, 'wellness sessions')
    .replace(/massage with/gi, 'wellness session with')
    .replace(/massage/g, 'wellness session')
    .replace(/Moroccan baths/gi, 'Moroccan body care')
    .replace(/Moroccan bath/gi, 'Moroccan body care')
    .replace(/bath/g, 'body care')
    .replace(/VIP/g, 'Premium')
}

export const nahdaServicesAsServices: Service[] = nahdaServices.map(s => ({
  key: s.key,
  category: CATEGORY_MAP[s.category] ?? 'grooming',
  nameAr: AD_SAFE_SERVICE_COPY[s.key]?.nameAr ?? adSafeText(s.nameAr),
  nameEn: AD_SAFE_SERVICE_COPY[s.key]?.nameEn ?? adSafeText(s.nameEn),
  descriptionAr: AD_SAFE_SERVICE_COPY[s.key]?.descriptionAr ?? adSafeText(s.descriptionAr),
  descriptionEn: AD_SAFE_SERVICE_COPY[s.key]?.descriptionEn ?? adSafeText(s.descriptionEn),
  duration: s.durationAr,
  durationEn: s.durationEn,
  price: s.price,
  includes: s.includes?.map(item => ({ ar: adSafeText(item.ar), en: adSafeText(item.en) })),
}))

// Each Al Nahda service has its OWN unique spa image (free-license Pexels,
// object/ambience shots — no people). One file per service key.
export const nahdaServiceImages: Record<string, string> = Object.fromEntries(
  nahdaServices.map(s => [s.key, `/services/nahda-${s.key}.webp`]),
)

// Tabs to show on the Nahda services section (same component, branch tabs).
export const nahdaCategoriesTabs: { key: ServiceCategory; nameAr: string; nameEn: string }[] = [
  { key: 'massage', nameAr: 'جلسات العافية', nameEn: 'Wellness Sessions' },
  { key: 'bath', nameAr: 'العناية المغربية', nameEn: 'Moroccan Body Care' },
  { key: 'grooming', nameAr: 'البديكير والإضافات', nameEn: 'Pedicure & Add-ons' },
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
