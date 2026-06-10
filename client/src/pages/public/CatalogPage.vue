<template>
  <div class="page">
    <!-- Hero -->
    <section class="catalog-hero">
      <div class="dots"></div>
      <div class="hero-content">
        <div class="hero-kicker"><span class="dot pulse-dot" /> Nuevos ingresos esta semana</div>
        <h1 class="hero-title">Equipos <em>premium</em> para profesionales</h1>
        <p class="hero-desc">Laptops, workstations y desktops — inspeccionados, garantizados, y listos para trabajar. Tecnología de alto rendimiento sin pagar de más.</p>
        <div class="hero-actions">
          <a href="#products" class="btn btn-primary btn-lg" @click.prevent="scrollToProducts">Ver catálogo</a>
          <router-link :to="{ name: 'product-detail', params: { id: featuredId } }" class="btn btn-secondary btn-lg">Producto destacado</router-link>
        </div>
      </div>
      <div class="hero-visual">
        <img class="laptop-frame" src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop" alt="Featured laptop" />
        <div class="spec-float f1">
          <span class="sf-icon"><AppIcon name="memory" size="1rem" /></span>
          Hasta i9
        </div>
        <div class="spec-float f2">
          <span class="sf-icon"><AppIcon name="sd_card" size="1rem" /></span>
          Hasta 64GB RAM
        </div>
      </div>
    </section>

    <!-- Category pills -->
    <div class="cat-strip" id="products" ref="productsRef">
      <button
        :class="['cat-pill', { active: activeCat === null }]"
        @click="setCategory(null)"
      >
        <AppIcon name="grid_view" size="1rem" />
        Todos
      </button>
      <button
        v-for="cat in categorias"
        :key="cat.id"
        :class="['cat-pill', { active: activeCat === cat.id }]"
        @click="setCategory(cat.id)"
      >
        <AppIcon :name="catIcons[cat.nombre] || 'computer'" size="1rem" />
        {{ cat.nombre }}
      </button>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="flex items-center gap-3 filter-left">
        <span class="results-info">Mostrando <strong>{{ filteredCount }}</strong> equipos</span>
        <div class="active-chips">
          <span v-if="activeCat" class="chip-tag" @click="setCategory(null)">
            {{ activeCatName }}
            <AppIcon name="close" size="0.75rem" />
          </span>
          <span v-if="searchQuery" class="chip-tag" @click="searchQuery = ''">
            "{{ searchQuery }}"
            <AppIcon name="close" size="0.75rem" />
          </span>
          <span v-for="b in activeBrands" :key="b" class="chip-tag" @click="removeBrand(b)">
            {{ b }}
            <AppIcon name="close" size="0.75rem" />
          </span>
          <span v-for="c in activeConditions" :key="c" class="chip-tag" @click="removeCondition(c)">
            {{ c === 'nuevo' ? 'Nuevo' : 'Refurbished' }}
            <AppIcon name="close" size="0.75rem" />
          </span>
          <span v-if="minPrice > 0 || maxPrice < 10000" class="chip-tag" @click="resetPriceRange">
            ${{ minPrice }} — ${{ maxPrice }}
            <AppIcon name="close" size="0.75rem" />
          </span>
        </div>
      </div>
      <div class="filter-actions">
        <select class="sort-select" v-model="sortMode" @change="sortProducts">
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
        <button class="btn-filter-toggle" @click="openDrawer">
          <AppIcon name="filter_list" size="1rem" />
          Filtros
          <span v-if="filterCount" class="badge-count">{{ filterCount }}</span>
        </button>
      </div>
    </div>

    <!-- Product grid -->
    <div class="products-area">
      <div class="product-grid">
        <ProductCard
          v-for="equipo in sortedEquipos"
          :key="equipo.id"
          :equipo="equipo"
          :compared="compareList.some((c) => c.id === equipo.id)"
          @quick-view="openQuickView"
          @toggle-compare="toggleCompare"
        />

        <!-- Skeleton cards while loading first page -->
        <template v-if="store.loading && store.page === 1">
          <div v-for="n in 12" :key="'sk-' + n" class="skeleton-card">
            <div class="sk-img" />
            <div class="sk-body">
              <div class="sk-line sk-short" />
              <div class="sk-line" />
              <div class="sk-line sk-long" />
              <div class="sk-line sk-short" />
            </div>
          </div>
        </template>
      </div>

      <div v-if="sortedEquipos.length === 0 && !store.loading" class="empty-state">
        <AppIcon name="search_off" size="3.5rem" color="grey-4" />
        <h3>Sin resultados</h3>
        <p>No encontramos equipos con esos filtros. Probá con otra combinación.</p>
        <button class="btn btn-secondary" @click="resetAll">Limpiar todos los filtros</button>
      </div>

      <!-- Sentinel for infinite scroll -->
      <div v-if="!store.exhausted && sortedEquipos.length > 0" ref="sentinel" class="sentinel" />

      <div v-if="store.exhausted && sortedEquipos.length > 0" class="section-divider">
        <span>Has visto todos los equipos disponibles</span>
      </div>

      <div v-if="store.loading && store.page > 1" class="product-grid">
        <div v-for="n in 6" :key="'lm-sk-' + n" class="skeleton-card">
          <div class="sk-img" />
          <div class="sk-body">
            <div class="sk-line sk-short" />
            <div class="sk-line" />
            <div class="sk-line sk-long" />
            <div class="sk-line sk-short" />
          </div>
        </div>
      </div>

      <!-- Skeleton while loading more pages -->
      <div v-if="store.loading && store.page > 1" class="skeleton-grid">
        <div v-for="n in 6" :key="'lm-sk-' + n" class="skeleton-card">
          <div class="sk-img" />
          <div class="sk-body">
            <div class="sk-line sk-short" />
            <div class="sk-line" />
            <div class="sk-line sk-long" />
            <div class="sk-line sk-short" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick view modal -->
    <QuickViewModal :open="quickViewOpen" :equipo="quickViewEquipo" @close="quickViewOpen = false" />

    <!-- Compare bar -->
    <div class="compare-bar" :class="{ visible: compareList.length > 0 }">
      <div class="compare-items">
        <div v-for="item in compareList" :key="item.id" class="compare-item">
          <img :src="item.imagen_url || 'https://placehold.co/60x60/e8effe/0052ff?text=PC'" alt="" />
          <div class="ci-name">{{ item.marca }} {{ item.modelo }}</div>
          <AppIcon name="close" size="1rem" class="ci-remove" @click="removeCompare(item)" />
        </div>
      </div>
      <div class="compare-actions">
        <button class="btn btn-secondary compare-btn" @click="clearCompare">Limpiar</button>
        <button class="btn btn-primary compare-btn" disabled>
          <AppIcon name="bar_chart" size="1rem" />
          Comparar ({{ compareList.length }})
        </button>
      </div>
    </div>

    <!-- Filter drawer -->
    <FilterDrawer
      :open="drawerOpen"
      :brands="allBrands"
      :active-brands="draftBrands"
      :active-conditions="draftConditions"
      :min-price="draftMinPrice"
      :max-price="draftMaxPrice"
      @close="drawerOpen = false"
      @toggle-brand="toggleBrand"
      @toggle-condition="toggleCondition"
      @reset-all="resetFilters"
      @apply="applyFilters"
      @update:min-price="(v) => { draftMinPrice = v }"
      @update:max-price="(v) => { draftMaxPrice = v }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEquiposStore } from '../../stores/equipos'
import { getCategorias } from '../../api/categorias'
import { getBrands } from '../../api/equipos'
import ProductCard from '../../components/ProductCard.vue'
import QuickViewModal from '../../components/QuickViewModal.vue'
import FilterDrawer from '../../components/FilterDrawer.vue'

const route = useRoute()
const store = useEquiposStore()
const productsRef = ref(null)
const sentinel = ref(null)
let observer = null

const categorias = ref([])
const activeCat = ref(null)
const searchQuery = ref('')
const sortMode = ref('relevance')
const drawerOpen = ref(false)
const quickViewOpen = ref(false)
const quickViewEquipo = ref(null)
const compareList = ref([])
const activeBrands = ref([])
const activeConditions = ref([])
const minPrice = ref(0)
const maxPrice = ref(10000)

const draftBrands = ref([])
const draftConditions = ref([])
const draftMinPrice = ref(0)
const draftMaxPrice = ref(10000)

const catIcons = { Laptops: 'laptop', Desktops: 'desktop_windows', Gaming: 'sports_esports', Workstation: 'developer_board', 'All-in-One': 'dock' }

const allBrands = ref([])

const activeCatName = computed(() => {
  const found = categorias.value.find((c) => c.id === activeCat.value)
  return found ? found.nombre : ''
})

const filterCount = computed(() => {
  let n = 0
  if (activeBrands.value.length > 0) n++
  if (activeConditions.value.length > 0) n++
  if (minPrice.value > 0 || maxPrice.value < 10000) n++
  if (activeCat.value || searchQuery.value) n++
  return n
})

const filteredEquipos = computed(() => {
  let items = store.equipos
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter((e) =>
      `${e.marca} ${e.modelo} ${e.descripcion || ''}`.toLowerCase().includes(q)
    )
  }
  return items
})

const sortedEquipos = computed(() => {
  const items = [...filteredEquipos.value]
  if (sortMode.value === 'price-asc') items.sort((a, b) => Number(a.precio) - Number(b.precio))
  if (sortMode.value === 'price-desc') items.sort((a, b) => Number(b.precio) - Number(a.precio))
  return items
})

const filteredCount = computed(() => store.total)

const featuredId = computed(() => store.equipos[0]?.id || 1)

function getServerParams() {
  const params = {}
  if (activeCat.value) params.categoria = activeCat.value
  if (searchQuery.value) params.search = searchQuery.value
  if (activeBrands.value.length > 0) params.marca = activeBrands.value.join(',')
  if (activeConditions.value.length > 0) params.condicion = activeConditions.value.join(',')
  if (minPrice.value > 0) params.precio_min = minPrice.value
  if (maxPrice.value < 10000) params.precio_max = maxPrice.value
  return params
}

async function loadInitial() {
  store.resetPagination()
  await store.fetchEquipos(getServerParams())
  nextTick(observe)
}

async function loadMore() {
  await store.loadMore(getServerParams())
  nextTick(observe)
}

function observe() {
  if (observer) observer.disconnect()
  if (!sentinel.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMore()
  }, { rootMargin: '0rem 0rem 93.75rem 0rem' })
  observer.observe(sentinel.value)
}

function setCategory(id) {
  activeCat.value = id
  loadInitial()
}

function openDrawer() {
  draftBrands.value = [...activeBrands.value]
  draftConditions.value = [...activeConditions.value]
  draftMinPrice.value = minPrice.value
  draftMaxPrice.value = maxPrice.value
  drawerOpen.value = true
}

function scrollToProducts() {
  if (productsRef.value) {
    window.scrollTo({ top: productsRef.value.offsetTop - 80, behavior: 'smooth' })
  }
}

function openQuickView(equipo) {
  quickViewEquipo.value = equipo
  quickViewOpen.value = true
}

function toggleCompare(equipo) {
  const idx = compareList.value.findIndex((c) => c.id === equipo.id)
  if (idx >= 0) compareList.value.splice(idx, 1)
  else if (compareList.value.length < 4) compareList.value.push(equipo)
}

function removeCompare(item) {
  compareList.value = compareList.value.filter((c) => c.id !== item.id)
}

function clearCompare() { compareList.value = [] }

function sortProducts() { /* computed handles it */ }

function applyFilters() {
  activeBrands.value = [...draftBrands.value]
  activeConditions.value = [...draftConditions.value]
  minPrice.value = draftMinPrice.value
  maxPrice.value = draftMaxPrice.value
  loadInitial()
}

function removeBrand(brand) {
  activeBrands.value = activeBrands.value.filter((b) => b !== brand)
  loadInitial()
}

function removeCondition(cond) {
  activeConditions.value = activeConditions.value.filter((c) => c !== cond)
  loadInitial()
}

function resetPriceRange() {
  minPrice.value = 0
  maxPrice.value = 10000
  loadInitial()
}

function resetFilters() {
  activeBrands.value = []
  activeConditions.value = []
  minPrice.value = 0
  maxPrice.value = 10000
  draftBrands.value = []
  draftConditions.value = []
  draftMinPrice.value = 0
  draftMaxPrice.value = 10000
  loadInitial()
}

function resetAll() {
  activeBrands.value = []
  activeConditions.value = []
  minPrice.value = 0
  maxPrice.value = 10000
  draftBrands.value = []
  draftConditions.value = []
  draftMinPrice.value = 0
  draftMaxPrice.value = 10000
  activeCat.value = null
  searchQuery.value = ''
  loadInitial()
}

function toggleBrand(brand) {
  const idx = draftBrands.value.indexOf(brand)
  if (idx >= 0) draftBrands.value.splice(idx, 1)
  else draftBrands.value.push(brand)
}

function toggleCondition(cond) {
  const idx = draftConditions.value.indexOf(cond)
  if (idx >= 0) draftConditions.value.splice(idx, 1)
  else draftConditions.value.push(cond)
}

onMounted(async () => {
  try {
    const { data } = await getCategorias()
    categorias.value = data
  } catch { /* */ }

  try {
    const { data } = await getBrands()
    allBrands.value = data
  } catch { /* */ }

  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.categoria) {
    activeCat.value = parseInt(route.query.categoria, 10)
  }

  loadInitial()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (store.page > 1) store.resetPagination()
})
</script>

<style scoped>
.catalog-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(160deg, #f0f5ff 0%, #e8effe 25%, #fafbfd 55%, #f0f5ff 100%);
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 26.25rem; align-items: center;
}
.catalog-hero::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 37.5rem 25rem at 80% 30%, rgba(0,82,255,0.06), transparent),
    radial-gradient(ellipse 25rem 18.75rem at 20% 80%, rgba(0,198,255,0.05), transparent);
}
.catalog-hero .dots {
  position: absolute; right: -1.25rem; top: -1.25rem;
  width: 31.25rem; height: 31.25rem;
  background-image: radial-gradient(circle, rgba(0,82,255,0.08) 0.1125rem, transparent 0.1125rem);
  background-size: 34px 34px;
  pointer-events: none;
}
.hero-content { padding: 4rem 1.75rem 4rem 2rem; position: relative; z-index: 1; }
.hero-kicker {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; border-radius: 6.25rem;
  background: rgba(0,82,255,0.08); color: var(--accent);
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 1.25rem;
}
.hero-kicker .dot {
  width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--accent);
}
.pulse-dot { animation: hero-dot-pulse 2s ease-in-out infinite; }
@keyframes hero-dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.hero-title {
  font-size: clamp(34px, 4vw, 3.25rem); font-weight: 900;
  letter-spacing: -0.04em; line-height: 1.05; color: var(--fg); margin: 0 0 1rem;
}
.hero-title em {
  font-style: normal;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc { font-size: 1rem; color: var(--muted); max-width: 27.5rem; margin: 1rem 0 1.5rem; line-height: 1.5; }
.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.hero-visual {
  position: relative; z-index: 1; display: flex;
  align-items: center; justify-content: center; padding: 2rem;
}
.laptop-frame {
  width: 100%; max-width: 32.5rem;
  filter: drop-shadow(0 1.25rem 2.5rem rgba(0,0,0,0.10));
  transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
  border-radius: 1rem;
}
.hero-visual:hover .laptop-frame { transform: translateY(-0.5rem); }
.spec-float {
  position: absolute; padding: 0.75rem 1rem; border-radius: var(--radius-md);
  background: var(--surface); border: 1px solid var(--border);
  box-shadow: var(--shadow-md); font-size: 0.75rem; font-weight: 600;
  display: flex; align-items: center; gap: 0.5rem;
  animation: float-bob 3s ease-in-out infinite; color: var(--fg);
}
.spec-float.f1 { top: 18%; right: 8%; animation-delay: 0s; }
.spec-float.f2 { bottom: 28%; left: 4%; animation-delay: 1.2s; }
.sf-icon {
  width: 1.75rem; height: 1.75rem; border-radius: 0.5rem;
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center; flex-shrink: 0;
}
@keyframes float-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-0.5rem)} }

.products-area { padding: 0 2rem 2.5rem; }

.compare-bar {
  position: fixed; bottom: -7.5rem; left: 0; right: 0; z-index: 70;
  background: var(--surface); border-top: 1px solid var(--border);
  box-shadow: 0 -0.5rem 2rem rgba(0,0,0,0.08);
  padding: 1rem 2rem; display: flex; align-items: center; gap: 1.25rem;
  transition: bottom 0.35s cubic-bezier(0.23,1,0.32,1);
}
.compare-bar.visible { bottom: 0; }
.compare-items { display: flex; gap: 1rem; flex: 1; overflow-x: auto; }
.compare-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem; border-radius: var(--radius-md);
  border: 1px solid var(--border); flex-shrink: 0;
}
.compare-item img { width: 2.5rem; height: 2.5rem; object-fit: contain; border-radius: 0.25rem; }
.compare-item .ci-name { font-size: 0.75rem; font-weight: 600; max-width: 8.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.compare-item .ci-remove { cursor: pointer; color: var(--muted); flex-shrink: 0; }
.compare-item .ci-remove:hover { color: var(--danger); }
.compare-actions { display: flex; gap: 0.75rem; flex-shrink: 0; }
.compare-btn { font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem; }

.filter-left { flex-wrap: wrap; }
.active-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.results-info { font-size: 1rem; color: var(--muted); }
.results-info strong { color: var(--fg); font-family: var(--font-mono); }

@media (max-width: 64rem) {
  .catalog-hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-visual { display: none; }
  .hero-content { padding: 2.5rem 1.25rem; }
  .products-area { padding: 0 1.25rem 2rem; }
}
@media (max-width: 40rem) {
  .hero-title { font-size: 1.75rem; }
  .compare-bar { padding: 0.75rem 1rem; flex-direction: column; }
  .compare-actions { width: 100%; }
}
</style>
