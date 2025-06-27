# Torch Group Unified Spacing & Layout System

## Spacing Philosophy

The Torch Group design system uses a **8px base unit** with semantic naming for consistency and scalability. All spacing follows a geometric scale for visual harmony.

## Core Spacing Scale

| Semantic Name | Value (rem) | Value (px) | Tailwind Class | Usage |
|---------------|-------------|------------|----------------|-------|
| tight         | 0.25        | 4          | `space-1`      | Element borders, fine adjustments |
| compact       | 0.5         | 8          | `space-2`      | Small gaps, icon spacing |
| cozy          | 0.75        | 12         | `space-3`      | Form element spacing |
| comfortable   | 1           | 16         | `space-4`      | Standard component spacing |
| spacious      | 1.5         | 24         | `space-6`      | Section elements, cards |
| generous      | 2           | 32         | `space-8`      | Component separation |
| expansive     | 3           | 48         | `space-12`     | Major section spacing |
| grand         | 4           | 64         | `space-16`     | Hero sections, page sections |
| monumental    | 6           | 96         | `space-24`     | Major page divisions |

## Section Layout System

### Container Widths
```css
/* Content containers - choose based on content type */
.torch-container-text      { max-width: 65ch; }     /* Optimal reading width */
.torch-container-content   { max-width: 75rem; }    /* Standard content */
.torch-container-wide      { max-width: 90rem; }    /* Wide layouts */
.torch-container-full      { max-width: 100%; }     /* Full width */
```

### Section Padding (Responsive)
```css
/* Unified section padding system */
.torch-section-compact     { padding: 2rem 1rem; }                    /* Mobile: 32px, Desktop: 32px */
.torch-section-standard    { padding: 3rem 1rem 3rem 1rem; }          /* Mobile: 48px, Desktop: 48px */
.torch-section-spacious    { padding: 4rem 1rem 4rem 1rem; }          /* Mobile: 64px, Desktop: 64px */
.torch-section-hero        { padding: 6rem 1rem 6rem 1rem; }          /* Mobile: 96px, Desktop: 96px */

/* Responsive variants */
@media (min-width: 768px) {
  .torch-section-compact   { padding: 4rem 2rem; }                    /* 64px vertical, 32px horizontal */
  .torch-section-standard  { padding: 6rem 2rem; }                    /* 96px vertical, 32px horizontal */
  .torch-section-spacious  { padding: 8rem 2rem; }                    /* 128px vertical, 32px horizontal */
  .torch-section-hero      { padding: 10rem 2rem; }                   /* 160px vertical, 32px horizontal */
}

@media (min-width: 1024px) {
  .torch-section-compact   { padding: 5rem 3rem; }                    /* 80px vertical, 48px horizontal */
  .torch-section-standard  { padding: 8rem 3rem; }                    /* 128px vertical, 48px horizontal */
  .torch-section-spacious  { padding: 10rem 3rem; }                   /* 160px vertical, 48px horizontal */
  .torch-section-hero      { padding: 12rem 3rem; }                   /* 192px vertical, 48px horizontal */
}
```

## Typography Scale

| Purpose        | Mobile        | Desktop       | Usage |
|----------------|---------------|---------------|-------|
| Hero Display   | `text-4xl`    | `text-7xl`    | Main hero headlines |
| Section Title  | `text-2xl`    | `text-4xl`    | Section headings |
| Card Title     | `text-xl`     | `text-2xl`    | Card/component titles |
| Subheading     | `text-lg`     | `text-xl`     | Subheadings, taglines |
| Body Large     | `text-base`   | `text-lg`     | Important body text |
| Body Standard  | `text-sm`     | `text-base`   | Standard body text |
| Caption        | `text-xs`     | `text-sm`     | Fine print, captions |

## Layout Patterns

### Standard Section Template
```tsx
<section className="torch-section-standard">
  <div className="torch-container-content mx-auto">
    <div className="space-y-spacious">
      {/* Section header */}
      <div className="space-y-compact text-center">
        <h2 className="text-2xl md:text-4xl font-bold">Section Title</h2>
        <p className="text-base md:text-lg text-gray-600">Section description</p>
      </div>
      
      {/* Section content */}
      <div className="grid gap-comfortable md:gap-spacious">
        {/* Content items */}
      </div>
    </div>
  </div>
</section>
```

### Card Grid Template
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-comfortable md:gap-spacious">
  <div className="space-y-cozy p-comfortable border rounded-lg">
    {/* Card content */}
  </div>
</div>
```

## Component Spacing Standards

### Form Elements
```css
.torch-form-group     { margin-bottom: var(--torch-space-comfortable); }
.torch-form-fields    { gap: var(--torch-space-cozy); }
.torch-form-buttons   { gap: var(--torch-space-compact); margin-top: var(--torch-space-spacious); }
```

### Navigation
```css
.torch-nav-items      { gap: var(--torch-space-spacious); }
.torch-nav-mobile     { gap: var(--torch-space-comfortable); }
.torch-breadcrumb     { gap: var(--torch-space-compact); }
```

### Cards & Content
```css
.torch-card-padding   { padding: var(--torch-space-spacious); }
.torch-card-gap       { gap: var(--torch-space-comfortable); }
.torch-content-flow   { > * + * { margin-top: var(--torch-space-comfortable); } }
```

## Responsive Breakpoints (Simplified)

| Breakpoint | Value  | Usage |
|------------|--------|-------|
| Mobile     | < 768px | Single column, touch-optimized |
| Tablet     | 768px+ | Two columns, mixed interaction |
| Desktop    | 1024px+ | Multi-column, mouse-optimized |
| Wide       | 1280px+ | Enhanced layouts, more content |

## Best Practices

### Do ✅
- Use semantic spacing names (`comfortable`, `spacious`) over size names (`md`, `lg`)
- Apply consistent section padding using `.torch-section-*` classes
- Use the 8px base unit for all custom spacing
- Maintain vertical rhythm with consistent spacing between elements
- Use container classes for proper content width constraints

### Don't ❌
- Mix px, rem, and em units arbitrarily
- Create one-off spacing values outside the scale
- Use hardcoded spacing in components
- Ignore responsive spacing considerations
- Override section padding without system classes

## Migration Guide

### From Old System
1. Replace arbitrary spacing values with semantic scale
2. Use unified section classes instead of mixed Tailwind utilities  
3. Apply container classes for consistent content width
4. Update responsive breakpoints to simplified system

### Implementation Priority
1. **High**: Update section padding system across all pages
2. **Medium**: Migrate component spacing to semantic scale
3. **Low**: Optimize breakpoint usage and remove redundant variants

---

*This system ensures visual consistency, improved maintainability, and better developer experience across the Torch Group project.* 