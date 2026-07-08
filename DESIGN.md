# Oilo Spa — DESIGN.md

## 1. Visual Theme & Atmosphere
Masculine luxury spa. Think: a five-star hotel spa after midnight — dark, warm, quiet. No flash, no clutter. Every element earns its space. The design breathes through generous whitespace and cinematic depth.

## 2. Color Palette & Roles
| Token | Hex | Role |
|-------|-----|------|
| --bg-deep | #0D0D0D | Page background |
| --bg-card | #1A1A1A | Cards, nav, elevated surfaces |
| --bg-section | #111111 | Alternating section bg |
| --olive | #3B4A3F | Subtle accent sections, hover states |
| --gold | #C9A96E | Primary accent — CTAs, headings, borders |
| --gold-hover | #D4B87A | Gold hover/active state |
| --white | #FFFFFF | Primary text on dark |
| --gray-100 | #F5F5F5 | Light text emphasis |
| --gray-400 | #999999 | Body text |
| --gray-600 | #666666 | Muted text, labels |
| --gray-800 | #333333 | Borders, dividers |

Gold is used with surgical precision: one CTA per viewport, accent borders, section headings. Never as backgrounds.

## 3. Typography Rules
**English:**
- Headings: Cormorant Garamond, weights 600-700, letter-spacing -0.02em
- Body: Inter, weights 400-500, line-height 1.7
- Nav/Labels: Inter 500, 13px, letter-spacing 0.15em, uppercase

**Arabic:**
- Headings: IBM Plex Sans Arabic, weight 700, line-height 1.4
- Body: IBM Plex Sans Arabic, weight 400, line-height 1.8

**Scale:** 14px body → 16px lead → 20px h4 → 28px h3 → 42px h2 → 56px h1

## 4. Component Stylings

**Buttons (Primary):**
- Background: #C9A96E, text: #1A1A1A, padding: 16px 48px
- Border-radius: 2px, font-weight: 600, letter-spacing: 0.05em
- Hover: #D4B87A, translateY(-1px)
- No shadows on buttons

**Cards (Service):**
- Background: linear-gradient(145deg, #1f1f1f, #181818)
- Border: 1px solid rgba(201,169,110,0.1)
- Border-radius: 4px, padding: 32px
- Hover: border-color rgba(201,169,110,0.3), translateY(-4px), gold line appears at top

**Inputs:**
- Background: rgba(255,255,255,0.04)
- Border: 1px solid rgba(201,169,110,0.15)
- Border-radius: 4px, padding: 14px 18px
- Focus: border-color #C9A96E
- Text: white, placeholder: #666

**Navigation:**
- Background: transparent → rgba(0,0,0,0.8) on scroll
- Backdrop-filter: blur(12px) saturate(150%)
- Height: 72px, z-index: 50

## 5. Layout Principles
- Max-width: 1200px centered
- Section padding: 120px vertical (80px mobile)
- Card gap: 24px
- Component spacing follows 8px grid
- Sections alternate between #0D0D0D and #111111

## 6. Depth & Elevation
Shadows are nearly absent — luxury is flat and confident.
- Cards: no shadow default, hover adds 0 20px 40px rgba(0,0,0,0.4)
- Navigation: no shadow, uses backdrop-filter blur
- Modals: 0 25px 50px rgba(0,0,0,0.5)

## 7. Do's and Don'ts
**Do:**
- Use generous whitespace
- Let typography do the heavy lifting
- Use gold sparingly (one accent per viewport)
- Keep text short and confident
- Use cinematic gradients for depth

**Don't:**
- Use emojis in the UI
- Add decorative borders or ornaments
- Use bright colors or gradients
- Make gold backgrounds
- Add shadows to everything
- Clutter any section

## 8. Responsive Behavior
- Mobile-first (Tailwind: sm:640 md:768 lg:1024 xl:1280)
- Cards: 3-col → 2-col → 1-col
- Hero text: 56px → 36px → 28px
- Section padding: 120px → 80px → 60px
- Nav: full links → hamburger at md breakpoint
- Sticky CTA bar on mobile (fixed bottom)

## 9. RTL Behavior
- Arabic = RTL layout (default)
- English = LTR layout
- CSS logical properties (start/end, not left/right)
- Text alignment follows direction
- Nav order mirrors in RTL
