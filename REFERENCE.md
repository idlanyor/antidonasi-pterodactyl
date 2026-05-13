# Design System Inspired by NalliShop

## 1. Visual Theme & Atmosphere

NalliShop's design system embodies a **modern, energetic digital marketplace** aesthetic tailored for fast-paced gaming and digital topup transactions. The visual identity balances **bold, playful accents** with clean, professional neutrals, creating an environment that feels both trustworthy and dynamic. The core mood is **efficient, vibrant, and accessible**—designed to reduce friction in digital commerce while maintaining a premium, contemporary feel. Gradient overlays (pink-to-purple), rounded containers, and purposeful shadows create depth and guide user attention toward critical actions like purchasing and account setup.

**Key Characteristics**
- **Gradient-forward CTAs**: Primary buttons use pink-to-purple gradients (`#EC4899` to `#7C3AED`) with soft shadows for depth
- **High contrast typography**: Satoshi font at bold weights (700–900) ensures readability and emphasis
- **Neutral-dominant layouts**: Extensive use of `#F8FAFC` and `#FFFFFF` backgrounds with `#0F172A` text for accessibility
- **Iconographic color coding**: Semantic colors (green, blue, purple, orange) applied to feature badges and trust indicators
- **Smooth, rounded surfaces**: Input fields and cards use `12px` radius for modern, friendly appearance
- **Subtle elevation**: Layered shadows create hierarchical depth without visual clutter

## 2. Color Palette & Roles

### Primary
- **Brand Navy** (`#0F172A`): Primary text, headings, and core UI elements. Dominant color establishing brand authority and legibility.
- **Slate Gray** (`#64748B`): Secondary text, captions, and subtle UI elements. Used for deemphasized copy and placeholders.

### Accent Colors
- **Vibrant Pink** (`#EC4899`): High-energy accent for featured content and promotional highlights. Creates visual pop and draws attention.
- **Electric Purple** (`#7C3AED`): Secondary accent for interactive states and depth layering. Complements pink in gradients.
- **Light Purple** (`#A855F7`): Tertiary accent for hover states and subtle highlights on interactive components.
- **Pale Lavender** (`#C084FC`): Soft accent for backgrounds and disabled states, providing visual softness.
- **Bright Blue** (`#2299DD`): Action indicator for links and secondary CTAs. Signals interactivity and trust.

### Interactive
- **Primary CTA**: Gradient from `#EC4899` to `#7C3AED` with shadow `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px`
- **Secondary CTA**: `#64748B` background with `#0F172A` text, subtle shadow for depth
- **Tertiary CTA**: Transparent background with `#64748B` text, no shadow
- **Link Color**: `#2299DD` for standard hyperlinks; `#64748B` for secondary navigation links

### Neutral Scale
- **Pure White** (`#FFFFFF`): Primary surface and card backgrounds. Creates clean, spacious layouts.
- **Off-White** (`#F8FAFC`): Subtle background tint for secondary surfaces and light containers.
- **Light Slate** (`#F1F5F9`): Tertiary background for hover states and inactive sections.
- **Border Gray** (`#E2E8F0`): Dividers, borders, and subtle separators between sections.
- **Medium Gray** (`#A3A3A3`): Disabled text and very subtle background tints.
- **Dark Neutral** (`#CBD5E1`): Muted borders and secondary dividers.
- **Black** (`#000000`): Reserved for maximum contrast in accessibility-critical text.

### Surface & Borders
- **Card Background**: `#FFFFFF` with soft elevation shadow
- **Border Color (Standard)**: `#E2E8F0` at `1px` width for subtle separation
- **Hover Surface**: `#F1F5F9` for interactive element backgrounds
- **Input Background**: `#FFFFFF` with inset shadow for depth perception

### Semantic / Status
- **Error / Danger** (`#EF4444`): Error messages, alerts, and destructive actions. High visibility for critical states.
- **Success** (`#10B981`): Positive confirmation, completed states, and validation success (inferred from green iconography in hero).
- **Warning** (`#F59E0B`): Attention states and cautionary information (inferred from orange badge in hero).
- **Info** (`#3B82F6`): Informational messages and secondary notifications (inferred from blue shield icon).

## 3. Typography Rules

### Font Family
**Primary**: Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif  
**Fallback**: Helvetica Neue, Arial, sans-serif

Satoshi is a geometric sans-serif that conveys modernity and friendliness—ideal for gaming and fintech contexts.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| **Display / H1** | Satoshi | 48px | 900 | 52.8px | -0.02em | Hero headline; "Top up games in seconds." Large, bold, high impact. |
| **Heading / H2** | Satoshi | 20px | 700 | 28px | -0.01em | Section titles and feature headers. Clean emphasis without aggression. |
| **Subheading / H3** | Satoshi | 20px | 900 | 28px | 0em | Featured section titles. Same size as H2 but heavier for contrast. |
| **Body / Paragraph** | Satoshi | 18px | 900 | 28px | 0em | Primary body text in value propositions. Bold weight ensures legibility at scale. |
| **Body Regular** | Satoshi | 16px | 400 | 24px | 0em | Standard paragraph copy, navigation links, and default text. |
| **Button Label** | Satoshi | 12px | 700 | 16px | 0em | Compact CTA labels in action buttons. Bold for emphasis. |
| **Badge / Label** | Satoshi | 12px | 700 | 16px | 0em | Tag labels, badges, and metadata tags. Consistent with button sizing. |
| **Overline** | Satoshi | 12px | 700 | 16px | 0.05em | Small caps for section prefixes ("FAST & RELIABLE TOP UP"). |
| **Caption** | Satoshi | 14px | 500 | 20px | 0em | Supporting text, secondary links, and fine print. Medium weight for balance. |
| **Input / Form** | Satoshi | 16px | 500 | 24px | 0em | Text input and form field content. Medium weight maintains legibility. |
| **Code / Monospace** | Courier New | 14px | 400 | 20px | 0em | API docs and technical references (inferred). Use monospace to differentiate. |

### Principles
- **Hierarchy through weight, not size**: Satoshi's variable weight (400–900) provides visual distinction without excessive size changes, maintaining compact layouts.
- **Generous line height**: All text uses line-height ≥ 1.4× font size for comfortable reading and touch accessibility.
- **Bold defaults**: Body text defaults to weight 700–900 to ensure visual prominence in a busy marketplace interface.
- **Neutral for secondary content**: Secondary text uses `#64748B` at 400–500 weight to create visual receding without reducing legibility.
- **Consistent baseline grid**: Typography aligns to `4px` vertical rhythm for structural cohesion.

## 4. Component Stylings

### Buttons

#### Primary CTA Button (Large)
- **Background**: Gradient `linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)`
- **Text Color**: `#FFFFFF`
- **Font Size**: `12px`
- **Font Weight**: `700`
- **Padding**: `10px 24px`
- **Border Radius**: `4px`
- **Border**: None
- **Box Shadow**: `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px`
- **Height**: `40px`
- **Hover State**: Increase opacity to `0.9`, lift shadow to `rgba(168, 85, 247, 0.32) 0px 18px 36px 0px`
- **Active State**: Opacity `0.85`, shadow `rgba(168, 85, 247, 0.2) 0px 8px 20px 0px`
- **Disabled State**: Opacity `0.5`, shadow none

#### Primary CTA Button (Rounded)
- **Background**: Gradient `linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)`
- **Text Color**: `#FFFFFF`
- **Font Size**: `12px`
- **Font Weight**: `700`
- **Padding**: `10px 20px`
- **Border Radius**: `8px`
- **Border**: None
- **Box Shadow**: `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px`
- **Height**: `36px`
- **Hover State**: Increase opacity to `0.9`, lift shadow to `rgba(168, 85, 247, 0.32) 0px 18px 36px 0px`
- **Active State**: Opacity `0.85`, shadow `rgba(168, 85, 247, 0.2) 0px 8px 20px 0px`

#### Secondary Button
- **Background**: `#F1F5F9`
- **Text Color**: `#64748B`
- **Font Size**: `12px`
- **Font Weight**: `700`
- **Padding**: `8px 12px`
- **Border Radius**: `4px`
- **Border**: `1px solid #E2E8F0`
- **Box Shadow**: `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Height**: `36px`
- **Hover State**: Background `#E2E8F0`, text `#0F172A`
- **Active State**: Background `#CBD5E1`, shadow `rgba(0, 0, 0, 0.08) 0px 2px 4px 0px`

#### Ghost / Tertiary Button
- **Background**: `transparent`
- **Text Color**: `#64748B`
- **Font Size**: `11px`
- **Font Weight**: `600`
- **Padding**: `0px`
- **Border Radius**: `0px`
- **Border**: None
- **Box Shadow**: None
- **Height**: `auto`
- **Hover State**: Text `#0F172A`, underline or subtle background `#F8FAFC`
- **Active State**: Text `#0F172A`

#### Icon Button (Compact)
- **Background**: `#F8FAFC`
- **Icon Color**: `#64748B`
- **Padding**: `0px` (icon-only, 40px×40px minimum)
- **Border Radius**: `4px`
- **Border**: None
- **Box Shadow**: `rgba(0, 0, 0, 0.05) 0px 1px 3px 0px`
- **Hover State**: Background `#E2E8F0`, icon `#0F172A`

### Cards & Containers

#### Feature Card
- **Background**: `#FFFFFF`
- **Padding**: `24px 32px`
- **Border Radius**: `12px`
- **Border**: `1px solid #E2E8F0`
- **Box Shadow**: `rgba(15, 23, 42, 0.08) 0px -10px 30px 0px` (lg elevation)
- **Text Color**: `#0F172A` (headings), `#64748B` (body)
- **Hover State**: Shadow `rgba(15, 23, 42, 0.12) 0px -12px 36px 0px`

#### Featured Section Container
- **Background**: Subtle gradient `linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%)`
- **Padding**: `48px 64px`
- **Border Radius**: `16px`
- **Border**: `1px solid #E2E8F0`
- **Box Shadow**: `rgba(0, 0, 0, 0.04) 0px 0px 12px 0px`

#### Badge / Label Container
- **Background**: `#F1F5F9`
- **Padding**: `4px 12px`
- **Border Radius**: `4px`
- **Text Color**: `#0F172A`
- **Font Size**: `12px`
- **Font Weight**: `700`
- **Border**: None

#### Stat Block (Large Numbers)
- **Background**: `#FFFFFF`
- **Padding**: `24px`
- **Border Radius**: `12px`
- **Border**: `1px solid #E2E8F0`
- **Headline Font Size**: `28px`
- **Headline Font Weight**: `900`
- **Headline Color**: `#0F172A`
- **Subheading Font Size**: `14px`
- **Subheading Color**: `#64748B`

### Inputs & Forms

#### Text Input (Default)
- **Background**: `#FFFFFF`
- **Text Color**: `#0F172A`
- **Font Size**: `16px`
- **Font Weight**: `500`
- **Padding**: `16px 16px 16px 56px` (left padding for icon)
- **Border Radius**: `12px`
- **Border**: None
- **Box Shadow**: `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Height**: `56px`
- **Placeholder Color**: `#A3A3A3`
- **Focus State**: Box shadow `rgba(168, 85, 247, 0.25) 0px 0px 0px 3px`, outline none
- **Error State**: Border `2px solid #EF4444`, box shadow `rgba(239, 68, 68, 0.15) 0px 4px 8px 0px`

#### Input with Icon (Search)
- **Left Icon Padding**: `16px` from left edge
- **Icon Color**: `#64748B`
- **Icon Size**: `20px × 20px`
- **Text Starts At**: `56px` from left

#### Textarea
- **Background**: `#FFFFFF`
- **Text Color**: `#0F172A`
- **Font Size**: `16px`
- **Font Weight**: `500`
- **Padding**: `16px`
- **Border Radius**: `8px`
- **Border**: `1px solid #E2E8F0`
- **Min Height**: `120px`
- **Focus State**: Border `2px solid #7C3AED`, shadow `rgba(168, 85, 247, 0.15) 0px 0px 0px 4px`

#### Form Label
- **Font Size**: `14px`
- **Font Weight**: `600`
- **Color**: `#0F172A`
- **Margin Bottom**: `8px`

### Navigation

#### Header Navigation Bar
- **Background**: `#FFFFFF`
- **Height**: `64px`
- **Padding**: `0px 48px`
- **Box Shadow**: `rgba(15, 23, 42, 0.08) 0px -10px 30px 0px` (lg elevation, subtle bottom shadow)
- **Border Bottom**: Optional `1px solid #E2E8F0`

#### Navigation Link (Header)
- **Text Color**: `#0F172A`
- **Font Size**: `16px`
- **Font Weight**: `400`
- **Padding**: `0px 24px`
- **Border Radius**: `0px`
- **Height**: `36px`
- **Hover State**: Text `#7C3AED`, background `transparent`
- **Active State**: Text `#7C3AED`, bottom border `2px solid #7C3AED`

#### Mobile Navigation Menu
- **Background**: `#FFFFFF`
- **Padding**: `16px`
- **Border Radius**: `8px`
- **Box Shadow**: `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`

### Links

#### Standard Link
- **Text Color**: `#2299DD`
- **Font Size**: `16px`
- **Font Weight**: `400`
- **Decoration**: None (underline on hover)
- **Hover State**: Text `#1a7ab8`, underline `2px solid #2299DD`
- **Active State**: Text `#165a96`

#### Secondary Navigation Link
- **Text Color**: `#64748B`
- **Font Size**: `14px`
- **Font Weight**: `500`
- **Padding**: `8px 16px`
- **Border Radius**: `4px`
- **Hover State**: Background `#F1F5F9`, text `#0F172A`
- **Active State**: Background `#E2E8F0`, text `#0F172A`, border `1px solid #CBD5E1`

## 5. Layout Principles

### Spacing System

**Base Unit**: `4px`

**Spacing Scale**:
- **XS**: `4px` — Tight spacing between inline elements (icon + text, button icon gaps)
- **S**: `8px` — Compact spacing in form groups, small containers
- **M**: `12px` — Standard padding in buttons, badges, small components
- **L**: `16px` — Primary padding in form fields, card content
- **XL**: `24px` — Spacing between major sections, card padding
- **2XL**: `32px` — Large padding in hero sections and feature areas
- **3XL**: `40px` — Major section separation
- **4XL**: `48px` — Top/bottom padding in full-width sections
- **5XL**: `64px` — Hero section padding, premium spacing
- **6XL**: `80px` — Page-level section margin

**Usage Context**:
- **Padding**: Buttons `8px–24px`, Cards `24px–64px`, Inputs `16px`, Hero `48px–64px`
- **Margin**: Section gaps `40px–80px`, Text below headings `20px–28px`
- **Gap**: Flex/grid gaps `8px–24px` depending on density

### Grid & Container

**Max Width**: `1280px` (container)
**Padding (Sides)**: `24px` (mobile), `48px` (desktop)
**Column Strategy**: 
- Mobile: Single column, full bleed with `16px` side padding
- Tablet: 2–4 columns with flexible gaps
- Desktop: 12-column grid, `24px` gutter, max content width `1280px`
- Feature sections: Full-width with centered max-width container

**Section Patterns**:
- **Hero**: Full-width background (gradient or solid), centered content max-width `1280px`
- **Grid of Cards**: 4 columns desktop, 2 columns tablet, 1 column mobile with `24px` gap
- **Two-Column Layout**: 60/40 or 50/50 split with `32px` gap
- **Feature List**: Vertical stack with `24px` gap between items

### Whitespace Philosophy

Generous whitespace is fundamental to NalliShop's hierarchy and breathing room. Layouts avoid cramping, with intentional breathing room around:
- Headings: `20px–28px` margin below
- Cards: `32px` horizontal/vertical gap in grid layouts
- Sections: `64px–80px` vertical separation
- Input groups: `16px` between labels and fields

This creates visual clarity, reduces cognitive load, and guides user attention toward key interactive elements.

### Border Radius Scale

- **Tight** (`4px`): Buttons, small badges, icon buttons—conveys precision and action-focus
- **Soft** (`8px`): Navigation elements, secondary cards, filter tags—balanced modern feel
- **Rounded** (`12px`): Primary cards, input fields, featured containers—friendly, approachable aesthetic
- **Full** (`3.35544e+07px` or `9999px`): Pill-shaped buttons and badges—maximum friendliness and visual softness
- **Sharp** (`0px`): Navigation bars, section dividers—clean, structured appearance

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| **Flat (0)** | No shadow, border only (`#E2E8F0 1px`) | Disabled states, secondary links, flat cards on neutral backgrounds |
| **Raised (sm)** | `rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px` | Icon buttons, small secondary elements, form inputs at rest |
| **Elevated (md)** | `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px` | Primary CTA buttons, hover states on large cards |
| **Prominent (lg)** | `rgba(15, 23, 42, 0.08) 0px -10px 30px 0px` | Navigation bar (top shadow, subtle), featured card containers, section emphasis |
| **Maximum (xl)** | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | Modal overlays, dropdown menus, mobile navigation—maximum depth and focus |

**Shadow Philosophy**:
Shadows in NalliShop are **purposeful and directional**. The design favors soft, diffused shadows (with high blur values `14px–30px`) that create perceived depth without harsh contrast. Purple-tinted shadows (`rgba(168, 85, 247, ...)`) on primary CTAs reinforce brand identity through color-coded elevation. Subtle top shadows on navigation (`-10px` offset) suggest layering without overwhelming. Disabled states and inactive components use minimal or no shadow to signal unavailability. Each shadow level corresponds to a clear interaction context: buttons elevate on hover, cards pop on focus, modals dominate through maximum blur and opacity.

## 7. Do's and Don'ts

### Do
- **Use bold typography (700–900 weight)** for body text and headings to maximize legibility at any size and create visual emphasis in a competitive marketplace.
- **Apply gradient CTAs** (`#EC4899` to `#7C3AED`) for all primary actions—they create high visual contrast and reinforce brand personality.
- **Maintain minimum 56px touch targets** on buttons, inputs, and interactive elements to ensure mobile usability and accessibility compliance.
- **Leverage the purple shadow** (`rgba(168, 85, 247, 0.24)`) on elevated elements to tie interactive components visually to the brand color system.
- **Use the Satoshi typeface consistently** across all sizes and weights—its geometric nature and varied weights support both playfulness and professionalism.
- **Group related inputs vertically** with `16px` gaps and provide clear, bold labels (`14px`, weight `600`) above each field.
- **Create visual hierarchy through color and weight**, not size—reserve size changes for display text only (`48px` h1).
- **Provide generous padding in cards** (`24px–32px`) to create breathing room and reduce cognitive load in information-dense interfaces.
- **Use semantic colors** (green for success, red for error, blue for info) consistently to support user mental models.
- **Test all text at minimum 16px font size** on forms and navigation to maintain readability across devices.

### Don't
- **Don't use body text lighter than 400 weight**—reduces legibility and conflicts with brand bold aesthetic.
- **Don't apply shadows to disabled elements**—shadow conveys interactivity; use opacity instead (`0.5`).
- **Don't exceed 2–3 levels of heading hierarchy** in a single section—confuses visual priority and navigation.
- **Don't shrink input fields below 40px height**—violates touch accessibility and feels cramped.
- **Don't mix shadow styles**—stick to the defined elevation scale (sm, md, lg, xl) for visual consistency.
- **Don't use pure black (`#000000`) text on light backgrounds**—use `#0F172A` instead for softer, more sophisticated appearance.
- **Don't leave form labels unstyled**—always apply `14px`, weight `600`, `#0F172A` color and maintain `8px` margin-bottom.
- **Don't apply rounded corners (`12px+`) to navigation bars or structural elements**—reserve rounding for cards, inputs, and CTAs to maintain distinction.
- **Don't use low-contrast text colors** (e.g., `#A3A3A3` on `#F8FAFC`)—always verify WCAG AA compliance (4.5:1 minimum for body text).
- **Don't create button variants beyond primary, secondary, ghost, and icon**—additional variants create cognitive load and complicate implementation.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| **Mobile** | `< 640px` | Single-column layout, full-bleed padding `16px`, stacked cards, input width `100%`, font sizes reduced by 1–2px, `20px–24px` section gaps |
| **Tablet** | `640px–1024px` | 2-column grid for cards, 2-column content layout (50/50), padding `24px`, sidebar navigation optional, input width `100%`, section gaps `32px–40px` |
| **Desktop** | `1024px–1280px` | 4-column card grid, 3-column layout options, full header navigation, padding `48px`, max-width container active, section gaps `48px–64px` |
| **Large Desktop** | `> 1280px` | 4-column card grid maintained, max-width `1280px` enforced, 12-column grid available for custom layouts, padding `64px`, full-width feature sections with centered inner max-width |

### Touch Targets

- **Minimum Height**: `44px` (buttons, links, navigation items)
- **Minimum Width**: `44px` (buttons, icon buttons)
- **Minimum Padding**: `12px` around interactive zones on touch devices
- **Spacing Between Targets**: `8px` minimum to prevent accidental mis-taps
- **Form Inputs**: Minimum `56px` height on mobile (current design), `40px` acceptable on desktop
- **Mobile Navigation**: Full-height tappable areas with `24px` padding, no smaller than `48px` per touch target

### Collapsing Strategy

1. **Header Navigation**: Desktop shows inline links (`16px` text, `24px` padding); tablet hides secondary links; mobile shows hamburger menu with overlay navigation
2. **Card Grids**: Desktop 4 columns → Tablet 2 columns → Mobile 1 column (full-width with `16px` padding)
3. **Two-Column Sections**: Desktop 60/40 split → Tablet 50/50 → Mobile stacked (100% width each)
4. **Padding Reduction**: Desktop `48px–64px` → Tablet `24px–32px` → Mobile `16px`
5. **Font Sizes**: H1 `48px` (desktop) → `36px` (tablet) → `28px` (mobile); body `18px` → `16px` → `16px` (no change, baseline readability)
6. **Spacing Scale**: All gaps reduce by 1 tier (e.g., `32px` → `24px` → `16px`) as screen shrinks
7. **Feature Cards**: Desktop hero `48px` padding → Tablet `32px` → Mobile `24px`
8. **Input Fields**: Width `100%` on mobile/tablet; max-width `576px` on desktop
9. **Hide / Show**: Desktop shows secondary navigation, stats blocks; tablet hides some stats; mobile shows priority content only

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Gradient Pink-to-Purple (`#EC4899` → `#7C3AED`) with shadow `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px`
- **Primary Text / Headings**: Brand Navy (`#0F172A`)
- **Secondary Text**: Slate Gray (`#64748B`)
- **Background (Default)**: Pure White (`#FFFFFF`)
- **Background (Secondary)**: Off-White (`#F8FAFC`)
- **Border / Divider**: Light Slate (`#E2E8F0`)
- **Hover Surface**: Light Slate (`#F1F5F9`)
- **Error**: Red (`#EF4444`)
- **Success**: Green (`#10B981`)
- **Info**: Blue (`#3B82F6`)
- **Warning**: Orange (`#F59E0B`)
- **Link**: Bright Blue (`#2299DD`)

### Iteration Guide

1. **Typography Foundation**: All body text uses Satoshi font family with weight 700–900 for bold presence. H1 is `48px` bold (`900`), H2/H3 are `20px` with weights `700`/`900`, body text `16px–18px` weight `400–900`. Apply `#0F172A` for headings, `#64748B` for secondary text.

2. **Primary CTA Styling**: All "Search," "Login," "Get Started," and main action buttons use gradient `linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)` background, `#FFFFFF` text, `12px` bold, `10px 24px` padding, `4px–8px` border radius, and purple shadow `rgba(168, 85, 247, 0.24) 0px 14px 30px 0px`. Always include shadow and gradient for maximum visual impact.

3. **Input Field Standard**: Search inputs and form fields are `56px` height (mobile/desktop), `#FFFFFF` background, `16px` padding (left `56px` for icon), `12px` border radius, text `#0F172A` weight `500`, with inset shadow `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`. Focus state adds purple border `2px solid #7C3AED` and glow shadow.

4. **Card Container**: Feature cards and content containers use `#FFFFFF` background, `24px–32px` padding, `12px` border radius, `1px` border `#E2E8F0`, and lg elevation shadow `rgba(15, 23, 42, 0.08) 0px -10px 30px 0px`. Hover elevates to `rgba(15, 23, 42, 0.12) 0px -12px 36px 0px`.

5. **Navigation Bar**: Header is `64px` height, `#FFFFFF` background, `0–48px` padding horizontally, with subtle bottom shadow `rgba(15, 23, 42, 0.08) 0px -10px 30px 0px`. Links are `16px` text weight `400` `#0F172A`, hover to `#7C3AED` with bottom border `2px solid #7C3AED`.

6. **Spacing System**: Use base unit `4px` scaling (`8px` = S, `16px` = L, `24px` = XL, `32px` = 2XL, `48px` = 4XL, `64px` = 5XL). Apply `24px` gaps between cards in grids, `32px` padding in hero sections, `40px–80px` between major sections. Mobile reduces all by 1 tier.

7. **Color Semantics**: Always use green (`#10B981`) for success badges, red (`#EF4444`) for errors, blue (`#3B82F6`) for info, orange (`#F59E0B`) for warnings. These create universal user understanding in gaming/fintech context.

8. **Elevation / Shadow**: Apply sm shadow (`rgba(0, 0, 0, 0.05) 0px 1px 3px 0px`) to secondary buttons, md shadow to primary CTAs, lg shadow to cards, xl shadow to modals. No shadows on disabled states. Use shadow to communicate depth, not decoration.

9. **Responsive Collapse**: At `< 640px`, stack all layouts vertically, reduce padding to `16px`, make buttons `100%` width, collapse 4-column card grids to 1 column. At `640px–1024px`, use 2-column grids and `24px` padding. At `1024px+`, enable full 4-column grids and `48px` padding. Always enforce max-width `1280px` on desktop.

10. **Accessibility Minimum**: All text ≥ `14px` for readability. Touch targets ≥ `44px` height/width. Color contrast ≥ 4.5:1 for body text (`#0F172A` on `#FFFFFF` passes WCAG AA). Form labels always visible, `12px` bold, positioned above inputs with `8px` margin-bottom. Use semantic color + icon + text for status indicators (not color alone).