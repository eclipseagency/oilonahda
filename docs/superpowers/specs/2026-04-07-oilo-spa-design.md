# Oilo Spa Website — Design Spec

## Overview
Premium men's luxury spa website for Oilo Spa in Riyadh. Dark, cinematic, mobile-first. Full AR/EN bilingual. Online booking system with WhatsApp notifications.

**Domain**: oilospa.sa
**Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Supabase, Vercel
**WhatsApp**: wa-bridge (eclipse-whatsapp-bridge.onrender.com) → +966556996909

## Routes
- `/` — Home (scrolling sections)
- `/booking` — Full booking form with availability
- `/admin` — Password-protected booking management

## Design System

### Colors
| Role | Hex | Usage |
|------|-----|-------|
| Background | #0D0D0D | Page bg |
| Charcoal | #1A1A1A | Cards, nav, sections |
| Olive Green | #3B4A3F | Accent sections, subtle bg |
| Gold | #C9A96E | CTAs, accents, headings sparingly |
| White | #FFFFFF | Text on dark |

### Typography
- EN Headings: Cormorant Garamond 600/700
- EN Body: Inter 400/500
- AR Headings: IBM Plex Sans Arabic 700
- AR Body: IBM Plex Sans Arabic 400

### Principles
- Dark backgrounds, warm lighting feel
- Minimal layouts, large spacing (luxury hotel spa feel)
- Gold used sparingly — CTAs + accents only
- Border-radius: 2-4px (sharp, masculine)
- No clutter, no flashiness, no emojis in UI

## Home Page Sections

### 1. Navigation
- Fixed/transparent, glass effect on scroll
- Logo (OILO) left, nav links center, AR/EN toggle right
- Mobile: hamburger → slide-out drawer
- Links: Home, Services, Booking, About, Location

### 2. Hero
- Full viewport, cinematic gradient bg (video-ready)
- AR: "لحظة رفاهية… لكل رجل"
- EN: "A moment of luxury… for every man"
- CTA: "احجز جلستك الآن" → /booking
- Dark overlay gradient at bottom

### 3. About
- "عن أويلو" heading
- Brand statement about masculine luxury spa experience
- Olive green subtle background accent
- Minimal text, large typography

### 4. Services
- 4 category tabs: Massage / Moroccan Bath / Grooming / Packages
- Cards: name (AR+EN), duration, description. No prices.
- Each card CTA → /booking?service=key
- 13 services total:

**Massage (5)**:
1. oilo-massage — Oilo Spa Massage (60 min)
2. swedish-60 — Swedish Massage (60 min)
3. swedish-40 — Swedish Massage (40 min)
4. hot-stone — Hot Stone Massage
5. thai-60 — Thai Massage (60 min)
6. thai-40 — Thai Massage (40 min)
7. shiatsu — Shiatsu Massage (40 min)

**Moroccan Bath (3)**:
8. royal-bath — Royal Bath with Argan Oil
9. dead-sea-bath — Bath with Dead Sea Clay & Herbs
10. classic-bath — Classic Moroccan Clay Bath

**Grooming (3)**:
11. mani-pedi — Manicure & Pedicure
12. facial — Facial Cleansing
13. jacuzzi — Jacuzzi

**Packages (2)**:
14. royal-package — Royal Package (hot stone + argan bath + mani/pedi + jacuzzi + facial + drinks)
15. vip-package — VIP Package (oilo massage + dead sea bath + mani/pedi + jacuzzi + facial + drinks)

**Offers (1)**:
16. massage-bath-offer — Massage + Moroccan Bath combo

### 5. Experience
- Visual image grid (oils, candles, towels, steam, water)
- "تفاصيل هادئة… تصنع تجربة لا تُنسى"
- Placeholder images from Unsplash (spa/wellness category)

### 6. Offers
- Highlighted card for Massage + Moroccan Bath combo
- Gold border treatment, CTA to /booking?service=massage-bath-offer

### 7. Location
- Embedded Google Map (dark theme)
- Address: 6664 Prince Saud bin Muhammad bin Muqrin Road, Al Rabie, Riyadh 13316
- "View on Maps" button → Google Maps link

### 8. Working Hours
- Daily: 10:00 AM – 4:00 AM
- Friday: 4:00 PM – 4:00 AM
- Clean display with gold accent

### 9. Footer
- Logo, phone, email, address
- Navigation links
- Copyright

## Booking Page (/booking)

### Flow
1. Select service (visual cards, grouped by category, pre-selectable via URL param)
2. Pick date (calendar, respects working hours, disables fully booked days)
3. Pick time (slot grid, 30-min intervals, only available slots shown)
4. Enter name + phone (Saudi format 05XXXXXXXX)
5. Confirm → success message

### Availability Rules
- Max 5 bookings per time slot
- Daily hours: 10:00–04:00 (next day)
- Friday hours: 16:00–04:00 (next day)
- Time slots: 30-minute intervals within working hours
- Supabase query on date selection to get booked slots

### On Submit
1. Validate all fields
2. Insert into Supabase `bookings` table
3. POST to wa-bridge → send WhatsApp message to +966556996909
4. Show success: "تم استلام طلبك بنجاح — سيتم التواصل معك لتأكيد الحجز"

### WhatsApp Message Format
```
حجز جديد — Oilo Spa

الاسم: {name}
الجوال: {phone}
الخدمة: {service_name_ar}
التاريخ: {date}
الوقت: {time}
```

## Admin Dashboard (/admin)

- Password-protected (env var ADMIN_PASSWORD)
- Default view: today's bookings
- Calendar view: bookings by date
- Booking status: pending → confirmed → completed / cancelled
- Quick actions: change status, WhatsApp reply (wa.me link)
- Simple table layout, dark theme consistent with site

## Database (Supabase)

### bookings table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto |
| name | text | Customer name |
| phone | text | Saudi phone |
| service_key | text | Maps to services config |
| date | date | Booking date |
| time_slot | text | e.g. "20:00" |
| status | text | pending/confirmed/completed/cancelled |
| created_at | timestamptz | Auto |
| notes | text | Optional admin notes |

## i18n
- Arabic (RTL) = default
- English (LTR) = toggle
- React Context provider wraps app
- JSON translation files: ar.json / en.json
- localStorage persistence
- HTML dir + lang attributes update dynamically
- All 16 services have AR + EN names and descriptions

## Mobile
- Mobile-first Tailwind
- Sticky booking CTA at bottom
- Hamburger nav with slide-out drawer
- Single-column card stacking
- Full-screen booking form
- Large tap targets for time slots (min 44px)

## SEO
- JSON-LD LocalBusiness structured data
- OG meta tags
- Keywords: سبا رجالي الرياض, مساج الرياض, حمام مغربي الرياض, Men spa Riyadh
- Sitemap
- Next.js Image optimization (WebP/AVIF)
- Google Fonts preload

## Services Config Structure
Services are hardcoded in a TypeScript config (not DB). Each service:
```ts
{
  key: string
  category: 'massage' | 'bath' | 'grooming' | 'package' | 'offer'
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  duration?: string // e.g. "60 min"
  includes?: string[] // for packages
}
```
