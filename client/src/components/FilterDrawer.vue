<template>
  <Teleport to="body">
    <div class="drawer-overlay" :class="{ open }" @click="close" />
    <aside class="filter-drawer" :class="{ open }">
      <div class="drawer-header">
        <h3>Filtros</h3>
        <button class="btn-ghost" style="padding:6px;" @click="close">
          <AppIcon name="close" size="20px" />
        </button>
      </div>
      <div class="drawer-body">
        <div class="filter-block">
          <div class="filter-block-title">Marca</div>
          <label v-for="brand in brands" :key="brand" class="filter-option">
            <input type="checkbox" :value="brand" :checked="activeBrands.includes(brand)" @change="toggleBrand(brand)" />
            {{ brand }}
          </label>
        </div>
        <div class="filter-block">
          <div class="filter-block-title">Rango de precio</div>
          <div class="price-range-wrap">
            <input class="input" type="number" :value="minPrice" @input="$emit('update:minPrice', $event.target.value)" placeholder="0" />
            <span>—</span>
            <input class="input" type="number" :value="maxPrice" @input="$emit('update:maxPrice', $event.target.value)" placeholder="3000" />
          </div>
        </div>
        <div class="filter-block">
          <div class="filter-block-title">Condición</div>
          <label v-for="opt in conditionOptions" :key="opt.value" class="filter-option">
            <input type="checkbox" :value="opt.value" :checked="activeConditions.includes(opt.value)" @change="toggleCondition(opt.value)" />
            {{ opt.label }}
          </label>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-secondary" @click="resetAll">Limpiar todo</button>
        <button class="btn btn-primary" @click="apply">Aplicar filtros</button>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  brands: { type: Array, default: () => [] },
  activeBrands: { type: Array, default: () => [] },
  activeConditions: { type: Array, default: () => [] },
  minPrice: { type: [String, Number], default: 0 },
  maxPrice: { type: [String, Number], default: 10000 },
})

const emit = defineEmits(['close', 'toggleBrand', 'toggleCondition', 'resetAll', 'apply', 'update:minPrice', 'update:maxPrice'])

const conditionOptions = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'refurbished', label: 'Refurbished' },
]

function close() { emit('close') }
function apply() { emit('apply'); emit('close') }
function resetAll() { emit('resetAll'); emit('close') }
function toggleBrand(brand) { emit('toggleBrand', brand) }
function toggleCondition(cond) { emit('toggleCondition', cond) }
</script>

<style scoped>
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90;
  opacity: 0; pointer-events: none; transition: opacity 0.3s;
}
.drawer-overlay.open { opacity: 1; pointer-events: auto; }
.filter-drawer {
  position: fixed; top: 0; right: 0; width: 380px; max-width: 100vw; height: 100vh;
  background: var(--surface); z-index: 95; overflow-y: auto;
  transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
  box-shadow: var(--shadow-lg); display: flex; flex-direction: column;
}
.filter-drawer.open { transform: translateX(0); }
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  position: sticky; top: 0; background: var(--surface); z-index: 2;
}
.drawer-header h3 { font-size: 18px; font-weight: 700; margin: 0; }
.drawer-body { flex: 1; padding: 24px; }
.filter-block { margin-bottom: 32px; }
.filter-block-title {
  font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.09em;
  color: var(--muted); margin-bottom: 14px; font-weight: 700;
}
.filter-option {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: var(--radius-sm);
  font-size: 14px; cursor: pointer; transition: all 0.12s;
}
.filter-option:hover { background: var(--border-light); }
.filter-option input[type="checkbox"] {
  width: 18px; height: 18px; accent-color: var(--accent); flex-shrink: 0;
}
.price-range-wrap { display: flex; gap: 12px; align-items: center; }
.price-range-wrap input { flex: 1; font-family: var(--font-mono); }
.price-range-wrap span { color: var(--muted); font-size: 13px; }
.drawer-footer {
  padding: 20px 24px; border-top: 1px solid var(--border);
  display: flex; gap: 10px; position: sticky; bottom: 0; background: var(--surface);
}
.drawer-footer .btn { flex: 1; }
@media (max-width: 640px) { .filter-drawer { width: 100%; } }
</style>
