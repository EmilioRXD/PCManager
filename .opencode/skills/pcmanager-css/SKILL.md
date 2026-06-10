---
name: pcmanager-css
description: Use when editing or creating Vue SFC styles, adding CSS classes, styling new components, or refactoring CSS in the PCManager project. Enforces a utility-first design system based on template.css global classes. Use ONLY when working with CSS/scoped styles in *.vue files under client/src/.
---

# PCManager CSS Design System v2

Este skill define las reglas estrictas de estilos para el proyecto PCManager.
**template.css** (`client/src/css/template.css`) es la fuente unica de verdad
para estilos globales. Todo componente Vue debe priorizar clases globales sobre
estilos scoped.

---

## Regla #1 — Usa clases globales, no dupliques

Antes de escribir cualquier regla en `<style scoped>`, verifica si
`template.css` ya provee una clase global equivalente. **NUNCA dupliques**
una clase que ya existe globalmente.

Si un patron se repite en 2+ componentes, **debe moverse a template.css**
como clase global y eliminarse de los scoped styles.

## Regla #2 — Nada de inline styles

**PROHIBIDO** usar `style="..."` en templates Vue. Siempre usa clases.
Si necesitas variaciones, crea clases modificadoras (ej: `price-pill-sm`,
`price-pill-lg`).

## Regla #3 — Naming convention

Sigue el patron BEM simplificado:
- `.bloque` — componente base (ej: `.product-card`, `.price-pill`)
- `.bloque--modificador` — variante (ej: `.brand-dot--lenovo`,
  `.stock-tag-out`)
- `.bloque-elemento` — hijo directo (ej: `.card-media`, `.card-body`)

Usa **kebab-case** para todas las clases. Usa prefijos descriptivos, no
abreviaturas oscuras.

## Regla #4 — Design tokens

Siempre usa variables CSS definidas en `:root` de template.css. NUNCA
hardcodees colores, sombras, o radios:

```css
/* CORRECTO */
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);
color: var(--accent);

/* INCORRECTO - PROHIBIDO */
background: #ffffff;
border: 1px solid #e2e8f0;
```

Los colores de marca (brand dots) son la unica excepcion — se definen
como modificadores globales en template.css.

## Regla #5 — Responsive breakpoints

Solo se permiten estos breakpoints. No inventes otros:

- `1024px` — tablets y pantallas medianas
- `640px` — moviles

```css
@media (max-width: 1024px) { ... }
@media (max-width: 640px) { ... }
```

## Regla #6 — Scoped es solo para layout local

Los `<style scoped>` solo deben contener reglas **especificas del layout**
de ese componente. Ejemplos validos de scoped styles:

- `display: grid; grid-template-columns: ...` (layout unico)
- `position: sticky; top: 88px;` (comportamiento local)
- Alturas o anchos maximos locales (`max-width: 400px`)
- Animaciones con `@keyframes` propias del componente
- Modificadores de posicion (`top`, `left`, `right`, `bottom`)
- Selectores de hover/estado sobre elementos globales cuando son
  contextuales (ej: `.product-card:hover .spec-tag { ... }`)

Ejemplos de lo que **NO** va en scoped:
- Colores, fondos, bordes, sombras (usa design tokens)
- Tipografia (font-size, font-weight, etc — usa clases globales)
- Transiciones y animaciones genericas (shimmer, pulse — ya en
  template.css)
- Espaciados simples (padding, margin, gap — usa clases utilitarias)

## Regla #7 — Clases utilitarias para espaciado y layout

template.css define estas clases de layout. Usalas en templates en vez
de scoped styles:

```html
<div class="flex items-center justify-between gap-4">
  <span class="text-muted text-sm">...</span>
  <span class="text-accent font-bold">...</span>
</div>
```

## Regla #8 — Catalogo de componentes globales

Estos patrones ya existen en template.css. Usalos directamente:

### Skeleton / Carga
```html
<div class="skeleton-card">
  <div class="sk-img" />
  <div class="sk-body">
    <div class="sk-line sk-short" />
    <div class="sk-line" />
    <div class="sk-line sk-long" />
  </div>
</div>
```

### Price Display
```html
<!-- Tarjeta de producto (tamano sm) -->
<div class="card-price-row">
  <div class="price-pill price-pill-sm">
    <span class="price-label">REF:</span>
    <span class="price-value price-value-sm">$1,299.00</span>
  </div>
</div>

<!-- Modal/detalle (tamano lg) -->
<div class="price-pill price-pill-lg">
  <span class="price-label">REF:</span>
  <span class="price-value price-value-md">$1,299.00</span>
</div>
```

### Product Cards
```html
<article class="product-card">
  <div class="card-media"><img ... /></div>
  <div class="card-body">
    <div class="card-brand"><span class="brand-dot brand-dot--dell"/>Dell</div>
    <div class="card-name">Latitude 5540</div>
    <div class="specs-row">
      <span class="spec-tag">i7-1365U</span>
      <span class="spec-tag">16GB RAM</span>
    </div>
    <div class="card-footer">
      <a class="btn-more">Ver ficha</a>
      <button class="btn-quick">Vista rapida</button>
    </div>
  </div>
</article>
```

### Badges y Estados
```html
<span class="badge badge-success">Nuevo</span>
<span class="badge badge-warning">Refurbished</span>
<span class="cond-badge">Nuevo</span>
<span class="stock-tag stock-tag-in">En stock</span>
<span class="stock-tag stock-tag-out">Agotado</span>
<span class="stock-badge stock-in"><span class="stock-dot"/>En stock</span>
<span class="stock-pill stock-pill-high"><span class="dot"/>12 uds</span>
```

### Secciones
```html
<h2 class="section-title">
  <span class="section-icon"><AppIcon name="memory" size="18px"/></span>
  Especificaciones
</h2>
<div class="section-divider"><span>Fin del catalogo</span></div>
<div class="empty-state">
  <AppIcon name="search_off" size="56px"/>
  <h3>Sin resultados</h3>
  <p>No encontramos equipos.</p>
</div>
```

### Grids
```html
<div class="product-grid"><!-- tarjetas --></div>
<div class="highlights-cards"><!-- garantias --></div>
<div class="stats-row"><!-- stat cards --></div>
```

### Accordion
```html
<div class="accordion">
  <div class="accordion-item">
    <div class="accordion-header">
      <span>Titulo</span>
      <AppIcon name="expand_more" class="accordion-chevron" :class="{rotated: open}"/>
    </div>
    <div class="accordion-body" v-show="open">Contenido</div>
  </div>
</div>
```

### Botones
```html
<button class="btn btn-primary">Accion</button>
<button class="btn btn-secondary">Cancelar</button>
<button class="btn btn-ghost">Volver</button>
<button class="btn btn-primary btn-lg">CTA grande</button>

<a class="btn-more">Ver mas →</a>
<button class="btn-quick">Vista rapida</button>

<a class="btn-whatsapp btn-whatsapp-sm">WhatsApp</a>
<a class="floating-wa"><span class="pulse-ring"/></a>
```

### Admin
```html
<div class="banner"><h2>Panel</h2><p>Descripcion</p></div>
<div class="table-wrap"><table class="table">...</table></div>
<button class="fab"><AppIcon name="add"/></button>
<button class="action-btn"><AppIcon name="edit"/></button>
<button class="action-btn delete"><AppIcon name="delete"/></button>
<button class="page-btn" :class="{active: current}">1</button>
```

### Formularios
```html
<input class="input" placeholder="..." />
<label class="form-label">Email</label>
<label class="form-label form-label-sm">Marca *</label>
<select class="sort-select">...</select>
```

### Chips / Pills
```html
<button class="cat-pill" :class="{active}">Laptops</button>
<label class="brand-chip" :class="{active}">Dell</label>
<span class="chip-tag">Filtro activo <AppIcon name="close"/></span>
<span class="badge-count">3</span>
```

### Filter / Drawer
```html
<div class="filter-bar">
  <button class="btn-filter-toggle">Filtros</button>
</div>
<div class="filter-block">
  <div class="filter-block-title">Marca</div>
  <div class="brand-options">...</div>
</div>
<div class="price-range-wrap">
  <div class="price-field">
    <span class="price-currency">$</span>
    <input class="price-input" />
  </div>
  <span class="price-sep">—</span>
</div>
```

### Dialog / Modal
```html
<div class="dialog-overlay">
  <div class="dialog-modal">
    <div class="dialog-bar">Titulo</div>
    <div class="dialog-body">...</div>
  </div>
</div>
```

---

## Checklist al crear o editar estilos

Antes de commitear, verifica:

1. No hay `style="..."` inline en templates HTML
2. No hay clases duplicadas entre componentes (si 2+ comparten una clase,
   va a template.css)
3. Los colores usan `var(--*)` (excepto brand dots)
4. Los breakpoints son solo 1024px y 640px
5. Las clases usan kebab-case y siguen BEM simplificado
6. Scoped styles solo contienen layout local del componente
7. No se definieron animaciones `@keyframes` duplicadas
8. El build de Vite compila sin errores: `npm run build` en client/
