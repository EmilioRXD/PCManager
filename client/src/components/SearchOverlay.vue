<template>
  <Teleport to="body">
    <div class="search-overlay" :class="{ open }" @click.self="close">
      <div class="search-panel">
        <div class="search-bar">
          <AppIcon name="search" size="1.25rem" class="search-bar-icon" />
          <input
            ref="searchInput"
            class="search-input"
            v-model="query"
            placeholder="Buscar equipos..."
            autocomplete="off"
            @keydown.enter="goToSearchPage"
          />
          <button class="search-close" @click="close" aria-label="Cerrar">✕</button>
        </div>
        <div class="search-results" v-if="query.trim().length >= 2">
          <div v-if="searching" class="search-searching">Buscando...</div>
          <div v-else-if="results.length === 0" class="search-empty">
            <AppIcon name="search_off" size="2.5rem" />
            <p>Sin resultados para "<strong>{{ query }}</strong>"</p>
          </div>
          <div
            v-for="equipo in results"
            :key="equipo.id"
            class="search-result-item"
            @click="goToProduct(equipo.id)"
          >
            <div class="sr-title">{{ equipo.marca }} {{ equipo.modelo }}</div>
            <div class="sr-specs">
              {{ equipo.procesador }} · {{ equipo.ram }} · {{ equipo.almacenamiento }}
              <template v-if="equipo.pantalla"> · {{ equipo.pantalla }}</template>
              <template v-if="equipo.condicion"> · {{ equipo.condicion === 'refurbished' ? 'Refurbished' : 'Nuevo' }}</template>
            </div>
            <div class="sr-link">Ver ficha técnica →</div>
          </div>
        </div>
        <div class="search-hint" v-else-if="query.trim().length === 0">
          <AppIcon name="search" size="3rem" />
          <p>Escribe para buscar equipos</p>
        </div>
        <div class="search-hint" v-else>
          <AppIcon name="search" size="3rem" />
          <p>Escribe al menos 2 caracteres</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getEquipos } from '../api/equipos'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const router = useRouter()
const searchInput = ref(null)
const query = ref('')
const results = ref([])
const searching = ref(false)

let debounceTimer = null
let abortController = null

async function doSearch() {
  const q = query.value.trim()
  if (q.length < 2) {
    results.value = []
    return
  }

  if (abortController) abortController.abort()
  abortController = new AbortController()

  searching.value = true
  try {
    const { data } = await getEquipos({ search: q, limit: 8, signal: abortController.signal })
    results.value = data.data || []
  } catch (err) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      results.value = []
    }
  } finally {
    searching.value = false
  }
}

watch(query, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(doSearch, 300)
})

function goToSearchPage() {
  if (query.value.trim()) {
    close()
    router.push({ name: 'search', query: { q: query.value } })
  }
}

function goToProduct(id) {
  close()
  router.push({ name: 'product-detail', params: { id } })
}

function close() {
  emit('close')
}

watch(() => props.open, (val) => {
  if (val) {
    query.value = ''
    results.value = []
    nextTick(() => searchInput.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.search-overlay {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-start; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.2s;
}
.search-overlay.open { opacity: 1; pointer-events: auto; }

.search-panel {
  width: 100%; max-width: 42.5rem;
  margin-top: 12vh; padding: 0 1.25rem;
}

.search-bar {
  display: flex; align-items: center; gap: 0;
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden; box-shadow: 0 0.5rem 2.5rem rgba(0,0,0,0.2);
}
.search-bar-icon {
  padding: 0 0 0 1.25rem; color: var(--muted); flex-shrink: 0;
}
.search-input {
  flex: 1; border: none; outline: none;
  padding: 1rem 0.75rem; font-size: 1rem;
  font-family: var(--font-body); color: var(--fg);
  background: transparent;
}
.search-input::placeholder { color: var(--muted-light); }
.search-close {
  width: 2.75rem; height: 2.75rem; border: none;
  background: transparent; color: var(--muted);
  cursor: pointer; font-size: 1.25rem;
  display: grid; place-items: center; flex-shrink: 0;
}
.search-close:hover { color: var(--fg); }

.search-results {
  margin-top: 0.75rem;
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 0.5rem 2.5rem rgba(0,0,0,0.15);
  max-height: 60vh; overflow-y: auto;
}
.search-result-item {
  padding: 1rem 1.25rem; cursor: pointer;
  transition: background 0.12s; border-bottom: 0.0625rem solid var(--border-light);
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover { background: var(--accent-glow); }
.sr-title {
  font-size: 1rem; font-weight: 700; color: var(--accent);
  margin-bottom: 4px;
}
.sr-specs {
  font-size: 0.75rem; color: var(--muted); line-height: 1.5;
}
.sr-link {
  font-size: 0.75rem; font-weight: 600; color: var(--accent);
  margin-top: 0.5rem; opacity: 0.8;
}
.search-result-item:hover .sr-link { opacity: 1; }

.search-searching {
  text-align: center; padding: 1.25rem;
  color: var(--muted); font-size: 1rem;
}

.search-empty {
  text-align: center; padding: 2.5rem 1.25rem;
  color: var(--muted); font-size: 1rem;
}
.search-empty p { margin-top: 0.5rem; }

.search-hint {
  text-align: center; padding: 2.5rem 1.25rem;
  color: rgba(255,255,255,0.4); font-size: 1rem;
  margin-top: 0.75rem;
}
.search-hint p { margin-top: 0.75rem; }

@media (max-width: 40rem) {
  .search-panel { margin-top: 0; padding: 0; }
  .search-overlay { align-items: stretch; }
  .search-bar { border-radius: 0; }
  .search-results { border-radius: 0; max-height: calc(100vh - 3.75rem); }
}
</style>
