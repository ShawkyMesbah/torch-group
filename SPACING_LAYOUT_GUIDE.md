# Torch Group Spacing & Layout System

## Spacing Scale

Use a consistent 4pt/8pt grid for all margins, paddings, and gaps. Example values:

| Name   | px   | Tailwind class |
|--------|------|----------------|
| xs     | 4    | `m-1`/`p-1`    |
| sm     | 8    | `m-2`/`p-2`    |
| md     | 16   | `m-4`/`p-4`    |
| lg     | 24   | `m-6`/`p-6`    |
| xl     | 32   | `m-8`/`p-8`    |
| 2xl    | 40   | `m-10`/`p-10`  |
| 3xl    | 48   | `m-12`/`p-12`  |

**Tip:** Use `gap-x-4`, `gap-y-8`, etc. for flex/grid spacing.

---

## Section & Container Conventions

- **Section padding:**
  - `py-16 md:py-24 lg:py-32` for vertical rhythm
- **Max width:**
  - Use `max-w-5xl`, `max-w-7xl`, or `container mx-auto` for content blocks
- **Centering:**
  - Use `mx-auto` and `text-center` for hero/landing sections

**Example:**
```tsx
<section className="py-16 md:py-24">
  <div className="max-w-5xl mx-auto text-center">
    ...
  </div>
</section>
```

---

## Font Size & Weight Hierarchy

| Element    | Size (Tailwind)         | Weight      |
|------------|------------------------|-------------|
| Hero H1    | `text-5xl`–`text-8xl`  | `font-black`|
| Section H2 | `text-3xl`–`text-5xl`  | `font-bold` |
| Tagline    | `text-lg`–`text-2xl`   | `font-bold` |
| Body       | `text-base`–`text-lg`  | `font-normal`|
| Button     | `text-base`             | `font-bold` |

---

## Button Sizing

- **Default:** `px-8 py-3 text-base font-bold`
- **Small:** `px-4 py-2 text-sm`
- **Large:** `px-12 py-4 text-lg`
- **Icon:** `h-10 w-10`

**Example:**
```tsx
<Button className="px-8 py-3 text-base font-bold">Primary</Button>
```

---

## Responsive Rules

- Use Tailwind's responsive classes: `mt-4 md:mt-8 lg:mt-12`
- For layout primitives, accept responsive props or use Tailwind classes
- Ensure all sections/components look good on mobile, tablet, and desktop

---

## Layout Primitives (Recommended)

- **Stack:** Vertical spacing
- **Inline:** Horizontal spacing
- **Section:** Consistent section padding
- **Container:** Max width and horizontal padding

**Example Stack:**
```tsx
<div className="flex flex-col gap-6">{children}</div>
```

---

## Best Practices

- Always use the spacing scale for margins, paddings, and gaps
- Use section/container conventions for all major blocks
- Maintain font size/weight hierarchy for headings, subheadings, and body
- Use responsive classes for all spacing and font sizes
- Review new pages/components for spacing/layout consistency

---

## References
- See `.cursorrules` and `DESIGN_CONSISTENCY_IMPROVEMENTS.md` for more details
- Update this doc as the design system evolves 