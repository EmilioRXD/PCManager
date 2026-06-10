<template>
  <Teleport to="body">
    <div class="drawer-overlay" :class="{ open }" @click="close" />
    <aside class="filter-drawer" :class="{ open }">
      <div class="drawer-header">
        <div class="dh-left">
          <AppIcon name="filter_list" size="1.25rem" class="dh-icon" />
          <h3>Filtros</h3>
        </div>
        <button class="btn-ghost dh-close" @click="close">
          <AppIcon name="close" size="1.25rem" />
        </button>
      </div>

      <div class="drawer-body">
        <div class="filter-block">
          <div class="filter-block-title">
            <AppIcon name="branding_watermark" size="1rem" />
            Marca
          </div>
          <div class="brand-options">
            <label v-for="brand in brands" :key="brand" :class="['brand-chip', { active: activeBrands.includes(brand) }]">
              <input type="checkbox" :value="brand" :checked="activeBrands.includes(brand)" @change="toggleBrand(brand)" />
              {{ brand }}
            </label>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-block-title">
            <AppIcon name="monetization_on" size="1rem" />
            Rango de precio
          </div>
          <div class="price-range-wrap">
            <div class="price-field">
              <span class="price-currency">$</span>
              <input class="input price-input" type="number" :value="minPrice" @input="$emit('update:minPrice', $event.target.value)" placeholder="0" min="0" />
            </div>
            <span class="price-sep">—</span>
            <div class="price-field">
              <span class="price-currency">$</span>
              <input class="input price-input" type="number" :value="maxPrice" @input="$emit('update:maxPrice', $event.target.value)" placeholder="3000" min="0" />
            </div>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-block-title">
            <AppIcon name="verified" size="1rem" />
            Condición
          </div>
          <div class="brand-options">
            <label v-for="opt in conditionOptions" :key="opt.value" :class="['brand-chip', { active: activeConditions.includes(opt.value) }]">
              <input type="checkbox" :value="opt.value" :checked="activeConditions.includes(opt.value)" @change="toggleCondition(opt.value)" />
              {{ opt.label }}
            </label>
          </div>
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
  position: fixed; top: 0; right: 0; width: 26.25rem; max-width: 100vw; height: 100vh;
  background: var(--surface); z-index: 95; overflow-y: auto;
  transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
  box-shadow: -0.5rem 0 32px rgba(0,0,0,0.08); display: flex; flex-direction: column;
}
.filter-drawer.open { transform: translateX(0); }

.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.75rem; border-bottom: 0.0625rem solid var(--border-light);
  position: sticky; top: 0; background: var(--surface); z-index: 2;
}
.dh-left { display: flex; align-items: center; gap: 0.75rem; }
.dh-icon { color: var(--accent); }
.drawer-header h3 { font-size: 1rem; font-weight: 700; margin: 0; color: var(--fg); }
.dh-close { padding: 0.5rem; color: var(--muted); }

.drawer-body { flex: 1; padding: 1.75rem; }

.drawer-footer {
  padding: 1.25rem 1.75rem; border-top: 0.0625rem solid var(--border);
  display: flex; gap: 0.75rem; position: sticky; bottom: 0; background: var(--surface);
}
.drawer-footer .btn { flex: 1; }

@media (max-width: 40rem) { .filter-drawer { width: 100%; } }
</style>
