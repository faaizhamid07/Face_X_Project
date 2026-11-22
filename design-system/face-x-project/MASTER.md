# Face X Project - Design System Master

**Product Type:** Biometric Security Verification Platform  
**Industry:** Security / Developer Tools / Identity Verification  
**Target Audience:** Developers, Security Engineers, Biometric Researchers  
**Brand Personality:** Technical precision, trustworthy, clinical but not cold, high-stakes reliability

---

## Color System (Semantic Tokens)

### Core Palette - Dark Mode Primary (OLED Optimized)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#000000` | Page background, full-bleed sections |
| `--color-bg-elevated` | `#0A0E1A` | Cards, panels, modals (1 level up) |
| `--color-bg-glass` | `rgba(15, 23, 42, 0.6)` | Glassmorphism panels with backdrop-blur |
| `--color-bg-glass-strong` | `rgba(15, 23, 42, 0.8)` | Stronger glass for critical UI |
| `--color-border` | `rgba(255, 255, 255, 0.08)` | Default borders |
| `--color-border-strong` | `rgba(255, 255, 255, 0.15)` | Emphasized borders, focus rings |
| `--color-border-accent` | `rgba(5, 150, 105, 0.4)` | Accent borders (success/verified) |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-fg-primary` | `#FFFFFF` | Primary text, headings |
| `--color-fg-secondary` | `#94A3B8` | Secondary text, descriptions |
| `--color-fg-muted` | `#64748B` | Muted text, placeholders, disabled |
| `--color-fg-inverse` | `#000000` | Text on accent backgrounds |

### Accent System (Security/Biometric)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-primary` | `#059669` | Primary CTA, verified state, success |
| `--color-accent-primary-hover` | `#047857` | Hover state for primary accent |
| `--color-accent-primary-glow` | `rgba(5, 150, 105, 0.3)` | Glow/shadow for primary accent |
| `--color-accent-alert` | `#DC2626` | Rejected state, errors, destructive |
| `--color-accent-alert-hover` | `#B91C1C` | Hover for alert |
| `--color-accent-alert-glow` | `rgba(220, 38, 38, 0.3)` | Glow for alert |
| `--color-accent-warning` | `#D97706` | Warnings, partial states |
| `--color-accent-info` | `#0EA5E9` | Info, neutral actions, scanning |

### Status Colors (Biometric Specific)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-verified` | `#059669` | Match confirmed |
| `--color-rejected` | `#DC2626` | Match failed |
| `--color-pending` | `#0EA5E9` | Processing, scanning |
| `--color-enrolled` | `#059669` | Successfully enrolled |

---

## Typography System

### Font Stack

```css
/* Primary UI Font - Technical, clean, highly readable */
--font-sans: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Code, metrics, technical data, biometric values */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

/* Display - Hero headlines, major numbers (optional weight) */
--font-display: 'Manrope', system-ui, sans-serif;
```

### Type Scale (Fluid, clamp-based)

| Token | Size (clamp) | Line Height | Weight | Use Case |
|-------|--------------|-------------|--------|----------|
| `--text-xs` | `clamp(0.6875rem, 0.65rem + 0.19vw, 0.75rem)` | 1.4 | 400 | Labels, badges, timestamps |
| `--text-sm` | `clamp(0.8125rem, 0.78rem + 0.16vw, 0.875rem)` | 1.4 | 400 | Body small, captions |
| `--text-base` | `clamp(0.9375rem, 0.9rem + 0.19vw, 1rem)` | 1.5 | 400 | Body text |
| `--text-lg` | `clamp(1.0625rem, 1.0rem + 0.31vw, 1.125rem)` | 1.5 | 400 | Body large, important descriptions |
| `--text-xl` | `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` | 1.4 | 500 | Subheadings, card titles |
| `--text-2xl` | `clamp(1.5rem, 1.35rem + 0.75vw, 2rem)` | 1.3 | 600 | Section headings |
| `--text-3xl` | `clamp(1.875rem, 1.65rem + 1.13vw, 2.5rem)` | 1.2 | 700 | Page titles |
| `--text-4xl` | `clamp(2.25rem, 1.95rem + 1.5vw, 3.5rem)` | 1.1 | 800 | Hero headlines |
| `--text-metric` | `clamp(2.5rem, 2rem + 2.5vw, 4.5rem)` | 1.0 | 700 | Large metrics, confidence % |
| `--text-metric-sm` | `clamp(1.5rem, 1.3rem + 1vw, 2.25rem)` | 1.1 | 600 | Medium metrics |

### Mono Scale (Fixed sizes per Terminal CLI guidance)

| Token | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| `--text-mono-xs` | `0.6875rem` (11px) | 1.2 | 400 | Inline code, small metadata |
| `--text-mono-sm` | `0.8125rem` (13px) | 1.2 | 400 | Code snippets, technical labels |
| `--text-mono-base` | `0.9375rem` (15px) | 1.2 | 400 | Standard mono, metrics |
| `--text-mono-lg` | `1.125rem` (18px) | 1.15 | 500 | Prominent metrics, confidence |

---

## Spacing System (4px Base Rhythm)

| Token | Value | Use Case |
|-------|-------|----------|
| `--space-0` | `0` | Reset |
| `--space-1` | `0.25rem` (4px) | Micro gaps, icon-text |
| `--space-2` | `0.5rem` (8px) | Tight component spacing |
| `--space-3` | `0.75rem` (12px) | Standard component gaps |
| `--space-4` | `1rem` (16px) | Default padding, card gaps |
| `--space-5` | `1.25rem` (20px) | Section internal spacing |
| `--space-6` | `1.5rem` (24px) | Section spacing, card padding |
| `--space-8` | `2rem` (32px) | Large section gaps |
| `--space-10` | `2.5rem` (40px) | Page section spacing |
| `--space-12` | `3rem` (48px) | Major layout divisions |
| `--space-16` | `4rem` (64px) | Hero vertical spacing |

---

## Border Radius System

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-none` | `0` | Sharp edges |
| `--radius-sm` | `0.375rem` (6px) | Small elements, badges |
| `--radius-md` | `0.5rem` (8px) | Buttons, inputs, small cards |
| `--radius-lg` | `0.75rem` (12px) | Standard cards, panels |
| `--radius-xl` | `1rem` (16px) | Large cards, modals |
| `--radius-2xl` | `1.5rem` (24px) | Hero cards, major panels |
| `--radius-full` | `9999px` | Pills, badges, avatars |

---

## Shadow & Elevation System

| Token | Value | Use Case |
|-------|-------|----------|
| `--shadow-none` | `none` | Flat |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle depth |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Cards, panels |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 48px rgba(0,0,0,0.6)` | Major overlays |
| `--shadow-glass` | `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)` | Glassmorphism cards |
| `--shadow-accent` | `0 0 24px var(--color-accent-primary-glow)` | Verified/success glow |
| `--shadow-alert` | `0 0 24px var(--color-accent-alert-glow)` | Rejected/error glow |

---

## Glassmorphism System (Refined)

```css
.glass-panel {
  background: var(--color-bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-glass);
  border-radius: var(--radius-xl);
}

.glass-panel-strong {
  background: var(--color-bg-glass-strong);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--color-border-strong);
  box-shadow: var(--shadow-glass);
  border-radius: var(--radius-xl);
}

.glass-pill {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  font-weight: 500;
  font-family: var(--font-mono);
  transition: all 200ms ease;
}

.glass-pill:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--color-border-strong);
}
```

---

## Animation & Motion System

### Timing Tokens (Purpose-driven, not uniform)

| Token | Duration | Easing | Use Case |
|-------|----------|--------|----------|
| `--duration-instant` | `0ms` | - | State changes that must feel immediate |
| `--duration-fast` | `120ms` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Micro-interactions, hover, focus |
| `--duration-normal` | `200ms` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Standard transitions, panel open/close |
| `--duration-slow` | `300ms` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Modals, drawers, page transitions |
| `--duration-spring` | `400ms` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful/confirmation animations |

### Motion Guidelines

- **Reduced Motion:** All animations respect `prefers-reduced-motion: reduce` → disable or use instant transitions
- **Spatial Continuity:** Elements animate from their origin point (not from center)
- **Stagger:** List items stagger at 40-60ms intervals
- **Exit Faster Than Enter:** Exit transitions 20% faster than enter

---

## Component Specifications

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Primary - Verified/Success actions */
.btn-primary {
  background: var(--color-accent-primary);
  color: var(--color-fg-inverse);
  box-shadow: 0 2px 8px var(--color-accent-primary-glow);
}
.btn-primary:hover:not(:disabled) {
  background: var(--color-accent-primary-hover);
  box-shadow: 0 4px 16px var(--color-accent-primary-glow);
  transform: translateY(-1px);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px var(--color-accent-primary-glow);
}

/* Secondary - Neutral actions */
.btn-secondary {
  background: var(--color-bg-elevated);
  color: var(--color-fg-primary);
  border-color: var(--color-border);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-glass);
  border-color: var(--color-border-strong);
}

/* Ghost - Subtle actions */
.btn-ghost {
  background: transparent;
  color: var(--color-fg-secondary);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg-glass);
  color: var(--color-fg-primary);
}

/* Danger - Destructive actions */
.btn-danger {
  background: var(--color-accent-alert);
  color: var(--color-fg-inverse);
  box-shadow: 0 2px 8px var(--color-accent-alert-glow);
}
.btn-danger:hover:not(:disabled) {
  background: var(--color-accent-alert-hover);
  box-shadow: 0 4px 16px var(--color-accent-alert-glow);
}
```

### Inputs & Form Controls

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-fg-primary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
}
.input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px var(--color-accent-primary-glow);
}
.input::placeholder {
  color: var(--color-fg-muted);
}
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toggle Switch - Accessible, 44x44 minimum */
.toggle {
  position: relative;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
}
.toggle input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}
.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-out);
}
.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: var(--color-fg-primary);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-fast) var(--ease-out);
}
.toggle input:checked + .toggle-track {
  background: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
}
.toggle input:checked + .toggle-track + .toggle-thumb {
  transform: translateX(20px);
}
.toggle input:focus-visible + .toggle-track {
  box-shadow: 0 0 0 3px var(--color-accent-primary-glow);
}
```

### Cards & Panels

```css
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--ease-out);
}
.card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-lg);
}

.card-glass {
  @extend .glass-panel;
}

.card-glass-strong {
  @extend .glass-panel-strong;
}
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
}

.badge-verified {
  background: rgba(5, 150, 105, 0.15);
  color: #34D399;
  border-color: rgba(5, 150, 105, 0.3);
}

.badge-rejected {
  background: rgba(220, 38, 38, 0.15);
  color: #F87171;
  border-color: rgba(220, 38, 38, 0.3);
}

.badge-pending {
  background: rgba(14, 165, 233, 0.15);
  color: #60A5FA;
  border-color: rgba(14, 165, 233, 0.3);
}

.badge-info {
  background: rgba(100, 116, 139, 0.15);
  color: #94A3B8;
  border-color: rgba(100, 116, 139, 0.3);
}
```

---

## Layout Breakpoints

| Breakpoint | Token | Min Width | Target |
|------------|-------|-----------|--------|
| Mobile | `--bp-sm` | `375px` | Small phones |
| Mobile Large | `--bp-md` | `480px` | Large phones |
| Tablet | `--bp-lg` | `768px` | Tablets portrait |
| Desktop | `--bp-xl` | `1024px` | Laptops, small desktop |
| Desktop Large | `--bp-2xl` | `1440px` | Large monitors |
| Ultra Wide | `--bp-3xl` | `1920px` | Ultra-wide displays |

---

## Anti-Patterns to Avoid (AI Slop Markers)

1. **No generic purple/pink gradients** — Use purpose-driven accent colors only
2. **No decorative animations** — Every motion must convey state or feedback
3. **No placeholder content** — All text must be real, domain-specific copy
4. **No emoji as icons** — Lucide SVG only, consistent stroke width (1.5px)
5. **No arbitrary spacing** — Strict 4px rhythm only
6. **No raw hex in components** — Semantic tokens only
7. **No uniform transition durations** — Purpose-driven timing tokens
8. **No color-only state indication** — Always pair color with icon/text/shape
9. **No ignored reduced-motion** — All animations respect preference
10. **No unexplained acronyms** — Technical terms need context on first use

---

## Page-Specific Overrides

### Home Page (`pages/home.md`)
- Hero: Asymmetric layout, metric-forward, trust signals prominent
- Workflow cards: Interactive hover states, clear step progression
- Architecture table: Monospace font, scannable, sticky headers on mobile

### Register Page (`pages/register.md`)
- Webcam: Full-bleed sensor view, HUD overlays functional not decorative
- Gallery: Dense grid, keyboard navigable, clear selection states
- Progress: Determinate, meaningful milestones (not arbitrary %)

### Train Page (`pages/train.md`)
- Upload: Drag-drop with clear validation, progress per file
- Metrics table: Sticky columns, sortable, monospace numbers aligned right
- Log panel: Virtualized, auto-scroll toggle, copy-to-clipboard

### Verify Page (`pages/verify.md`)
- Camera: Prominent reticle, scanning line = real processing indicator
- Result card: Forensic detail, confidence gauge, actionable next steps
- History: Chronological, filterable, exportable, density toggle