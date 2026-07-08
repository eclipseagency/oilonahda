ملف GitHub جاهز لتسليم هوية وبيانات موقع Oilo Spa لفرع جديد، مع مرجع كامل يساعد Codex او اي مطور يطبق نفس شكل الموقع الحالي على دومين جديد.
الهدف
هذا الريبو يحتوي على موقع Oilo Spa الحالي، ويمكن استخدامه كمرجع لبناء موقع جديد لفرع آخر بنفس الهوية:
نفس الالوان والخطوط والاحساس الفاخر.
نفس صور واجهة Oilo وخدمات السبا.
نفس الخدمات والعروض والباقات والعضويات.
نفس منطق الحجز والواتساب وبيانات SEO، مع تغيير بيانات الفرع والدومين.
اهم ملف للتسليم
استخدم هذا الملف كـ brief مباشر لكوديكس:
docs/oilo-new-branch-codex-brief.md
قبل ارساله لكوديكس، افتح الملف واملأ قسم بيانات الفرع الجديد:
DOMAIN
BRANCH_NAME_AR / BRANCH_NAME_EN
ADDRESS_AR / ADDRESS_EN
MAPS_LINK
LAT / LNG
PHONE_LOCAL
WHATSAPP_INTL
HOURS
EMAIL
بعدها انسخ محتوى الملف كله وضعه في مشروع الموقع الجديد.
الصور والاصول
الصور المهمة موجودة هنا:
public/
public/services/
اهم الملفات التي يجب نقلها للموقع الجديد:
public/logo.png
public/og.png
public/hero.mp4
public/icon-192.png
public/icon-512.png
public/apple-touch-icon.png
public/services/*.webp
يفضل استخدام صور الفرع الجديد الحقيقية لو متاحة. لو غير متاحة، استخدم صور Oilo الحالية كبداية.
هوية التصميم
الستايل العام:
Luxury men spa.
خلفية داكنة جدا.
ذهبي فاخر قليل الاستخدام.
صور حقيقية واضحة.
واجهة عربية RTL افتراضيا.
ازرار حجز وواتساب واضحة.
الالوان الاساسية:
--bg-deep: #060608;
--bg-card: #1A1A1A;
--bg-section: #0a0a0d;
--gold: #C9A96E;
--gold-bright: #dbb97a;
--gold-deep: #a8883f;
--warm-white: #F5EFE4;
--warm-muted: #D8CFBF;
صفحات الموقع المقترحة
/
/booking
/booking/manage
/offers
/services
/services/massage-riyadh
/services/moroccan-bath-riyadh
/services/hijama-riyadh
/services/spa-riyadh
/services/manicure-pedicure-riyadh
/blog
/contact
/gift
/membership
لو الموقع الجديد خاص بفرع واحد فقط، لا تضف صفحة اختيار فروع.
تشغيل المشروع الحالي محليا
npm install
npm run dev
ثم افتح:
http://localhost:3000
اوامر مفيدة:
npm run lint
npm run build
التقنية
المشروع الحالي مبني على:
Next.js 16
React 19
TypeScript
Tailwind CSS v4
Supabase
Nodemailer
Google / Snapchat / TikTok tracking
ملاحظة مهمة: هذا ليس Next.js القديم. قبل تعديل كود Next.js، اقرأ ادلة النسخة الموجودة داخل:
node_modules/next/dist/docs/
Checklist للموقع الجديد
[ ] تغيير الدومين في metadataBase وcanonical وsitemap.
[ ] تغيير اسم الفرع والعنوان والخريطة والاحداثيات.
[ ] تغيير كل ارقام الهاتف والواتساب.
[ ] نقل الصور الى public/services.
[ ] تطبيق الالوان والهوية كما هي.
[ ] بناء الصفحة الرئيسية كفرع واحد.
[ ] بناء صفحة العروض والباقات.
[ ] ربط الحجز ببيانات الفرع الجديد.
[ ] تحديث JSON-LD للفرع الجديد.
[ ] مراجعة النصوص حتى لا تذكر فروع قديمة بالخطأ.
[ ] تشغيل npm run lint و npm run build.
ملف البداية لكوديكس
ابدأ دائما من:
docs/oilo-new-branch-codex-brief.md
هذا هو الملف الذي يحتوي على البرومبت، الالوان، الصور، الخدمات، العروض، العضويات، نصوص SEO، وملاحظات التنفيذ.
