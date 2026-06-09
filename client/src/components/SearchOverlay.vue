<template>
  <Teleport to="body">
    <div class="search-overlay" :class="{ open }" @click.self="close">
      <div class="search-panel">
        <div class="search-bar">
          <AppIcon name="search" size="20px" class="search-bar-icon" />
          <input
            ref="searchInput"
            class="search-input"
            v-model="query"
            placeholder="Buscar equipos..."
            autocomplete="off"
            @input="onInput"
            @keydown.enter="goToSearchPage"
          />
          <button class="search-close" @click="close" aria-label="Cerrar">✕</button>
        </div>
        <div class="search-results" v-if="query.trim().length >= 2">
          <div v-if="results.length === 0" class="search-empty">
            <AppIcon name="search_off" size="40px" />
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
          <AppIcon name="search" size="48px" />
          <p>Escribe para buscar equipos</p>
        </div>
        <div class="search-hint" v-else>
          <AppIcon name="search" size="48px" />
          <p>Escribe al menos 2 caracteres</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useEquiposStore } from '../stores/equipos'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const router = useRouter()
const store = useEquiposStore()
const searchInput = ref(null)
const query = ref('')
const results = computed(() => {
  if (query.value.trim().length < 2) return []
  const q = query.value.toLowerCase()
  return store.equipos.filter((e) =>
    `${e.marca} ${e.modelo} ${e.procesador || ''} ${e.descripcion || ''}`.toLowerCase().includes(q)
  )
})

function onInput() {}

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
  width: 100%; max-width: 680px;
  margin-top: 12vh; padding: 0 20px;
}

.search-bar {
  display: flex; align-items: center; gap: 0;
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.2);
}
.search-bar-icon {
  padding: 0 0 0 18px; color: var(--muted); flex-shrink: 0;
}
.search-input {
  flex: 1; border: none; outline: none;
  padding: 16px 12px; font-size: 17px;
  font-family: var(--font-body); color: var(--fg);
  background: transparent;
}
.search-input::placeholder { color: var(--muted-light); }
.search-close {
  width: 44px; height: 44px; border: none;
  background: transparent; color: var(--muted);
  cursor: pointer; font-size: 20px;
  display: grid; place-items: center; flex-shrink: 0;
}
.search-close:hover { color: var(--fg); }

.search-results {
  margin-top: 12px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  max-height: 60vh; overflow-y: auto;
}
.search-result-item {
  padding: 16px 20px; cursor: pointer;
  transition: background 0.12s; border-bottom: 1px solid var(--border-light);
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover { background: var(--accent-glow); }
.sr-title {
  font-size: 16px; font-weight: 700; color: var(--accent);
  margin-bottom: 4px;
}
.sr-specs {
  font-size: 13px; color: var(--muted); line-height: 1.5;
}
.sr-link {
  font-size: 13px; font-weight: 600; color: var(--accent);
  margin-top: 6px; opacity: 0.8;
}
.search-result-item:hover .sr-link { opacity: 1; }

.search-empty {
  text-align: center; padding: 40px 20px;
  color: var(--muted); font-size: 15px;
}
.search-empty p { margin-top: 8px; }

.search-hint {
  text-align: center; padding: 40px 20px;
  color: rgba(255,255,255,0.4); font-size: 15px;
  margin-top: 12px;
}
.search-hint p { margin-top: 12px; }

@media (max-width: 640px) {
  .search-panel { margin-top: 0; padding: 0; }
  .search-overlay { align-items: stretch; }
  .search-bar { border-radius: 0; }
  .search-results { border-radius: 0; max-height: calc(100vh - 60px); }
}
</style>
