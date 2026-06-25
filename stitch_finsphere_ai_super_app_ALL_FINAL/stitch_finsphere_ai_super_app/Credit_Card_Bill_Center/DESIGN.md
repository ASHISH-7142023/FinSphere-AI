---
name: FinSphere AI
colors:
  surface: '#0e1511'
  surface-dim: '#0e1511'
  surface-bright: '#333b37'
  surface-container-lowest: '#08100c'
  surface-container-low: '#161d1a'
  surface-container: '#1a211d'
  surface-container-high: '#242c28'
  surface-container-highest: '#2f3632'
  on-surface: '#dce4de'
  on-surface-variant: '#bbcac1'
  inverse-surface: '#dce4de'
  inverse-on-surface: '#2a322e'
  outline: '#85948c'
  outline-variant: '#3c4a43'
  surface-tint: '#3adfab'
  primary: '#42e5b0'
  on-primary: '#003828'
  primary-container: '#00c896'
  on-primary-container: '#004d38'
  inverse-primary: '#006c4f'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffbca2'
  on-tertiary: '#591d00'
  tertiary-container: '#ff9467'
  on-tertiary-container: '#762b05'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#60fcc6'
  primary-fixed-dim: '#3adfab'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7b2f09'
  background: '#0e1511'
  on-background: '#dce4de'
  surface-variant: '#2f3632'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is engineered for a premium, AI-driven fintech experience that balances high-stakes financial trust with cutting-edge technological sophistication. The brand personality is "The Precise Visionary"—expert and secure, yet approachable and forward-thinking.

The visual style is a hybrid of **Modern Corporate** and **Glassmorphism**. It utilizes deep obsidian surfaces layered with translucent glass panels to create a sense of infinite depth. The aesthetic draws inspiration from high-performance developer tools (Linear) and polished financial interfaces (Stripe), resulting in a UI that feels both "engineered" and "luxurious." The target audience consists of tech-native investors and high-net-worth individuals who value clarity, speed, and intelligent insights.

## Colors
The palette is rooted in a "Dark Mode First" philosophy to emphasize the glowing AI elements and glass textures.

- **Primary (Emerald Green):** Used for growth indicators, primary actions, and brand highlights. It symbolizes prosperity and digital vitality.
- **Secondary (Deep Navy):** The foundational surface color, providing a stable and trustworthy base that feels more sophisticated than pure black.
- **Accent (Royal Blue):** Reserved for interactive focus states, secondary highlights, and AI-driven features.
- **System Colors:** Success, Warning, and Danger are calibrated for high legibility against dark backgrounds, using high-saturation tones to ensure immediate recognition.

In Light Mode, the Deep Navy transitions to a soft Slate-50, and glass effects switch from dark-tinted translucency to high-exposure white blurs.

## Typography
The typography strategy prioritizes data legibility and modern character.

- **Headings:** We use **Plus Jakarta Sans** (a modern alternative to Poppins) for its friendly yet geometric structure. It provides a welcoming "Fintech" feel that balances the technicality of the app.
- **UI & Data:** **Inter** is the workhorse for all body text and financial data, chosen for its exceptional readability at small sizes and its neutral, systematic tone.
- **Technical Labels:** **Geist** is introduced for monospaced data points, labels, and AI-generated code snippets to provide a "developer-grade" precision look.

All financial figures should utilize tabular num features (tnum) to ensure numbers align perfectly in lists and tables.

## Layout & Spacing
This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

The spacing rhythm is based on an **8px linear scale**, but utilizes 24px (md) as the default padding for cards and containers to create a "breathable" and premium feel. 

- **Desktop:** 24px gutters with 48px side margins.
- **Tablet:** 16px gutters with 32px side margins.
- **Mobile:** 16px gutters with 16px side margins. 

Large-scale dashboard layouts should use "Internal Sectioning," where secondary sidebars and main content areas are separated by subtle glass dividers rather than heavy borders.

## Elevation & Depth
Depth is the core differentiator of this design system. It is achieved through **Tonal Layering** and **Glassmorphism**.

1.  **Level 0 (Base):** The darkest surface (#020617), acting as the canvas.
2.  **Level 1 (Cards):** Subsurface containers with a subtle gradient fill and a 1px inner "shine" border (Alpha 10% White).
3.  **Level 2 (Glass Overlays):** Modals and dropdowns use a `backdrop-filter: blur(20px)` with a semi-transparent background (Alpha 40% Navy).
4.  **Shadows:** Shadows are not black; they are tinted with the Primary Emerald or Secondary Navy color, using a multi-layered approach:
    - *Umbra:* 0px 4px 12px (Alpha 20% Navy)
    - *Penumbra:* 0px 12px 32px (Alpha 10% Navy)

## Shapes
The shape language is optimistic and modern, favoring large radii that soften the technical nature of financial data.

- **Standard Containers:** Use `rounded-lg` (16px) for most dashboard cards and input fields.
- **Promotional/Primary Cards:** Use `rounded-xl` (24px) to draw attention.
- **Action Elements:** Buttons use a `2rem` pill-shape to distinguish them from data containers.
- **AI Bubbles:** The AI chat interface uses asymmetrical rounding (16px on three corners, 4px on the user-facing corner) to indicate directionality.

## Components
- **Sleek Dashboard Cards:** Feature a 1px border with a "conic-gradient" animation that rotates slowly when the card is in a focused or "active growth" state.
- **Interactive Glass Buttons:** Instead of solid fills, primary buttons use a vibrant Emerald gradient with a high-gloss overlay. Secondary buttons are "Ghost Glass"—transparent with a blur and a white border.
- **Gradient Charts:** Area charts must use a vertical gradient transition from the Primary Emerald (Alpha 40%) to transparent.
- **AI Advisor Elements:** Chat messages utilize a distinct "Glow-pulse" border-bottom to signify the AI is "thinking" or processing live data.
- **Achievement Badges:** Circular icons with a metallic mesh gradient (Silver to Chrome) and a soft outer glow in the badge's thematic color (e.g., Gold for high performance).
- **Inputs:** High-contrast fields with a dark navy background, changing to an Emerald 1px glow on focus.