# Home Page - Design Overrides

## Hero Section
- **Layout:** Asymmetric split (60/40) - content left, visual right
- **Headline:** `--text-4xl`, weight 800, `text-wrap: balance`
- **Subheadline:** `--text-lg`, `--color-fg-secondary`, max 60ch
- **Trust Badge:** Glass pill with `ShieldCheck` icon, `--color-accent-primary` accent
- **CTA Group:** Primary (Verify) + Ghost (Register) - clear hierarchy
- **Background:** Radial gradient from center: `radial-gradient(ellipse 80% 60% at 50% 20%, rgba(5,150,105,0.08) 0%, transparent 70%)` over `#000000`
- **No decorative floating orbs** - the gradient IS the atmosphere

## Workflow Cards (3-Step)
- **Container:** `grid lg:grid-cols-3 gap-6`
- **Card:** `.glass-panel` with numbered badge (monospace, large, `--color-accent-primary` at 30% opacity)
- **Icon:** Lucide, 24px, stroke-width 1.5, `--color-accent-primary`
- **Title:** `--text-xl`, weight 600
- **Description:** `--text-base`, `--color-fg-secondary`
- **Hover:** Border `--color-accent-primary` at 40%, translateY(-2px), shadow-lg
- **Focus:** Visible ring 3px `--color-accent-primary-glow`
- **Step Connector:** Hidden on mobile, visible on lg+ as subtle line between cards

## Architecture Specs Table
- **Font:** `--font-mono` throughout
- **Headers:** `--text-mono-sm`, uppercase, tracking-wider, `--color-fg-muted`
- **Values:** `--text-mono-base`, `--color-fg-primary`, right-aligned numbers
- **Rows:** Alternating `bg-white/2` for scanability
- **Mobile:** Horizontal scroll with scroll-shadow indicator, sticky first column
- **Key Metrics:** Model params, embedding dim, threshold, inference time - all real values

## Anti-Patterns Specific to Home
- ❌ No "AI-powered" badges without specificity
- ❌ No generic "lightning bolt" icons for speed
- ❌ No three-column feature grids with identical card heights
- ❌ No gradient text on headline (use solid `--color-fg-primary` with weight)