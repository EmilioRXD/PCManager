<template>
  <article class="product-card" :data-cat="equipo.categoria_id" @click="$router.push({ name: 'product-detail', params: { id: equipo.id } })">
    <div class="card-media">
      <div class="compare-check" :class="{ selected: isCompared }" @click.stop="toggleCompare">
        <input type="checkbox" :id="'cmp' + equipo.id" :checked="isCompared" @change="toggleCompare" />
        <label :for="'cmp' + equipo.id" :title="isCompared ? 'Quitar de comparar' : 'Comparar'"></label>
      </div>
      <img :src="imgSrc" :alt="equipo.marca + ' ' + equipo.modelo" loading="lazy" />
    </div>

    <div class="card-body">
      <div class="card-brand">
        <span :class="['brand-dot', brandClass]" />
        {{ equipo.marca }}
        <span v-if="equipo.condicion" :class="['cond-badge', equipo.condicion === 'refurbished' ? 'cond-refurb' : 'cond-new']">
          {{ equipo.condicion === 'refurbished' ? 'Refurbished' : 'Nuevo' }}
        </span>
      </div>

      <div class="card-name">{{ equipo.modelo }}</div>

      <div class="card-price">
        <div class="price-pill">
          <span class="price-label">REF:</span>
          <span class="price-value">${{ formatPrice(equipo.precio) }}</span>
        </div>
        <span v-if="equipo.stock > 0" class="stock-tag">En stock</span>
        <span v-else class="stock-tag out">Agotado</span>
      </div>

      <div class="specs">
        <span class="spec-tag">{{ equipo.procesador }}</span>
        <span class="spec-tag">{{ equipo.ram }}</span>
        <span class="spec-tag">{{ equipo.almacenamiento }}</span>
      </div>

      <div class="card-footer">
        <a class="btn-more" @click.stop="$router.push({ name: 'product-detail', params: { id: equipo.id } })">
          Ver ficha técnica
          <AppIcon name="arrow_forward" size="11px" />
        </a>
        <button class="btn-quick" @click.stop="$emit('quickView', equipo)">Vista rápida</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  equipo: { type: Object, required: true },
  compared: { type: Boolean, default: false },
})

const emit = defineEmits(['quickView', 'toggleCompare'])

const isCompared = computed(() => props.compared)

const imgSrc = computed(() =>
  props.equipo.imagen_url || 'https://placehold.co/600x400/e8effe/0052ff?text=PCManager'
)

const brandClass = computed(() => {
  const map = { lenovo: 'lenovo', dell: 'dell', asus: 'asus', apple: 'apple', hp: 'hp', msi: 'msi', alienware: 'alien', macbook: 'apple' }
  return `brand-dot--${map[props.equipo.marca.toLowerCase()] || 'lenovo'}`
})

function formatPrice(val) {
  return Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })
}

function toggleCompare() {
  emit('toggleCompare', props.equipo)
}
</script>

<style scoped>
.product-card {
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.025);
  transition: box-shadow 0.3s cubic-bezier(0.23,1,0.32,1),
              transform 0.3s cubic-bezier(0.23,1,0.32,1);
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 0 1px rgba(0,82,255,0.10), 0 16px 48px rgba(0,82,255,0.06);
}

.card-media {
  aspect-ratio: 4/3;
  background: linear-gradient(180deg, #fefeff 0%, #f5f7fc 100%);
  position: relative; overflow: hidden;
  display: grid; place-items: center; cursor: pointer;
}
.card-media::after {
  content: '';
  position: absolute; bottom: -10%; left: 50%; transform: translateX(-50%);
  width: 80%; height: 50%;
  background: radial-gradient(ellipse at center, rgba(0,82,255,0.025), transparent 70%);
  pointer-events: none;
}
.card-media img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
  position: relative; z-index: 1;
}
.product-card:hover .card-media img { transform: scale(1.03); }

.compare-check {
  position: absolute; top: 12px; right: 12px; z-index: 2;
  opacity: 0; transform: scale(0.85);
  transition: all 0.22s cubic-bezier(0.23,1,0.32,1);
}
.product-card:hover .compare-check,
.compare-check.selected { opacity: 1; transform: scale(1); }
.compare-check input[type="checkbox"] { display: none; }
.compare-check label {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  cursor: pointer; transition: all 0.18s;
  font-size: 0;
}
.compare-check label::before {
  content: '+'; font-size: 18px; font-weight: 400;
  color: var(--muted-light); line-height: 1;
}
.compare-check label:hover { border-color: var(--accent); background: rgba(0,82,255,0.04); }
.compare-check input:checked + label {
  background: var(--accent); border-color: var(--accent);
}
.compare-check input:checked + label::before {
  content: '✓'; color: #fff; font-size: 14px; font-weight: 700;
}

.card-body {
  padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px;
}

.card-brand {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; color: var(--muted);
}
.brand-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.brand-dot--lenovo  { background: #e60000; }
.brand-dot--asus    { background: #00b4d8; }
.brand-dot--apple   { background: #555555; }
.brand-dot--dell    { background: #007db8; }
.brand-dot--hp      { background: #0096d6; }
.brand-dot--msi     { background: #d32f2f; }
.brand-dot--alien   { background: #37474f; }

.cond-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; padding: 2px 8px; border-radius: 99px;
  margin-left: auto; line-height: 1.3;
  background: transparent; color: var(--accent-dark); border: 2px solid var(--accent-dark);
}

.card-name {
  font-size: 16px; font-weight: 700; letter-spacing: -0.02em;
  line-height: 1.25; color: var(--fg);
}

.card-price {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-top: 2px;
}
.price-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, var(--accent), #3b82f6);
  color: #fff; padding: 5px 14px; border-radius: 999px;
  font-family: var(--font-mono);
}
.price-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  opacity: 0.85; line-height: 1;
}
.price-value {
  font-size: 18px; font-weight: 700; line-height: 1;
}
.stock-tag {
  font-size: 10.5px; font-weight: 700; color: var(--success);
  background: rgba(34,197,94,0.08); padding: 3px 10px; border-radius: 99px;
}
.stock-tag.out {
  color: var(--danger); background: rgba(239,68,68,0.08);
}

.specs { display: flex; flex-wrap: wrap; gap: 5px; }
.spec-tag {
  padding: 4px 9px; border-radius: 5px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  color: var(--fg-secondary); letter-spacing: -0.01em;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.product-card:hover .spec-tag {
  border-color: rgba(0,82,255,0.14);
  color: var(--accent);
  background: rgba(0,82,255,0.025);
}

.card-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 6px; padding-top: 10px;
  border-top: 1px solid var(--border-light);
}
.btn-more {
  font-size: 13px; font-weight: 600; color: var(--accent);
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 3px;
  transition: gap 0.2s;
  cursor: pointer;
}
.btn-more:hover { gap: 7px; }
.btn-quick {
  font-size: 12px; font-weight: 500; color: var(--muted);
  background: none; border: none; cursor: pointer;
  padding: 4px 8px; border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.btn-quick:hover {
  color: var(--fg); background: var(--border-light);
}
</style>
