// Branch service menu.
// Source: menu oilo 26.pdf, May 2026.

export type NahdaCategory =
  | 'massage'
  | 'bath'
  | 'pedicure'
  | 'oilBath'
  | 'facial'
  | 'package'
  | 'offer'

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
  fromPrice?: boolean
  bundleCount?: number
  bundlePrice?: number
  image?: string
  includes?: { ar: string; en: string }[]
}

export const nahdaCategories: { id: NahdaCategory; titleAr: string; titleEn: string }[] = [
  { id: 'massage', titleAr: 'المساج', titleEn: 'Massage' },
  { id: 'bath', titleAr: 'أنواع حمام المغربي', titleEn: 'Moroccan Baths' },
  { id: 'pedicure', titleAr: 'البديكير', titleEn: 'Pedicure' },
  { id: 'oilBath', titleAr: 'حمام زيت', titleEn: 'Oil Bath' },
  { id: 'facial', titleAr: 'البشرة', titleEn: 'Facials' },
  { id: 'package', titleAr: 'الباقات', titleEn: 'Packages' },
  { id: 'offer', titleAr: 'العروض الخاصة', titleEn: 'Special Offers' },
]

export const nahdaServices: NahdaService[] = [
  // MASSAGE
  {
    key: 'dry-massage', category: 'massage', price: 180,
    nameAr: 'مساج جاف', nameEn: 'Dry Massage',
    descriptionAr: 'يركز هذا النوع من المساج على الضغط على نقاط التوتر باستخدام اليدين والأصابع والمرفقين لتحفيز الدورة الدموية وتخفيف الشد العضلي، ويتم تطبيقه من خلال الملابس أو باستخدام منشفة. خيار ممتاز لمن يعانون من حساسية الجلد أو لا يفضلون الزيوت.',
    descriptionEn: 'A no-oil massage focused on pressure points using hands, fingers and elbows to stimulate circulation and ease muscle tension. Applied through clothing or with a towel, ideal for sensitive skin or guests who prefer no oils.',
  },
  {
    key: 'shiatsu-massage', category: 'massage', price: 190,
    nameAr: 'مساج شياتسو', nameEn: 'Shiatsu Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'تدليك ياباني تقليدي يركز على نقاط الطاقة في الجسم باستخدام الضغط بالأصابع والكفين. تساعد هذه التقنية على تحفيز الجسم على الشفاء الذاتي وتعزيز التوازن الداخلي، ومناسبة لمن يبحثون عن الاسترخاء العميق وتجديد النشاط.',
    descriptionEn: 'A traditional Japanese massage using finger and palm pressure on energy points to support deep relaxation, balance and renewed energy.',
  },
  {
    key: 'chinese-massage', category: 'massage', price: 220,
    nameAr: 'التدليك الصيني', nameEn: 'Chinese Massage',
    descriptionAr: 'يستخدم المعالجون راحة أيديهم وأطراف أصابعهم ومفاصلها للعجن واللف والفرك والضغط على الجسم على طول مسارات الطاقة ونقاط الوخز.',
    descriptionEn: 'A specialised massage where the therapist uses palms, fingertips and joints for kneading, rolling, rubbing and pressure along body energy pathways and acupressure points.',
  },
  {
    key: 'aroma-oil-massage', category: 'massage', price: 250,
    nameAr: 'مساج الزيوت العطرية', nameEn: 'Aromatic Oil Massage',
    descriptionAr: 'من أنواع المساج للرجال التي تستخدم الزيوت العطرية لتعزيز الشعور بالراحة والاسترخاء. يمكن اختيار الزيوت العطرية بناء على التفضيلات الشخصية والفوائد العلاجية المرغوبة.',
    descriptionEn: 'A relaxing massage using aromatic oils selected around your preferences and desired wellness benefits.',
  },
  {
    key: 'swedish-massage', category: 'massage', price: 170,
    nameAr: 'مساج سويدي', nameEn: 'Swedish Massage',
    descriptionAr: 'مساج يساعد على الاسترخاء وتخفيف التوتر العضلي وتحسين الدورة الدموية بحركات هادئة ومتوازنة.',
    descriptionEn: 'A calm, balanced massage designed to relax the body, ease muscle tension and support circulation.',
  },
  {
    key: 'addon-warm-oil', category: 'massage', price: 180,
    nameAr: 'مساج زيت الزيتون الدافئ', nameEn: 'Warm Olive Oil Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'مساج بزيت الزيتون الدافئ يساعد على الاسترخاء وتخفيف التوتر العضلي والعصبي وتحسين تدفق الدم.',
    descriptionEn: 'A warm olive oil massage that helps relaxation, eases muscular and nervous tension and improves blood flow.',
  },
  {
    key: 'warm-olive-oil-60', category: 'massage', price: 220,
    nameAr: 'مساج زيت الزيتون الدافئ', nameEn: 'Warm Olive Oil Massage',
    durationAr: '60 دقيقة', durationEn: '60 min',
    descriptionAr: 'جلسة أطول بزيت الزيتون الدافئ لمزيد من الراحة والاسترخاء العميق.',
    descriptionEn: 'A longer warm olive oil session for deeper comfort and relaxation.',
  },
  {
    key: 'addon-compress', category: 'massage', price: 250,
    nameAr: 'مساج الكمادات الدافئة', nameEn: 'Warm Compress Massage',
    descriptionAr: 'مساج بالكمادات الدافئة يساعد على توسعة الأوعية الدموية وتعزيز تدفق الدم وإرخاء العضلات المتشنجة.',
    descriptionEn: 'A warm compress massage that helps improve circulation and relax tense muscles.',
  },
  {
    key: 'addon-wood', category: 'massage', price: 250,
    nameAr: 'مساج الأخشاب', nameEn: 'Wood Therapy Massage',
    descriptionAr: 'مساج بأدوات خشبية مصممة لتدليك الجسم وتحفيز الأنسجة العميقة وتعزيز الشعور بالراحة.',
    descriptionEn: 'A massage using purpose-made wooden tools to stimulate deeper layers and support body relaxation.',
  },
  {
    key: 'addon-foot', category: 'massage', price: 150,
    nameAr: 'المساج الإنعكاسي للأقدام', nameEn: 'Foot Reflexology',
    descriptionAr: 'تدليك انعكاسي للأقدام يركز على نقاط الراحة ويمنح القدمين إحساسا بالاسترخاء والتجدد.',
    descriptionEn: 'Foot reflexology focused on comfort points to refresh tired feet and support relaxation.',
  },
  {
    key: 'hot-stone-massage', category: 'massage', price: 250,
    nameAr: 'مساج الأحجار الساخنة', nameEn: 'Hot Stone Massage',
    durationAr: 'ساعة', durationEn: '60 min',
    descriptionAr: 'مساج باستخدام أحجار ساخنة يساعد على تهدئة العضلات وتخفيف التوتر وتعزيز الاسترخاء.',
    descriptionEn: 'A hot stone massage that soothes muscles, eases tension and supports deep relaxation.',
  },
  {
    key: 'addon-cupping', category: 'massage', price: 250,
    nameAr: 'مساج كاسات الهواء', nameEn: 'Cupping Massage',
    durationAr: 'ساعة', durationEn: '60 min',
    descriptionAr: 'مساج كاسات الهواء يساعد على تنشيط الدورة الدموية وتخفيف الشد في الجسم.',
    descriptionEn: 'A cupping massage designed to stimulate circulation and ease body tightness.',
  },
  {
    key: 'mix-massage', category: 'massage', price: 475,
    nameAr: 'مساج مكس', nameEn: 'Mix Massage',
    descriptionAr: 'مزيج من تقنيات المساج في جلسة واحدة لتجربة متكاملة ومريحة.',
    descriptionEn: 'A combined massage session blending multiple techniques for a complete relaxation experience.',
  },

  // MOROCCAN BATHS
  {
    key: 'bath-classic', category: 'bath', price: 160,
    nameAr: 'حمام مغربي عادي', nameEn: 'Classic Moroccan Bath',
    descriptionAr: 'حمام مغربي عادي لتنظيف وتجديد البشرة باستخدام الطقوس المغربية الأساسية.',
    descriptionEn: 'A classic Moroccan bath for cleansing and refreshing the skin with the essential hammam ritual.',
  },
  {
    key: 'bath-herbal', category: 'bath', price: 250,
    nameAr: 'حمام الأعشاب المغربية', nameEn: 'Moroccan Herbal Bath',
    descriptionAr: 'حمام مغربي بالأعشاب المغربية للعناية بالجسم وتعزيز الإحساس بالنظافة والانتعاش.',
    descriptionEn: 'A Moroccan herbal bath for body care, cleansing and a refreshed feeling.',
  },
  {
    key: 'bath-vip', category: 'bath', price: 350,
    nameAr: 'حمام VIP', nameEn: 'VIP Bath',
    descriptionAr: 'حمام VIP بتجربة عناية أكثر تكاملا للجسم والبشرة.',
    descriptionEn: 'A VIP bath with a more complete body and skin care experience.',
  },
  {
    key: 'bath-royal', category: 'bath', price: 550,
    nameAr: 'حمام ملكي', nameEn: 'Royal Bath',
    descriptionAr: 'حمام ملكي فاخر يجمع العناية العميقة بالاسترخاء للحصول على تجربة حمام مغربي مميزة.',
    descriptionEn: 'A luxurious royal Moroccan bath combining deep care with relaxation.',
  },

  // PEDICURE
  {
    key: 'mani', category: 'pedicure', price: 90,
    nameAr: 'بدكير يد', nameEn: 'Hand Pedicure',
    descriptionAr: 'عناية وتنظيف لليدين والأظافر.',
    descriptionEn: 'Care and grooming for hands and nails.',
  },
  {
    key: 'pedi', category: 'pedicure', price: 120,
    nameAr: 'بدكير قدم', nameEn: 'Foot Pedicure',
    descriptionAr: 'عناية وتنظيف للقدمين والأظافر.',
    descriptionEn: 'Care and grooming for feet and nails.',
  },
  {
    key: 'foot-peeling', category: 'pedicure', price: 80,
    nameAr: 'تقشير القدم', nameEn: 'Foot Peeling',
    descriptionAr: 'تقشير للقدم يساعد على إزالة الخشونة وتجديد نعومة الجلد.',
    descriptionEn: 'Foot peeling to remove roughness and refresh skin softness.',
  },
  {
    key: 'paraffin-hand-mask', category: 'pedicure', price: 50,
    nameAr: 'قناع البرافين لليد', nameEn: 'Paraffin Hand Mask',
    descriptionAr: 'قناع برافين مرطب لليد.',
    descriptionEn: 'A hydrating paraffin mask for the hands.',
  },
  {
    key: 'paraffin-foot-mask', category: 'pedicure', price: 50,
    nameAr: 'قناع البرافين للقدم', nameEn: 'Paraffin Foot Mask',
    descriptionAr: 'قناع برافين مرطب للقدم.',
    descriptionEn: 'A hydrating paraffin mask for the feet.',
  },
  {
    key: 'mani-pedi-vip', category: 'pedicure', price: 300,
    nameAr: 'بدكير يد وقدم VIP', nameEn: 'VIP Hand & Foot Pedicure',
    descriptionAr: 'بدكير VIP متكامل لليدين والقدمين.',
    descriptionEn: 'A complete VIP pedicure experience for hands and feet.',
  },

  // OIL BATH
  {
    key: 'oil-bath-steam', category: 'oilBath', price: 50,
    nameAr: 'حمام زيت بالبخار', nameEn: 'Steam Oil Bath',
    descriptionAr: 'حمام زيت بالبخار للعناية والترطيب.',
    descriptionEn: 'A steam oil bath for care and hydration.',
  },
  {
    key: 'oil-bath-protein-keratin', category: 'oilBath', price: 80,
    nameAr: 'حمام زيت بالبروتين أو الكرياتين', nameEn: 'Protein or Keratin Oil Bath',
    descriptionAr: 'حمام زيت بالبروتين أو الكرياتين للعناية بالشعر.',
    descriptionEn: 'An oil bath with protein or keratin for hair care.',
  },

  // FACIALS
  {
    key: 'charcoal-mask', category: 'facial', price: 60,
    nameAr: 'قناع الفحم', nameEn: 'Charcoal Mask',
    descriptionAr: 'قناع الفحم لتنقية البشرة.',
    descriptionEn: 'A charcoal mask for skin purification.',
  },
  {
    key: 'face-scrub', category: 'facial', price: 30,
    nameAr: 'صنفرة الوجه', nameEn: 'Face Scrub',
    descriptionAr: 'صنفرة للوجه تساعد على تنعيم البشرة وتجديدها.',
    descriptionEn: 'A face scrub to smooth and refresh the skin.',
  },
  {
    key: 'moroccan-clay-mask', category: 'facial', price: 50,
    nameAr: 'قناع الطين المغربي + المنشفة المعطرة', nameEn: 'Moroccan Clay Mask with Scented Towel',
    descriptionAr: 'قناع الطين المغربي مع منشفة معطرة، حارة أو باردة حسب نوع البشرة.',
    descriptionEn: 'A Moroccan clay mask with a scented towel, warm or cool depending on skin type.',
  },
  {
    key: 'regular-facial-cleansing', category: 'facial', price: 150,
    nameAr: 'تنظيف البشرة العادي', nameEn: 'Regular Facial Cleansing',
    descriptionAr: 'تنظيف عادي للبشرة لإزالة الشوائب وإنعاش الوجه.',
    descriptionEn: 'Regular facial cleansing to remove impurities and refresh the face.',
  },
  {
    key: 'vitamin-c-facial', category: 'facial', price: 250,
    nameAr: 'تنظيف بشرة فيتامين سي', nameEn: 'Vitamin C Facial Cleansing',
    descriptionAr: 'تنظيف بشرة بفيتامين سي لدعم الإشراق والنضارة.',
    descriptionEn: 'Vitamin C facial cleansing to support radiance and freshness.',
  },
  {
    key: 'senior-facial-cleansing', category: 'facial', price: 250,
    nameAr: 'تنظيف بشرة لكبار السن', nameEn: 'Senior Facial Cleansing',
    descriptionAr: 'تنظيف بشرة مخصص لكبار السن.',
    descriptionEn: 'A facial cleansing treatment tailored for mature skin.',
  },
  {
    key: 'combination-skin-cleansing', category: 'facial', price: 300,
    nameAr: 'تنظيف البشرة المختلطة', nameEn: 'Combination Skin Cleansing',
    descriptionAr: 'تنظيف للبشرة المختلطة التي تجمع بين الدهون في الجبهة والذقن والأنف والجفاف في الخدين.',
    descriptionEn: 'Facial cleansing for combination skin, where the T-zone is oilier while cheeks tend to be dry.',
  },
  {
    key: 'mix-facial-cleansing', category: 'facial', price: 650,
    nameAr: 'تنظيف بشرة مكس', nameEn: 'Mix Facial Cleansing',
    descriptionAr: 'تنظيف بشرة مكس لتجربة عناية أوسع وأكثر تكاملا.',
    descriptionEn: 'A mix facial cleansing service for a broader, more complete care session.',
  },
  {
    key: 'nose-strip', category: 'facial', price: 10,
    nameAr: 'لصقة أنف', nameEn: 'Nose Strip',
    descriptionAr: 'لصقة أنف لإزالة الشوائب من منطقة الأنف.',
    descriptionEn: 'A nose strip for removing impurities from the nose area.',
  },

  // PACKAGES
  {
    key: 'pkg-royal', category: 'package', price: 690,
    nameAr: 'الباقة الملكية', nameEn: 'Royal Package',
    descriptionAr: 'تجربة فاخرة متكاملة من أويلو سبا.',
    descriptionEn: 'A complete luxury experience by Oilo Spa.',
    includes: [
      { ar: 'مساج الأحجار الساخنة ساعة', en: 'Hot stone massage, 60 min' },
      { ar: 'حمام ملكي', en: 'Royal bath' },
      { ar: 'بدكير يد وقدم VIP', en: 'VIP hand and foot pedicure' },
      { ar: 'تنظيف بشرة فيتامين سي', en: 'Vitamin C facial cleansing' },
      { ar: 'مشروبات ساخنة وباردة', en: 'Hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-vip', category: 'package', price: 490,
    nameAr: 'باقة VIP', nameEn: 'VIP Package',
    descriptionAr: 'تجربة متكاملة من أويلو سبا.',
    descriptionEn: 'A complete experience by Oilo Spa.',
    includes: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'حمام VIP', en: 'VIP bath' },
      { ar: 'بدكير يد وقدم', en: 'Hand and foot pedicure' },
      { ar: 'تنظيف البشرة العادي', en: 'Regular facial cleansing' },
      { ar: 'مشروبات ساخنة وباردة', en: 'Hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-grooms-day', category: 'package', price: 840,
    nameAr: 'باقة العرسان - تجربة يوم واحد', nameEn: 'Grooms Package - One Day',
    descriptionAr: 'استعداد متكامل ليومك المميز في تجربة يوم واحد.',
    descriptionEn: 'Complete grooming for your special day in a single-day experience.',
    includes: [
      { ar: 'مساج مكس', en: 'Mix massage' },
      { ar: 'حمام ملكي', en: 'Royal bath' },
      { ar: 'حمام زيت بالبخار', en: 'Steam oil bath' },
      { ar: 'بدكير يد وقدم VIP', en: 'VIP hand and foot pedicure' },
      { ar: 'قناع وجه وتنظيف وسنفرة للبشرة', en: 'Facial mask, cleansing and scrub' },
      { ar: 'مشروبات ساخنة وباردة', en: 'Hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-grooms-program', category: 'package', price: 890,
    nameAr: 'باقة العرسان - برنامج 3 أسابيع', nameEn: 'Grooms Package - 3-Week Program',
    descriptionAr: 'برنامج تجهيز متكامل على مدى 3 أسابيع.',
    descriptionEn: 'A complete grooming program over three weeks.',
    includes: [
      { ar: '3 جلسات حمام ملكي', en: '3 royal bath sessions' },
      { ar: '3 جلسات مساج', en: '3 massage sessions' },
      { ar: 'بدكير يد وقدم VIP', en: 'VIP hand and foot pedicure' },
      { ar: 'حمام زيت بالبخار', en: 'Steam oil bath' },
      { ar: 'قناع وتنظيف للبشرة', en: 'Facial mask and cleansing' },
      { ar: 'مشروبات ساخنة وباردة', en: 'Hot and cold drinks' },
    ],
  },

  // SPECIAL OFFERS
  {
    key: 'offer-massage-pedi', category: 'offer', price: 310, fromPrice: true,
    nameAr: 'مساج + بدكير', nameEn: 'Massage + Pedicure',
    descriptionAr: 'مساج للاسترخاء واستعادة النشاط مع بدكير للعناية الكاملة.',
    descriptionEn: 'A relaxing massage with pedicure care.',
  },
]

export const nahdaBridalNoteAr = 'تتوفر خدمة تجهيز العرسان مع حلاق خاص (يلزم حجز مسبق).'
export const nahdaBridalNoteEn = 'Groom preparation with a dedicated barber is available by advance booking.'
