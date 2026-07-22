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
  bundleCount?: number
  bundlePrice?: number
  includes?: { ar: string; en: string }[]
  variantGroup?: string
  variantGroupNameAr?: string
  variantGroupNameEn?: string
  variantLabelAr?: string
  variantLabelEn?: string
}

export function groupServices(list: Service[]): Service[][] {
  const out: Service[][] = []
  const seen = new Map<string, number>()

  for (const service of list) {
    const key = service.variantGroup ?? service.nameEn
    const at = seen.get(key)

    if (at !== undefined) {
      out[at].push(service)
    } else {
      seen.set(key, out.length)
      out.push([service])
    }
  }

  return out
}

export const services: Service[] = [
  // ── MASSAGE ──
  {
    key: 'oilo-massage',
    category: 'massage',
    nameAr: 'مساج أويلو سبا',
    nameEn: 'Oilo Spa Massage',
    descriptionAr: 'تجربة مساج متكاملة تساعد على استرخاء الجسم وتنقلك إلى عالم من الراحة والدلال. كل لمسة مصممة بعناية لتمنحك يومًا أكثر هدوءًا ومتعة',
    descriptionEn: 'A complete massage experience that helps your body relax and transports you to a world of comfort. Every touch is carefully designed to give you a calmer, more enjoyable day',
    duration: '60 دقيقة',
    durationEn: '60 min',
    price: 195,
  },
  {
    key: 'swedish-60',
    category: 'massage',
    nameAr: 'المساج السويدي',
    nameEn: 'Swedish Massage',
    descriptionAr: 'مساج ينساب على الجسم بهدوء، يخفف التوتر ويعيد التوازن ويمنحك حالة من الصفاء والاسترخاء العميق',
    descriptionEn: 'A massage that flows gently across the body, relieving tension, restoring balance, and giving you a state of deep relaxation',
    duration: '60 دقيقة',
    durationEn: '60 min',
    price: 195,
  },
  {
    key: 'swedish-40',
    category: 'massage',
    nameAr: 'المساج السويدي',
    nameEn: 'Swedish Massage',
    descriptionAr: 'جلسة سويدية أقصر بنفس الانسياب والهدوء، مثالية لتخفيف التوتر بسرعة واستعادة التوازن',
    descriptionEn: 'A shorter Swedish session with the same gentle flow, ideal for quickly relieving tension and restoring balance',
    duration: '40 دقيقة',
    durationEn: '40 min',
    price: 170,
  },
  {
    key: 'hot-stone',
    category: 'massage',
    nameAr: 'مساج الأحجار الساخنة',
    nameEn: 'Hot Stone Massage',
    descriptionAr: 'مساج باستخدام أحجار دافئة توضع على نقاط محددة من الجسم، يساعد على تخفيف التوتر ويرفع مستوى الراحة والاسترخاء العميق',
    descriptionEn: 'A massage using warm stones placed on specific body points, helping relieve tension and elevating deep relaxation',
    price: 190,
  },
  {
    key: 'thai-60',
    category: 'massage',
    nameAr: 'المساج التايلاندي',
    nameEn: 'Thai Massage',
    descriptionAr: 'يساعد على تنشيط الجسم وتمديد العضلات ويحرر الطاقة ويمنحك إحساسًا بالخفة والراحة العميقة',
    descriptionEn: 'Helps energize the body, stretch muscles, release energy, and gives you a feeling of lightness and deep comfort',
    duration: '60 دقيقة',
    durationEn: '60 min',
    price: 195,
  },
  {
    key: 'thai-40',
    category: 'massage',
    nameAr: 'المساج التايلاندي',
    nameEn: 'Thai Massage',
    descriptionAr: 'جلسة تايلاندية أقصر تركز على تمديد العضلات وتحرير الطاقة لإحساس سريع بالخفة والانتعاش',
    descriptionEn: 'A shorter Thai session focused on stretching muscles and releasing energy for a quick feeling of lightness and refreshment',
    duration: '40 دقيقة',
    durationEn: '40 min',
    price: 170,
  },
  {
    key: 'shiatsu',
    category: 'massage',
    nameAr: 'مساج شياتسو',
    nameEn: 'Shiatsu Massage',
    descriptionAr: 'مساج ياباني يعتمد على الضغط بأصابع اليد على نقاط محددة لتحفيز الطاقة وتخفيف التوتر وتحسين الدورة الدموية',
    descriptionEn: 'A Japanese massage that uses finger pressure on specific points to stimulate energy, relieve tension, and improve blood circulation',
    duration: '40 دقيقة',
    durationEn: '40 min',
    price: 170,
  },

  // ── MOROCCAN BATH ──
  {
    key: 'royal-bath',
    category: 'bath',
    nameAr: 'حمام ملكي بزيت الأرجان',
    nameEn: 'Royal Bath with Argan Oil',
    descriptionAr: 'حمام مغربي ملكي يجمع بين التقشير والترطيب العميق باستخدام زيت الأرجان الطبيعي، ليترك البشرة ناعمة ومغذية ومشرقة ويمنح إحساسًا بالاسترخاء الفاخر',
    descriptionEn: 'A royal Moroccan bath combining exfoliation and deep moisturizing with natural argan oil, leaving skin soft, nourished, and radiant with a sense of luxurious relaxation',
    price: 400,
  },
  {
    key: 'dead-sea-bath',
    category: 'bath',
    nameAr: 'حمام بطين البحر الميت والأعشاب العطرية',
    nameEn: 'Dead Sea Clay & Aromatic Herbs Bath',
    descriptionAr: 'تنظيف عميق للجسم باستخدام طين البحر الميت لإزالة السموم والشوائب، مع أعشاب عطرية تمنحك رائحة منعشة وإحساس استرخاء عميق',
    descriptionEn: 'Deep body cleansing using Dead Sea clay to remove toxins and impurities, with aromatic herbs that give you a refreshing scent and deep relaxation',
    price: 250,
  },
  {
    key: 'classic-bath',
    category: 'bath',
    nameAr: 'حمام مغربي كلاسيكي',
    nameEn: 'Classic Moroccan Clay Bath',
    descriptionAr: 'تنظيف عميق باستخدام الطين المغربي الطبيعي مع تقشير وترطيب للبشرة، يترك الجلد ناعمًا ومتجددًا ومشرقًا ويمنح إحساس راحة واسترخاء',
    descriptionEn: 'Deep cleansing with natural Moroccan clay, exfoliation and moisturizing that leaves skin soft, renewed, and radiant with a sense of comfort and relaxation',
    price: 140,
  },

  // ── GROOMING ──
  {
    key: 'mani-pedi',
    category: 'grooming',
    nameAr: 'بديكير اليدين والقدمين',
    nameEn: 'Hand & Foot Pedicure',
    descriptionAr: 'عناية متكاملة بالأظافر والجلد تشمل تقليم وتشكيل الأظافر، إزالة الجلد الميت وترطيب البشرة لتصبح اليدين والقدمين ناعمتين ومرتبتين وصحيتين',
    descriptionEn: 'Complete nail and skin care including trimming, shaping, dead skin removal, and moisturizing for smooth, neat, and healthy hands and feet',
    price: 175,
  },
  {
    key: 'pedi',
    category: 'grooming',
    nameAr: 'بدكير قدم',
    nameEn: 'Foot Pedicure',
    descriptionAr: 'عناية وتنظيف للقدمين والأظافر.',
    descriptionEn: 'Care and grooming for feet and nails.',
    price: 100,
  },
  {
    key: 'facial',
    category: 'grooming',
    nameAr: 'تنظيف البشرة',
    nameEn: 'Facial Cleansing',
    descriptionAr: 'تنظيف عميق للبشرة يزيل الشوائب ويمنح البشرة صفاء ونعومة وانتعاش',
    descriptionEn: 'Deep facial cleansing that removes impurities and gives your skin clarity, softness, and freshness',
    price: 170,
  },
  {
    key: 'jacuzzi',
    category: 'grooming',
    nameAr: 'جاكوزي',
    nameEn: 'Jacuzzi',
    descriptionAr: 'تجربة استرخاء مائية فاخرة تعيد توازن الجسم وتمنحك إحساس بالراحة والانتعاش',
    descriptionEn: 'A luxurious water relaxation experience that restores body balance and gives you a sense of comfort and freshness',
    price: 50,
  },

  // ── PACKAGES ──
  {
    key: 'royal-package',
    category: 'offer',
    nameAr: 'الباقة الملكية',
    nameEn: 'Royal Package',
    descriptionAr: 'تجربة فاخرة متكاملة تشمل مساج أويلو سبا مع الأحجار الساخنة لمدة 60 دقيقة وحمام مغربي ملكي بزيت الأرجان وبديكير اليدين والقدمين وتنظيف بشرة وجاكوزي ومشروبات ساخنة وباردة',
    descriptionEn: 'A complete luxury experience including 60-minute Oilo Spa massage with hot stones, Royal Moroccan bath with argan oil, hand & foot pedicure, skin care, jacuzzi, and hot & cold beverages',
    includes: [
      { ar: 'مساج Oilo سبا مع الأحجار الساخنة 60 دقيقة', en: 'Oilo Spa Massage with hot stones — 60 min' },
      { ar: 'حمام مغربي ملكي بزيت الأرجان', en: 'Royal Moroccan Bath with Argan Oil' },
      { ar: 'بديكير اليدين والقدمين', en: 'Hand & Foot Pedicure' },
      { ar: 'تنظيف بشرة', en: 'Skin Care' },
      { ar: 'جاكوزي', en: 'Jacuzzi' },
      { ar: 'الاستمتاع بالمشروبات الساخنة والباردة', en: 'Hot & Cold Beverages' },
    ],
    price: 690,
    originalPrice: 1130,
  },
  {
    key: 'vip-package',
    category: 'offer',
    nameAr: 'باقة VIP',
    nameEn: 'VIP Package',
    descriptionAr: 'تجربة متكاملة تشمل مساج أويلو سبا 40 دقيقة وحمام مغربي بطين البحر الميت والأعشاب العطرية وبديكير اليدين والقدمين وتنظيف بشرة وجاكوزي ومشروبات ساخنة وباردة',
    descriptionEn: 'A complete experience including 40-minute Oilo Spa massage, Moroccan hammam with Dead Sea mud and aromatic herbs, hand & foot pedicure, skin care, jacuzzi, and hot & cold beverages',
    includes: [
      { ar: 'مساج Oilo سبا 40 دقيقة', en: 'Oilo Spa Massage — 40 min' },
      { ar: 'حمام مغربي بطين البحر الميت والأعشاب العطرية', en: 'Moroccan Hammam with Dead Sea Mud & Aromatic Herbs' },
      { ar: 'بديكير اليدين والقدمين', en: 'Hand & Foot Pedicure' },
      { ar: 'تنظيف بشرة', en: 'Skin Care' },
      { ar: 'جاكوزي', en: 'Jacuzzi' },
      { ar: 'الاستمتاع بالمشروبات الساخنة والباردة', en: 'Hot & Cold Beverages' },
    ],
    price: 490,
  },

  // ── OFFERS ──
  {
    key: 'offer-massage-pedi',
    category: 'offer',
    nameAr: 'عرض خاص: مساج + بديكير',
    nameEn: 'Special Offer: Massage + Pedicure',
    descriptionAr: 'مساج للاسترخاء واستعادة النشاط مع بديكير اليدين والقدمين للعناية الكاملة',
    descriptionEn: 'A relaxing massage to restore energy combined with hand & foot pedicure for complete care',
    includes: [
      { ar: 'مساج للاسترخاء', en: 'Relaxing massage' },
      { ar: 'بديكير اليدين والقدمين', en: 'Hand & Foot Pedicure' },
    ],
    price: 310,
  },
  {
    key: 'foot-crack-care',
    category: 'offer',
    nameAr: 'عناية تشققات القدمين',
    nameEn: 'Cracked Heel Care',
    descriptionAr: 'علاج متخصص لتشققات وجفاف كعب القدمين، يزيل الجلد المتشقق ويعيد للقدمين النعومة والترطيب العميق. الجلسة 250 ريال، وباقة 3 جلسات بـ 600 ريال.',
    descriptionEn: 'A specialised treatment for cracked, dry heels that removes rough skin and restores deep softness and hydration. Single session 250 SAR, or a 3-session package for 600 SAR.',
    price: 250,
    bundleCount: 3,
    bundlePrice: 600,
  },
]

export const categories: { key: ServiceCategory; nameAr: string; nameEn: string }[] = [
  { key: 'massage', nameAr: 'المساج', nameEn: 'Massage' },
  { key: 'bath', nameAr: 'الحمام المغربي', nameEn: 'Moroccan Bath' },
  { key: 'grooming', nameAr: 'العناية', nameEn: 'Grooming' },
  // 'package' is intentionally absent: the Royal and VIP packages now live under
  // 'offer' so customers see one combined العروض tab instead of two competing
  // ones. The category is kept in the union type so existing filters still
  // compile — they simply match nothing.
  { key: 'offer', nameAr: 'العروض', nameEn: 'Offers' },
]

export function getServiceByKey(key: string): Service | undefined {
  return services.find(s => s.key === key)
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter(s => s.category === category)
}
