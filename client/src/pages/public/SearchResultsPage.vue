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

      <div v-if="results.length === 0" class="sp-empty-state">
        <AppIcon name="search_off" size="56px" />
        <h3>Sin resultados</h3>
        <p>No encontramos equipos con ese término. Probá con otra búsqueda.</p>
      </div>

      <div v-else class="sp-grid">
        <ProductCard
          v-for="equipo in results"
          :key="equipo.id"
          :equipo="equipo"
          :compared="false"
        />
      </div>
    </div>

    <div class="sp-body sp-empty-state" v-else>
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
import ProductCard from '../../components/ProductCard.vue'

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

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q
  }
})
</script>

<style scoped>
.search-page {
  max-width: 1280px; margin: 0 auto; padding: 24px 24px 64px;
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

.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.sp-empty-state {
  text-align: center; padding: 60px 20px;
  color: var(--muted);
}
.sp-empty-state h3 { font-size: 18px; color: var(--fg); margin: 12px 0 4px; }
.sp-empty-state p { font-size: 14px; }

@media (max-width: 1024px) {
  .search-page { padding: 20px; }
  .sp-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
}
@media (max-width: 640px) {
  .search-page { padding: 16px 12px 48px; }
  .sp-grid { grid-template-columns: 1fr; }
}
</style>
