'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'ar' | 'en'

interface I18nContext {
  locale: Locale
  dir: 'rtl' | 'ltr'
  toggleLocale: () => void
  t: (key: string) => string
}

const translations: Record<Locale, Record<string, string>> = {
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.booking': 'احجز الآن',
    'nav.about': 'عن أويلو',
    'nav.location': 'الموقع',
    'nav.blog': 'المدونة',
    'nav.lang': 'EN',

    // Hero
    'hero.tagline': 'لحظة رفاهية… لكل رجل',
    'hero.subtitle': 'استرخِ. تجدد. استعد طاقتك.',
    'hero.cta': 'احجز جلستك الآن',

    // About
    'about.title': 'عن أويلو',
    'about.text': 'أويلو سبا يقدم تجربة استرخاء متكاملة، حيث تجتمع الراحة والعناية والتفاصيل الدقيقة في بيئة هادئة وفاخرة.',
    'about.subtitle': 'حيث تجتمع الراحة والعناية والتفاصيل الدقيقة',

    // Services
    'services.title': 'خدماتنا',
    'services.subtitle': 'علاجات استرخاء وعناية فاخرة',
    'services.book': 'احجز',
    'services.includes': 'تشمل',

    // Experience
    'experience.title': 'تفاصيل هادئة… تصنع تجربة لا تُنسى',
    'experience.subtitle': 'كل تفصيلة صُممت لراحتك',

    // Offers
    'offers.title': 'العروض',
    'offers.subtitle': 'باقات لفترة محدودة لتجربة لا تُنسى',
    'offers.book': 'احجز العرض',

    // Location
    'location.title': 'موقعنا',
    'location.subtitle': 'زورنا في قلب الرياض',
    'location.address': 'شارع سلمان الفارسي، حي النهضة، الرياض ١٠٠١١',
    'location.view': 'عرض الموقع',

    // Hours
    'hours.title': 'أوقات العمل',
    'hours.subtitle': 'ساعات العمل',
    'hours.daily': 'السبت – الخميس',
    'hours.daily.time': '١٠ صباحًا – ٤ فجرًا',
    'hours.friday': 'الجمعة',
    'hours.friday.time': '١:٣٠ ظهرًا – ٤ فجرًا',

    // Booking
    'booking.title': 'احجز جلستك',
    'booking.subtitle': 'Book Your Session',
    'booking.service': 'اختر الخدمة',
    'booking.date': 'التاريخ',
    'booking.time': 'الوقت',
    'booking.name': 'الاسم',
    'booking.name.placeholder': 'أدخل اسمك الكامل',
    'booking.phone': 'رقم الجوال',
    'booking.phone.placeholder': '05XXXXXXXX',
    'booking.confirm': 'تأكيد الحجز',
    'booking.success.title': 'تم استلام طلبك بنجاح',
    'booking.success.text': 'سيتم التواصل معك لتأكيد الحجز',
    'booking.success.back': 'العودة للرئيسية',
    'booking.select.service': 'اختر الخدمة',
    'booking.select.date': 'اختر التاريخ',
    'booking.select.time': 'اختر الوقت',
    'booking.your.info': 'معلوماتك',
    'booking.no.slots': 'لا توجد مواعيد متاحة في هذا اليوم',
    'booking.fully.booked': 'محجوز بالكامل',
    'booking.submitting': 'جاري التأكيد...',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.phone': '0556733851',
    'footer.email': 'info@oilo.sa',

    // Categories
    'cat.massage': 'المساج',
    'cat.bath': 'الحمام المغربي',
    'cat.grooming': 'العناية',
    'cat.package': 'الباقات',
    'cat.offer': 'العروض',
    'cat.all': 'الكل',

    // Hero extras
    'hero.open': 'مفتوح الآن',
    'hero.closed': 'مغلق الآن',
    'hero.call': 'اتصل بنا',
    'hero.closes': 'حتى',

    // Services pricing
    'services.from': 'ابتداءً من',
    'services.sar': 'ر.س',

    // Reviews
    'reviews.title': 'التقييمات',
    'reviews.subtitle': 'تجارب حقيقية من رجال اختاروا أويلو',
    'reviews.google': 'تقييم جوجل',
    'reviews.verified': 'تقييم موثّق',

    // Gallery
    'gallery.title': 'الأجواء',
    'gallery.subtitle': 'ألقِ نظرة على المساحة التي صُممت لراحتك',

    // Team
    'team.title': 'معالجونا',
    'team.subtitle': 'فريق محترف مدرّب ومؤهل لخدمتك',
    'team.years': 'سنوات خبرة',

    // What to expect
    'expect.title': 'زيارتك الأولى',
    'expect.subtitle': 'ما يمكن توقعه في جلستك الأولى',
    'expect.step1.title': 'الوصول والاستقبال',
    'expect.step1.text': 'استقبال دافئ في بيئة هادئة، مع مشروب ترحيبي وجلسة استرخاء قصيرة قبل البدء.',
    'expect.step2.title': 'تغيير الملابس',
    'expect.step2.text': 'غرفة خاصة لتغيير ملابسك وحفظ أغراضك بأمان. سنوفر لك روب وصندل ومناشف نظيفة.',
    'expect.step3.title': 'جلسة الاسترخاء',
    'expect.step3.text': 'معالجك المتخصص سيستمع لاحتياجاتك ويُعدّل التقنية والضغط بما يناسبك تمامًا.',
    'expect.step4.title': 'الراحة بعد الجلسة',
    'expect.step4.text': 'جلسة استرخاء قصيرة مع مشروب ساخن أو بارد قبل المغادرة. لا استعجال.',

    // FAQ
    'faq.title': 'الأسئلة',
    'faq.subtitle': 'كل ما تحتاج معرفته قبل زيارتك',
    'faq.q1': 'ما الذي يميّز أجواء أويلو سبا؟',
    'faq.a1': 'بيئة هادئة ونظيفة ومريحة، فريق من المعالجين المحترفين المؤهلين، وأدوات معقمة في كل جلسة لتجربة استرخاء آمنة ومريحة.',
    'faq.q2': 'هل أحتاج إلى حجز مسبق؟',
    'faq.a2': 'نوصي بالحجز المسبق لضمان الموعد الذي يناسبك، خصوصًا في عطلة نهاية الأسبوع. الحجز متاح عبر الموقع أو واتساب أو الهاتف.',
    'faq.q3': 'ما الذي أحضره معي؟',
    'faq.a3': 'لا تحتاج إحضار أي شيء. نوفر روب ومناشف ومنتجات العناية. فقط احضر بنفس قابلة للاسترخاء.',
    'faq.q4': 'هل يمكنني اختيار المعالج؟',
    'faq.a4': 'جميع معالجينا محترفون مؤهلون ومدربون. يمكنك طلب معالج محدد إذا كان متاحًا وقت الحجز.',
    'faq.q5': 'ما هي سياسة الإلغاء؟',
    'faq.a5': 'يمكن إلغاء أو تعديل الحجز قبل الموعد بـ ٤ ساعات على الأقل دون أي رسوم.',
    'faq.q6': 'هل تقدمون بطاقات هدايا؟',
    'faq.a6': 'نعم، بطاقات الهدايا متاحة لجميع خدماتنا وباقاتنا. هدية مثالية للمناسبات.',
    'faq.q7': 'هل يوجد مواقف سيارات؟',
    'faq.a7': 'نعم، يتوفر موقف سيارات مجاني للعملاء في موقعنا بحي النهضة.',
    'faq.q8': 'كم مدة الجلسة عادة؟',
    'faq.a8': 'جلسات المساج ٤٠-٦٠ دقيقة، والحمام المغربي حوالي ٦٠ دقيقة، والباقات المتكاملة ٢-٣ ساعات.',

    // Offers extras
    'offers.morning': 'عرض الصباح',
    'offers.morning.title': 'خصم ١٥٪ — قبل الظهر',
    'offers.morning.text': 'كل يوم من ١٠ صباحًا حتى ١٢ ظهرًا — استمتع بخصم ١٥٪ على الحمام المغربي الكلاسيكي.',
    'offers.birthday': 'هدية عيد ميلادك',
    'offers.birthday.title': 'جلسة جاكوزي مجانية',
    'offers.birthday.text': 'احتفل بعيد ميلادك معنا — جلسة جاكوزي مجانية مع أي باقة خلال شهر ميلادك.',

    // Gift cards
    'gift.title': 'بطاقات الهدايا',
    'gift.subtitle': 'هدية فاخرة لمن تحب',
    'gift.cta': 'اطلب بطاقة هدية',
    'gift.form.title': 'بطاقة هدية أويلو سبا',
    'gift.form.subtitle': 'املأ التفاصيل وسنتواصل معك لإتمام الطلب',
    'gift.amount': 'قيمة البطاقة',
    'gift.recipient': 'اسم المستلم',
    'gift.recipient.placeholder': 'اسم من ستُهدى إليه البطاقة',
    'gift.sender': 'اسمك',
    'gift.sender.placeholder': 'اسمك الكامل',
    'gift.message': 'رسالة (اختياري)',
    'gift.message.placeholder': 'رسالة شخصية مع البطاقة',
    'gift.submit': 'إرسال الطلب',
    'gift.success': 'تم استلام طلبك، سنتواصل معك قريبًا',

    // Membership
    'member.title': 'عضوية أويلو',
    'member.subtitle': 'وفر أكثر مع باقات العضوية',
    'member.bundle5': 'باقة ٥ جلسات',
    'member.bundle10': 'باقة ١٠ جلسات',
    'member.bundle5.save': 'وفر ١٠٪',
    'member.bundle10.save': 'وفر ١٥٪',
    'member.cta': 'اشترك في العضوية',
    'member.form.name': 'اسمك',
    'member.form.phone': 'رقم الجوال',
    'member.form.submit': 'إرسال الطلب',
    'member.form.success': 'تم استلام اهتمامك، سنتواصل معك',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.booking': 'Book Now',
    'nav.about': 'About',
    'nav.location': 'Location',
    'nav.blog': 'Blog',
    'nav.lang': 'عربي',

    'hero.tagline': 'A Moment of Luxury… For Every Man',
    'hero.subtitle': 'Relax. Refresh. Recharge.',
    'hero.cta': 'Book Your Session',

    'about.title': 'About Oilo',
    'about.text': 'Oilo Spa offers a complete relaxation experience, where comfort, care, and fine details come together in a calm and luxurious environment.',
    'about.subtitle': 'Where comfort, care, and fine details come together',

    'services.title': 'Our Services',
    'services.subtitle': 'Premium relaxation & wellness treatments',
    'services.book': 'Book',
    'services.includes': 'Includes',

    'experience.title': 'Quiet Details… Crafting an Unforgettable Experience',
    'experience.subtitle': 'Every element designed for your comfort',

    'offers.title': 'Special Offers',
    'offers.subtitle': 'Limited-time packages for the ultimate experience',
    'offers.book': 'Book This Offer',

    'location.title': 'Our Location',
    'location.subtitle': 'Visit us in the heart of Riyadh',
    'location.address': 'Salman Al Farisi Street, Al Nahda, Riyadh 10011',
    'location.view': 'View on Maps',

    'hours.title': 'Working Hours',
    'hours.subtitle': 'Working Hours',
    'hours.daily': 'Sat – Thu',
    'hours.daily.time': '10:00 AM – 4:00 AM',
    'hours.friday': 'Friday',
    'hours.friday.time': '1:30 PM – 4:00 AM',

    'booking.title': 'Book Your Session',
    'booking.subtitle': 'Select your service and preferred time',
    'booking.service': 'Select Service',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.name': 'Full Name',
    'booking.name.placeholder': 'Enter your full name',
    'booking.phone': 'Phone Number',
    'booking.phone.placeholder': '05XXXXXXXX',
    'booking.confirm': 'Confirm Booking',
    'booking.success.title': 'Booking Received Successfully',
    'booking.success.text': 'We will contact you to confirm your booking',
    'booking.success.back': 'Back to Home',
    'booking.select.service': 'Select Service',
    'booking.select.date': 'Select Date',
    'booking.select.time': 'Select Time',
    'booking.your.info': 'Your Information',
    'booking.no.slots': 'No available slots on this day',
    'booking.fully.booked': 'Fully Booked',
    'booking.submitting': 'Confirming...',

    'footer.rights': 'All rights reserved',
    'footer.phone': '0556733851',
    'footer.email': 'info@oilo.sa',

    'cat.massage': 'Massage',
    'cat.bath': 'Moroccan Bath',
    'cat.grooming': 'Grooming',
    'cat.package': 'Packages',
    'cat.offer': 'Offers',
    'cat.all': 'All',

    // Hero extras
    'hero.open': 'Open Now',
    'hero.closed': 'Closed',
    'hero.call': 'Call Us',
    'hero.closes': 'until',

    // Services pricing
    'services.from': 'from',
    'services.sar': 'SAR',

    // Reviews
    'reviews.title': 'Reviews',
    'reviews.subtitle': 'Real experiences from men who chose Oilo',
    'reviews.google': 'Google Review',
    'reviews.verified': 'Verified Review',

    // Gallery
    'gallery.title': 'Atmosphere',
    'gallery.subtitle': 'Take a look at the space designed for your comfort',

    // Team
    'team.title': 'Our Therapists',
    'team.subtitle': 'A professional team trained and qualified to serve you',
    'team.years': 'years experience',

    // What to expect
    'expect.title': 'Your First Visit',
    'expect.subtitle': 'What to expect on your first session',
    'expect.step1.title': 'Arrival & Welcome',
    'expect.step1.text': 'A warm welcome in a calm environment, a welcome drink, and a short relaxation pause before starting.',
    'expect.step2.title': 'Changing Room',
    'expect.step2.text': 'A private changing room with secure storage. We provide a robe, slippers, and fresh towels.',
    'expect.step3.title': 'Your Treatment',
    'expect.step3.text': 'Your specialist therapist listens to your needs and tailors pressure and technique to your preference.',
    'expect.step4.title': 'Post-Session Relaxation',
    'expect.step4.text': 'A short rest with a hot or cold drink before you leave. No rush.',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Everything you need to know before visiting',
    'faq.q1': 'What makes Oilo Spa special?',
    'faq.a1': 'A calm, clean and comfortable environment, a team of qualified professional therapists, and sterilized tools for every session for a safe and relaxing experience.',
    'faq.q2': 'Do I need to book in advance?',
    'faq.a2': 'We recommend booking in advance to secure your preferred time, especially on weekends. You can book via the website, WhatsApp, or phone.',
    'faq.q3': 'What should I bring?',
    'faq.a3': 'You don\'t need to bring anything. We provide a robe, towels, and care products. Just arrive in comfortable clothes.',
    'faq.q4': 'Can I choose my therapist?',
    'faq.a4': 'All our therapists are qualified and trained men. You can request a specific therapist if available at booking time.',
    'faq.q5': 'What is the cancellation policy?',
    'faq.a5': 'You can cancel or reschedule up to 4 hours before your appointment at no charge.',
    'faq.q6': 'Do you offer gift cards?',
    'faq.a6': 'Yes, gift cards are available for all our services and packages — the perfect gift for any occasion.',
    'faq.q7': 'Is parking available?',
    'faq.a7': 'Yes, free customer parking is available at our Al Nahda location.',
    'faq.q8': 'How long is a typical session?',
    'faq.a8': 'Massage sessions are 40–60 minutes, Moroccan bath about 60 minutes, and full packages are 2–3 hours.',

    // Offers extras
    'offers.morning': 'Morning Offer',
    'offers.morning.title': '15% Off — Before Noon',
    'offers.morning.text': 'Every day from 10 AM to 12 PM — enjoy 15% off the Classic Moroccan Bath.',
    'offers.birthday': 'Birthday Gift',
    'offers.birthday.title': 'Complimentary Jacuzzi',
    'offers.birthday.text': 'Celebrate your birthday with us — a free jacuzzi session with any package during your birthday month.',

    // Gift cards
    'gift.title': 'Gift Cards',
    'gift.subtitle': 'A luxurious gift for someone you care about',
    'gift.cta': 'Order a Gift Card',
    'gift.form.title': 'Oilo Spa Gift Card',
    'gift.form.subtitle': 'Fill in the details and we\'ll contact you to complete the order',
    'gift.amount': 'Card Value',
    'gift.recipient': 'Recipient Name',
    'gift.recipient.placeholder': 'Name of the person receiving the gift',
    'gift.sender': 'Your Name',
    'gift.sender.placeholder': 'Your full name',
    'gift.message': 'Message (optional)',
    'gift.message.placeholder': 'Personal message with the card',
    'gift.submit': 'Send Request',
    'gift.success': 'Request received, we\'ll contact you shortly',

    // Membership
    'member.title': 'Oilo Membership',
    'member.subtitle': 'Save more with our membership bundles',
    'member.bundle5': '5-Session Bundle',
    'member.bundle10': '10-Session Bundle',
    'member.bundle5.save': 'Save 10%',
    'member.bundle10.save': 'Save 15%',
    'member.cta': 'Join Membership',
    'member.form.name': 'Your Name',
    'member.form.phone': 'Phone Number',
    'member.form.submit': 'Submit Request',
    'member.form.success': 'We received your interest and will contact you',
  },
}

const I18nCtx = createContext<I18nContext | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ar')

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const toggleLocale = () => setLocale(prev => (prev === 'ar' ? 'en' : 'ar'))

  const t = (key: string) => translations[locale][key] ?? key

  return (
    <I18nCtx.Provider value={{ locale, dir, toggleLocale, t }}>
      {children}
    </I18nCtx.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
