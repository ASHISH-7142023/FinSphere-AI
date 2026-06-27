---
name: Snow & Emerald
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3c4a43'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6c7a72'
  outline-variant: '#bbcac1'
  surface-tint: '#006c4f'
  primary: '#006c4f'
  on-primary: '#ffffff'
  primary-container: '#00c896'
  on-primary-container: '#004d38'
  inverse-primary: '#3adfab'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#505f76'
  on-tertiary: '#ffffff'
  tertiary-container: '#a1b1ca'
  on-tertiary-container: '#344459'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#60fcc6'
  primary-fixed-dim: '#3adfab'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system embodies a "Snow & Emerald" aesthetic, merging the clinical precision of high-end fintech with the refreshing vitality of organic growth. The brand personality is authoritative yet approachable, utilizing a refined **Corporate Modern** style infused with **Glassmorphism** to convey transparency and technological sophistication. 

Targeting a high-net-worth and tech-savvy audience, the UI evokes a sense of calm, clarity, and precision. The visual language relies on expansive white space, subtle depth through translucent layers, and a singular, vibrant accent color to guide the user's focus.

## Colors
The palette is rooted in high-contrast clarity. The primary **Emerald Green** (#00C896) is reserved for critical actions, success states, and brand highlights. The core background is a pure **Snow White** (#FFFFFF), while secondary surfaces and containers use a crisp **Gray-Blue** (#F8FAFC) to create subtle structural definition. Text is rendered in **Deep Charcoal** (#1E293B) to ensure AAA accessibility and a premium, weighted feel.

## Typography
This design system utilizes a dual-font strategy. **Lexend** is used for headings and data visualizations to provide a modern, rhythmic, and highly readable experience. **Inter** handles all body copy and UI labels, offering a neutral, systematic utility that balances the character of the headlines. Large display sizes utilize tighter letter spacing to maintain a premium "editorial" feel, while labels are slightly tracked out for legibility at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. A strict 8px spatial rhythm governs all padding and margins. 

- **Desktop:** 12 columns, 24px gutters, 64px side margins.
- **Tablet:** 8 columns, 20px gutters, 32px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.

Horizontal spacing focuses on creating "breathing room" around data-heavy elements, ensuring the AI-driven insights do not feel cluttered.

## Elevation & Depth
Depth is conveyed through a combination of **Tonal Layering** and **Glassmorphism**. 

- **Level 0 (Background):** Pure #FFFFFF.
- **Level 1 (Cards/Surface):** #F8FAFC with a 1px border of #E2E8F0.
- **Level 2 (Glass):** Backdrop filter (blur: 12px) with a semi-transparent white fill (rgba(255, 255, 255, 0.7)) and a subtle 1px white inner-stroke to simulate light hitting an edge.
- **Shadows:** Use extra-diffused ambient shadows. A "Soft Float" shadow uses `0 10px 30px rgba(30, 41, 59, 0.04)` to lift elements without creating visual "dirt."

## Shapes
The shape language is consistently **Rounded**, reflecting a friendly and accessible fintech environment. Standard components utilize a 0.5rem (8px) radius. Larger containers like cards or glass panels use 1rem (16px) to emphasize the soft, premium feel. This softening of the geometry balances the technical nature of AI data.

## Components
- **Buttons:** Primary buttons are solid Emerald (#00C896) with white text. Secondary buttons use a Glassmorphic style: transparent background, 1px emerald border, and emerald text.
- **Input Fields:** Use #F8FAFC fill with a 1px border (#E2E8F0). On focus, the border transitions to Emerald with a soft 4px outer glow.
- **Cards:** White or Glassmorphic backgrounds with `rounded-lg` (16px) corners. All cards must feature a subtle 1px border to maintain definition against the white background.
- **Chips/Badges:** Small, pill-shaped elements. Success states use Emerald backgrounds at 10% opacity with solid Emerald text.
- **Lists:** Clean, border-bottom separated rows. High contrast between primary text (Charcoal) and metadata (Gray-Blue).
- **AI Insights:** Specialized "AI Suggestion" components use the Glassmorphism effect with a very subtle Emerald tint in the backdrop blur to signify intelligence and brand presence.