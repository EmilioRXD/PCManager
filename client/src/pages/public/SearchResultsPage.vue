<template>
  <div class="search-page">
    <div class="sp-header">
      <div class="sp-search-bar">
        <AppIcon name="search" size="18px" class="sp-icon" />
        <input
          class="sp-input"
          v-model="query"
          placeholder="Buscar equipos..."
          autocomplete="off"
          @keydown.enter="doSearch"
        />
        <button v-if="query" class="sp-clear" @click="query = ''; doSearch()">✕</button>
      </div>
    </div>

    <div class="sp-body" v-if="query">
      <p class="sp-count">{{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} para "<strong>{{ query }}</strong>"</p>

      <div v-if="results.length === 0" class="sp-empty">
        <AppIcon name="search_off" size="56px" />
        <h3>Sin resultados</h3>
        <p>No encontramos equipos con ese término. Probá con otra búsqueda.</p>
      </div>

      <div v-else class="sp-results">
        <div
          v-for="equipo in results"
          :key="equipo.id"
          class="sp-item"
          @click="$router.push({ name: 'product-detail', params: { id: equipo.id } })"
        >
          <div class="sp-title">{{ equipo.marca }} {{ equipo.modelo }}</div>
          <div class="sp-specs">
            {{ equipo.procesador }} · {{ equipo.ram }} · {{ equipo.almacenamiento }}
            <template v-if="equipo.pantalla"> · {{ equipo.pantalla }}</template>
            <template v-if="equipo.condicion"> · {{ equipo.condicion === 'refurbished' ? 'Refurbished' : 'Nuevo' }}</template>
          </div>
          <div class="sp-price">${{ formatPrice(equipo.precio) }}</div>
          <div class="sp-link">Ver ficha técnica →</div>
        </div>
      </div>
    </div>

    <div class="sp-body sp-empty" v-else>
      <AppIcon name="search" size="56px" />
      <h3>Buscá equipos</h3>
      <p>Escribí en el campo de arriba para encontrar laptops, desktops y workstations.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEquiposStore } from '../../stores/equipos'

const route = useRoute()
const router = useRouter()
const store = useEquiposStore()

const query = ref('')

const results = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return store.equipos.filter((e) =>
    `${e.marca} ${e.modelo} ${e.procesador || ''} ${e.descripcion || ''}`.toLowerCase().includes(q)
  )
})

function doSearch() {
  router.replace({ name: 'search', query: { q: query.value } })
}

function formatPrice(val) {
  return Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })
}

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q
  }
})
</script>

<style scoped>
.search-page {
  max-width: 720px; margin: 0 auto; padding: 24px 20px 64px;
}

.sp-header { margin-bottom: 24px; }
.sp-search-bar {
  display: flex; align-items: center; gap: 0;
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  background: var(--surface); overflow: hidden;
  transition: border-color 0.15s;
}
.sp-search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.sp-icon {
  padding: 0 0 0 16px; color: var(--muted); flex-shrink: 0;
}
.sp-input {
  flex: 1; border: none; outline: none;
  padding: 14px 12px; font-size: 16px;
  font-family: var(--font-body); color: var(--fg);
  background: transparent;
}
.sp-input::placeholder { color: var(--muted-light); }
.sp-clear {
  width: 40px; height: 40px; border: none;
  background: transparent; color: var(--muted);
  cursor: pointer; font-size: 16px;
  display: grid; place-items: center; flex-shrink: 0;
}
.sp-clear:hover { color: var(--fg); }

.sp-count {
  font-size: 14px; color: var(--muted); margin-bottom: 20px;
}

.sp-results { display: flex; flex-direction: column; gap: 0; }
.sp-item {
  padding: 18px 20px; cursor: pointer; border-radius: var(--radius-md);
  transition: background 0.12s;
}
.sp-item:hover { background: var(--accent-glow); }
.sp-title {
  font-size: 17px; font-weight: 700; color: var(--accent);
  margin-bottom: 4px;
}
.sp-specs {
  font-size: 14px; color: var(--muted); line-height: 1.5;
}
.sp-price {
  font-family: var(--font-mono); font-size: 15px; font-weight: 700;
  color: var(--fg); margin-top: 4px;
}
.sp-link {
  font-size: 13px; font-weight: 600; color: var(--accent);
  margin-top: 6px;
}

.sp-empty {
  text-align: center; padding: 60px 20px;
  color: var(--muted);
}
.sp-empty h3 { font-size: 18px; color: var(--fg); margin: 12px 0 4px; }
.sp-empty p { font-size: 14px; }

@media (max-width: 640px) {
  .search-page { padding: 16px 12px 48px; }
  .sp-item { padding: 14px 12px; }
}
</style>
