// ════════════════════════════════════════════════════════════════
// Al Nahda branch service menu (فرع النهضة)
// Source: Al Nahda branch management price list.
// All massages are 40 min unless stated; +40 SAR upgrades a massage to
// 60 min. Opening offer: 20 SAR off every massage type.
// ════════════════════════════════════════════════════════════════

export type NahdaCategory = 'massage' | 'addon' | 'pedicure' | 'bath' | 'package' | 'offer'

export interface NahdaService {
  key: string
  category: NahdaCategory
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  durationAr?: string
  durationEn?: string
  price?: number          // SAR
  fromPrice?: boolean     // "ابتداءً من" / "from"
  image?: string          // per-service image (filled in finishing pass)
  includes?: { ar: string; en: string }[]
}

// Global opening-offer discount applied to every massage type (SAR).
export const NAHDA_MASSAGE_OPENING_DISCOUNT = 20
// Upcharge to extend any 40-min massage to a full hour (SAR).
export const NAHDA_HOUR_UPGRADE = 40

export const nahdaCategories: { id: NahdaCategory; titleAr: string; titleEn: string }[] = [
  { id: 'massage', titleAr: 'منيو المساج', titleEn: 'Massage Menu' },
  { id: 'addon', titleAr: 'خدمات إضافية', titleEn: 'Add-on Services' },
  { id: 'pedicure', titleAr: 'منيو البديكير', titleEn: 'Manicure & Pedicure' },
  { id: 'bath', titleAr: 'الحمامات المغربية', titleEn: 'Moroccan Baths' },
  { id: 'package', titleAr: 'الباقات', titleEn: 'Packages' },
  { id: 'offer', titleAr: 'العروض الخاصة', titleEn: 'Special Offers' },
]

export const nahdaServices: NahdaService[] = [
  // ── MASSAGE (40 min, opening offer -20 SAR each) ──
  {
    key: 'dry-massage', category: 'massage', price: 175,
    nameAr: 'المساج الجاف', nameEn: 'Dry Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'يركز على الضغط على نقاط التوتر باستخدام اليدين والأصابع والمرفقين لتحفيز الدورة الدموية وتخفيف الشد العضلي، ويُطبّق من خلال الملابس أو بمنشفة. خيار مناسب لمن يعانون من حساسية الجلد أو لا يفضلون الزيوت.',
    descriptionEn: 'Focuses on pressure over tension points using hands, fingers and elbows to boost circulation and relieve muscle tightness, applied through clothing or a towel. Ideal for sensitive skin or anyone who prefers no oils.',
  },
  {
    key: 'chinese-massage', category: 'massage', price: 200,
    nameAr: 'المساج الصيني', nameEn: 'Chinese Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'تقنيات متخصصة يستخدم فيها المعالج راحة اليد وأطراف الأصابع والمفاصل للعجن واللف والفرك والضغط على الجسم على طول مسارات الطاقة ونقاط الوخز.',
    descriptionEn: 'Specialised techniques where the therapist uses the palm, fingertips and joints to knead, roll, rub and press along the body energy pathways and acupressure points.',
  },
  {
    key: 'shiatsu-massage', category: 'massage', price: 175,
    nameAr: 'مساج شياتسو الياباني', nameEn: 'Japanese Shiatsu Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'تدليك ياباني تقليدي يركز على نقاط الطاقة في الجسم بالضغط بالأصابع والكفين لتحفيز الشفاء الذاتي وتعزيز التوازن الداخلي. مثالي للباحثين عن استرخاء عميق وتجديد للنشاط.',
    descriptionEn: 'A traditional Japanese massage focusing on the body energy points with finger and palm pressure to stimulate self-healing and inner balance. Ideal for deep relaxation and renewed energy.',
  },
  {
    key: 'aroma-oil-massage', category: 'massage', price: 210,
    nameAr: 'مساج الزيوت العطرية', nameEn: 'Aromatic Oil Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'نوع من المساج يستخدم الزيوت العطرية لتعزيز الشعور بالراحة والاسترخاء.',
    descriptionEn: 'A massage that uses aromatic oils to deepen the sense of comfort and relaxation.',
  },
  {
    key: 'swedish-massage', category: 'massage', price: 175,
    nameAr: 'المساج السويدي', nameEn: 'Swedish Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'من أشهر أنواع المساج، يتميز بتقنيات متنوعة لتعزيز الاسترخاء وتخفيف التوتر العضلي وتحسين الدورة الدموية.',
    descriptionEn: 'One of the most popular massages, using varied techniques to boost relaxation, ease muscle tension and improve circulation.',
  },
  {
    key: 'hot-stone-massage', category: 'massage', price: 140,
    nameAr: 'مساج الأحجار الساخنة', nameEn: 'Hot Stone Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'تقنية تدليك بأحجار بركانية ساخنة تساعد على تنشيط الدورة الدموية وتخفيف التوتر والقلق والآلام.',
    descriptionEn: 'A massage technique using warm volcanic stones that activates circulation and relieves tension, anxiety and aches.',
  },
  {
    key: 'mix-massage', category: 'massage', price: 375,
    nameAr: 'مساج مكس (المنوّع)', nameEn: 'Mix Massage',
    durationAr: '40 دقيقة', durationEn: '40 min',
    descriptionAr: 'مزيج متنوّع من تقنيات المساج في جلسة واحدة لتجربة متكاملة.',
    descriptionEn: 'A varied blend of massage techniques in a single session for a complete experience.',
  },

  // ── ADD-ONS (cannot be booked alone; added to any massage) ──
  {
    key: 'addon-warm-oil', category: 'addon', price: 100,
    nameAr: 'إضافة مساج الزيت الدافئ والساخن', nameEn: 'Warm & Hot Oil Add-on',
    descriptionAr: 'يساعد على الاسترخاء وتخفيف التوتر العضلي والعصبي وتحسين تدفق الدم.',
    descriptionEn: 'Helps relaxation, eases muscular and nervous tension and improves blood flow.',
  },
  {
    key: 'addon-compress', category: 'addon', price: 100,
    nameAr: 'إضافة مساج الكمادات', nameEn: 'Herbal Compress Add-on',
    descriptionAr: 'تساعد على توسعة الأوعية الدموية وتعزيز تدفق الدم وإرخاء العضلات المتشنجة.',
    descriptionEn: 'Helps widen blood vessels, boost circulation and relax tense muscles.',
  },
  {
    key: 'addon-wood', category: 'addon', price: 100,
    nameAr: 'إضافة مساج الأخشاب', nameEn: 'Wood Therapy Add-on',
    descriptionAr: 'يُطبّق بأدوات خشبية مصممة خصيصًا لتدليك الجسم وتحفيز الأنسجة العميقة وتقوية العضلات وتحفيز إنتاج الكولاجين.',
    descriptionEn: 'Uses purpose-made wooden tools to massage the body, stimulate deep tissue, strengthen muscles and encourage collagen production.',
  },
  {
    key: 'addon-cupping', category: 'addon', price: 100,
    nameAr: 'إضافة مساج كاسات الهواء', nameEn: 'Cupping Add-on',
    descriptionAr: 'يحفّز تدفق الدم ويساعد على طرد السموم من الجسم.',
    descriptionEn: 'Stimulates blood flow and helps the body release toxins.',
  },
  {
    key: 'addon-foot', category: 'addon', price: 100,
    nameAr: 'إضافة مساج الأقدام', nameEn: 'Foot Massage Add-on',
    descriptionAr: 'تدليك للأقدام يضاف إلى جلستك لمزيد من الاسترخاء.',
    descriptionEn: 'A foot massage added to your session for extra relaxation.',
  },

  // ── MANICURE / PEDICURE ──
  {
    key: 'mani', category: 'pedicure', price: 80,
    nameAr: 'بديكير يد', nameEn: 'Manicure (Hands)',
    descriptionAr: 'عناية كاملة بأظافر وبشرة اليدين.',
    descriptionEn: 'Complete care for the nails and skin of the hands.',
  },
  {
    key: 'pedi', category: 'pedicure', price: 100,
    nameAr: 'بديكير أقدام', nameEn: 'Pedicure (Feet)',
    descriptionAr: 'عناية كاملة بأظافر وبشرة القدمين.',
    descriptionEn: 'Complete care for the nails and skin of the feet.',
  },
  {
    key: 'mani-pedi', category: 'pedicure', price: 175,
    nameAr: 'بديكير يد وقدم عادي', nameEn: 'Manicure & Pedicure',
    descriptionAr: 'عناية متكاملة لليدين والقدمين.',
    descriptionEn: 'Full care for both hands and feet.',
  },
  {
    key: 'mani-pedi-vip', category: 'pedicure', price: 250,
    nameAr: 'بديكير VIP يد وقدم مع قناع البارافين', nameEn: 'VIP Manicure & Pedicure with Paraffin Mask',
    descriptionAr: 'بديكير متكامل لليدين والقدمين مع قناع البارافين المرطّب.',
    descriptionEn: 'A full hands-and-feet treatment finished with a hydrating paraffin mask.',
  },

  // ── MOROCCAN BATHS ──
  {
    key: 'bath-classic', category: 'bath', price: 140,
    nameAr: 'حمام مغربي تقليدي', nameEn: 'Traditional Moroccan Bath',
    descriptionAr: 'حمام مغربي بالصابون المغربي فقط.',
    descriptionEn: 'A Moroccan bath with authentic Moroccan black soap.',
  },
  {
    key: 'bath-herbal', category: 'bath', price: 200,
    nameAr: 'حمام الأعشاب', nameEn: 'Herbal Bath',
    descriptionAr: 'حمام بالأعشاب المخلوطة بزيت الأرجان مع حمام زيت للشعر.',
    descriptionEn: 'A bath with herbs blended with argan oil, plus a hair oil treatment.',
  },
  {
    key: 'bath-vip', category: 'bath', price: 250,
    nameAr: 'حمام VIP', nameEn: 'VIP Bath',
    descriptionAr: 'حمام صابون مع طين البحر الميت الغني بالمعادن وصنفرة للوجه.',
    descriptionEn: 'A soap bath with mineral-rich Dead Sea mud and a facial scrub.',
  },
  {
    key: 'bath-royal', category: 'bath', price: 400,
    nameAr: 'حمام ملكي', nameEn: 'Royal Bath',
    descriptionAr: 'حمام صابون مغربي مع طين البحر الميت وحمام الأعشاب بالزيوت العطرية وسنفرة للجسم.',
    descriptionEn: 'A Moroccan soap bath with Dead Sea mud, an aromatic herbal bath and a full-body scrub.',
  },

  // ── PACKAGES ──
  {
    key: 'pkg-royal', category: 'package', price: 690,
    nameAr: 'الباقة الملكية', nameEn: 'Royal Package',
    descriptionAr: 'تجربة فاخرة متكاملة من أويلو سبا.',
    descriptionEn: 'A complete luxury experience by Oilo Spa.',
    includes: [
      { ar: 'مساج أويلو سبا مع الأحجار الساخنة (ساعة كاملة)', en: 'Oilo Spa massage with hot stones (full hour)' },
      { ar: 'حمام مغربي ملكي بزيت الأرجان', en: 'Royal Moroccan bath with argan oil' },
      { ar: 'بديكير اليدين والقدمين', en: 'Hands and feet pedicure' },
      { ar: 'تنظيف بشرة', en: 'Facial cleansing' },
      { ar: 'جاكوزي ومشروبات ساخنة وباردة', en: 'Jacuzzi with hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-vip', category: 'package', price: 490,
    nameAr: 'باقة VIP', nameEn: 'VIP Package',
    descriptionAr: 'تجربة متكاملة من أويلو سبا.',
    descriptionEn: 'A complete experience by Oilo Spa.',
    includes: [
      { ar: 'مساج أويلو سبا (40 دقيقة)', en: 'Oilo Spa massage (40 min)' },
      { ar: 'حمام مغربي بطين البحر الميت والأعشاب العطرية', en: 'Moroccan bath with Dead Sea mud and aromatic herbs' },
      { ar: 'بديكير اليدين والقدمين', en: 'Hands and feet pedicure' },
      { ar: 'تنظيف بشرة', en: 'Facial cleansing' },
      { ar: 'جاكوزي ومشروبات ساخنة وباردة', en: 'Jacuzzi with hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-grooms-day', category: 'package', price: 840,
    nameAr: 'باقة العرسان - تجربة يوم واحد', nameEn: 'Grooms Package - One Day',
    descriptionAr: 'استعداد متكامل ليومك المميز في تجربة يوم واحد.',
    descriptionEn: 'Complete grooming for your special day in a single-day experience.',
    includes: [
      { ar: 'مساج فاخر', en: 'Luxury massage' },
      { ar: 'حمام مغربي ملكي', en: 'Royal Moroccan bath' },
      { ar: 'حمام بخار', en: 'Steam room' },
      { ar: 'بديكير VIP', en: 'VIP pedicure' },
      { ar: 'قناع وجه وتنظيف وسنفرة للبشرة', en: 'Facial mask, cleansing and scrub' },
      { ar: 'جاكوزي ومشروبات ساخنة وباردة', en: 'Jacuzzi with hot and cold drinks' },
    ],
  },
  {
    key: 'pkg-grooms-program', category: 'package', price: 890,
    nameAr: 'باقة العرسان - برنامج 3 أسابيع', nameEn: 'Grooms Package - 3-Week Program',
    descriptionAr: 'برنامج تجهيز متكامل على مدى 3 أسابيع.',
    descriptionEn: 'A complete grooming program over three weeks.',
    includes: [
      { ar: '3 جلسات حمام مغربي ملكي', en: '3 royal Moroccan bath sessions' },
      { ar: '3 جلسات مساج', en: '3 massage sessions' },
      { ar: 'بديكير VIP مع قناع البارافين', en: 'VIP pedicure with paraffin mask' },
      { ar: 'حمام بخار بالزيوت المعطرة', en: 'Steam room with scented oils' },
      { ar: 'قناع وتنظيف للبشرة', en: 'Facial mask and cleansing' },
      { ar: 'جاكوزي ومشروبات ساخنة وباردة', en: 'Jacuzzi with hot and cold drinks' },
    ],
  },

  // ── SPECIAL OFFERS ──
  {
    key: 'offer-massage-bath', category: 'offer', price: 310, fromPrice: true,
    nameAr: 'مساج استرخائي + حمام مغربي', nameEn: 'Relaxing Massage + Moroccan Bath',
    descriptionAr: 'مساج احترافي يخفف التوتر ويعيد النشاط مع حمام مغربي لتنقية الجسم واستعادة الحيوية.',
    descriptionEn: 'A professional massage that relieves tension and restores energy, with a Moroccan bath to purify the body and revive vitality.',
  },
  {
    key: 'offer-massage-pedi', category: 'offer', price: 310, fromPrice: true,
    nameAr: 'مساج + بديكير', nameEn: 'Massage + Pedicure',
    descriptionAr: 'مساج للاسترخاء واستعادة النشاط مع بديكير اليدين والقدمين للعناية الكاملة.',
    descriptionEn: 'A relaxing, energising massage with a hands-and-feet pedicure for complete care.',
  },
]

// Bridal preparation with a dedicated barber, by advance booking only.
export const nahdaBridalNoteAr = 'تتوفر خدمة تجهيز العرسان مع حلاق خاص (يلزم حجز مسبق).'
export const nahdaBridalNoteEn = 'Groom preparation with a dedicated barber is available by advance booking.'
