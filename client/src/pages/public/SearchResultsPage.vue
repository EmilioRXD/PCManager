<template>
  <div class="search-page">
    <div class="sp-header">
      <div class="sp-search-bar">
        <AppIcon name="search" size="1.25rem" class="sp-icon" />
        <input
          class="sp-input"
          v-model="query"
          placeholder="Buscar equipos..."
          autocomplete="off"
          @keydown.enter="newSearch"
        />
        <button v-if="query" class="sp-clear" @click="query = ''; newSearch()">✕</button>
      </div>
    </div>

    <div class="sp-body" v-if="query && !initialLoad">
      <p class="sp-count">{{ searchTotal }} resultado{{ searchTotal !== 1 ? 's' : '' }} para "<strong>{{ query }}</strong>"</p>

      <div v-if="searchTotal === 0" class="empty-state">
        <AppIcon name="search_off" size="3.5rem" />
        <h3>Sin resultados</h3>
        <p>No encontramos equipos. Probá con otra búsqueda.</p>
      </div>

      <template v-else>
        <div class="product-grid">
          <ProductCard
            v-for="equipo in searchResults"
            :key="'s-' + equipo.id"
            :equipo="equipo"
            :compared="false"
          />
        </div>

        <div v-if="!searchExhausted" ref="searchSentinel" class="sentinel" />

        <div v-if="searchExhausted" class="section-divider">
          <span>No hay más resultados para "{{ query }}"</span>
        </div>

        <div v-if="searchExhausted" class="product-grid">
          <ProductCard
            v-for="equipo in allResults"
            :key="'a-' + equipo.id"
            :equipo="equipo"
            :compared="false"
          />
        </div>

        <div v-if="searchExhausted && !allExhausted" ref="allSentinel" class="sentinel" />

        <div v-if="fetchingMore" class="product-grid">
          <div v-for="n in 6" :key="'sk-' + n" class="skeleton-card">
            <div class="sk-img" />
            <div class="sk-body">
              <div class="sk-line sk-short" />
              <div class="sk-line" />
              <div class="sk-line sk-long" />
              <div class="sk-line sk-short" />
            </div>
          </div>
        </div>

        <div v-if="allExhausted" class="section-divider">
          <span>Has visto todos los equipos disponibles</span>
        </div>
      </template>
    </div>

    <div v-else-if="initialLoad && query" class="product-grid">
      <div v-for="n in 12" :key="'isk-' + n" class="skeleton-card">
        <div class="sk-img" />
        <div class="sk-body">
          <div class="sk-line sk-short" />
          <div class="sk-line" />
          <div class="sk-line sk-long" />
          <div class="sk-line sk-short" />
        </div>
      </div>
    </div>

    <div class="sp-body empty-state" v-else>
      <AppIcon name="search" size="3.5rem" />
      <h3>Buscá equipos</h3>
      <p>Escribí para encontrar laptops, desktops y workstations.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEquipos } from '../../api/equipos'
import ProductCard from '../../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const query = ref('')
const searchResults = ref([])
const allResults = ref([])
const searchTotal = ref(0)
const searchPage = ref(1)
const allPage = ref(0)
const searching = ref(false)
const fetchingMore = ref(false)
const searchExhausted = ref(false)
const allExhausted = ref(false)
const initialLoad = ref(false)
const searchSentinel = ref(null)
const allSentinel = ref(null)
let searchObserver = null
let allObserver = null
let searchAbort = null
let allAbort = null

async function newSearch() {
  const q = query.value.trim()
  if (!q) return
  router.replace({ name: 'search', query: { q } })

  if (searchAbort) searchAbort.abort()
  searchAbort = new AbortController()
  if (allAbort) allAbort.abort()

  searching.value = true
  initialLoad.value = true
  searchExhausted.value = false
  allExhausted.value = false
  allResults.value = []
  allPage.value = 0
  searchPage.value = 1

  try {
    const { data } = await getEquipos({ search: q, limit: 30, page: 1, signal: searchAbort.signal })
    searchResults.value = data.data || []
    searchTotal.value = data.total
    if (data.data.length < 30 || data.total <= 30) {
      searchExhausted.value = true
      if (searchResults.value.length > 0) startAllFeed()
    }
  } catch (err) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      searchResults.value = []
      searchTotal.value = 0
    }
  } finally {
    searching.value = false
    initialLoad.value = false
  }
}

async function loadMoreSearch() {
  if (searching.value || fetchingMore.value || searchExhausted.value) return
  fetchingMore.value = true
  searchPage.value++
  try {
    const { data } = await getEquipos({ search: query.value, limit: 30, page: searchPage.value, signal: searchAbort.signal })
    searchResults.value.push(...(data.data || []))
    if (searchResults.value.length >= searchTotal.value) {
      searchExhausted.value = true
      if (searchResults.value.length > 0) startAllFeed()
    }
  } catch (err) {
    if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
      searchExhausted.value = true
      if (searchResults.value.length > 0) startAllFeed()
    }
  } finally {
    fetchingMore.value = false
  }
}

async function startAllFeed() {
  allAbort = new AbortController()
  allPage.value = 1
  fetchingMore.value = true
  try {
    const { data } = await getEquipos({ random: true, limit: 30, page: 1, signal: allAbort.signal })
    allResults.value = data.data || []
    if (data.total <= 30) allExhausted.value = true
  } catch {
    allExhausted.value = true
  } finally {
    fetchingMore.value = false
    nextTick(observeAll)
  }
}

async function loadMoreAll() {
  if (searching.value || fetchingMore.value || allExhausted.value) return
  fetchingMore.value = true
  allPage.value++
  try {
    const { data } = await getEquipos({ random: true, limit: 30, page: allPage.value, signal: allAbort.signal })
    allResults.value.push(...(data.data || []))
    if (allResults.value.length >= data.total) allExhausted.value = true
  } catch {
    allExhausted.value = true
  } finally {
    fetchingMore.value = false
  }
}

function observeSearch() {
  if (searchObserver) searchObserver.disconnect()
  if (!searchSentinel.value) return
  searchObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMoreSearch()
  }, { rootMargin: '0rem 0rem 93.75rem 0rem' })
  searchObserver.observe(searchSentinel.value)
}

function observeAll() {
  if (allObserver) allObserver.disconnect()
  if (!allSentinel.value) return
  allObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMoreAll()
  }, { rootMargin: '0rem 0rem 93.75rem 0rem' })
  allObserver.observe(allSentinel.value)
}

watch(searchExhausted, (val) => {
  if (!val) nextTick(observeSearch)
})

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q
    newSearch()
  }
})

onUnmounted(() => {
  if (searchObserver) searchObserver.disconnect()
  if (allObserver) allObserver.disconnect()
  if (searchAbort) searchAbort.abort()
  if (allAbort) allAbort.abort()
})
</script>

<style scoped>
.search-page {
  max-width: 80rem; margin: 0 auto; padding: 1.5rem 1.5rem 4rem;
}

.sp-header { margin-bottom: 1.5rem; }
.sp-search-bar {
  display: flex; align-items: center; gap: 0;
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  background: var(--surface); overflow: hidden;
  transition: border-color 0.15s;
}
.sp-search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.sp-icon { padding: 0 0 0 1rem; color: var(--muted); flex-shrink: 0; }
.sp-input {
  flex: 1; border: none; outline: none;
  padding: 1rem 0.75rem; font-size: 1rem;
  font-family: var(--font-body); color: var(--fg); background: transparent;
}
.sp-input::placeholder { color: var(--muted-light); }
.sp-clear {
  width: 2.5rem; height: 2.5rem; border: none;
  background: transparent; color: var(--muted);
  cursor: pointer; font-size: 1rem;
  display: grid; place-items: center; flex-shrink: 0;
}
.sp-clear:hover { color: var(--fg); }

.sp-body { padding: 0; }
.sp-count { font-size: 1rem; color: var(--muted); margin-bottom: 1.25rem; }

@media (max-width: 64rem) {
  .search-page { padding: 1.25rem; }
}
@media (max-width: 40rem) {
  .search-page { padding: 1rem 0.75rem 3rem; }
}
</style>
