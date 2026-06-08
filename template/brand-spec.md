# Brand Spec — Mobil Tech

Extracted from user reference images (product post + logo). Clean-tech / premium tech e-commerce. Light mode only.

## Color Tokens

### Light Mode (matches reference post)
```css
--bg:      oklch(100% 0 0);
--surface: oklch(100% 0 0);
--fg:      oklch(18% 0.02 250);
--muted:   oklch(55% 0.015 250);
--border:  oklch(90% 0.006 240);
--accent:  oklch(55% 0.18 250);
```

## Typography

- **Display / Headings**: `Inter`, `SF Pro Display`, `Segoe UI`, system-ui — bold, tight tracking (-0.02em), geometric, clean.
- **Body / UI**: `Inter`, `Roboto`, `SF Pro Text`, system-ui — regular, legible at 14–16px.
- **Data / Specs / Mono**: `JetBrains Mono`, `IBM Plex Mono`, ui-monospace — for technical specs, prices, chipsets.
- **Tabular numerics**: `font-variant-numeric: tabular-nums` everywhere on prices, stock counts, specs.

## Layout Posture

- **Radii**: 12px for cards, 8px for buttons/tags, 999px for pills.
- **Border weight**: 1px hairlines. Never 2px+ chunky borders.
- **Shadows**: Ultra-subtle `0 1px 3px rgba(0,0,0,0.06)`. Glow via `box-shadow` with accent tint at 0.08 opacity on hover.
- **Accent budget**: One dominant accent (electric blue). Secondary status colors (success green, danger red) only for stock indicators.
- **Cards**: White/surface with 1px border and 12px radius. No heavy shadow cards.
- **Badges / Tags**: Pill-shaped, 1px border or subtle tinted background, mono font for specs.
- **Spacing**: 24px grid gaps, 16px internal padding, 32px section padding.
- **Density**: Medium-high for catalog (information per card), airy for admin table rows.

## Visual System Summary

Light mode impecable como el post de referencia: fondo blanco puro, acento azul eléctrico (#0052FF), tarjetas limpias con bordes sutiles, badges redondeados para specs, tipografía sans-serif moderna con pesos bold para precios y modelos.
