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
          <span class="sf-icon"><AppIcon name="memory" size="14px" /></span>
          Hasta i9
        </div>
        <div class="spec-float f2">
          <span class="sf-icon"><AppIcon name="sd_card" size="14px" /></span>
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
        <AppIcon name="grid_view" size="16px" />
        Todos
      </button>
      <button
        v-for="cat in categorias"
        :key="cat.id"
        :class="['cat-pill', { active: activeCat === cat.id }]"
        @click="setCategory(cat.id)"
      >
        <AppIcon :name="catIcons[cat.nombre] || 'computer'" size="16px" />
        {{ cat.nombre }}
      </button>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="flex items-center gap-3 filter-left">
        <span class="results-info">Mostrando <strong>{{ filteredCount }}</strong> equipos</span>
        <div class="active-chips">
          <span v-if="activeCat" class="chip" @click="setCategory(null)">
            {{ activeCatName }}
            <AppIcon name="close" size="12px" />
          </span>
          <span v-if="searchQuery" class="chip" @click="searchQuery = ''">
            "{{ searchQuery }}"
            <AppIcon name="close" size="12px" />
          </span>
          <span v-for="b in activeBrands" :key="b" class="chip" @click="toggleBrand(b)">
            {{ b }}
            <AppIcon name="close" size="12px" />
          </span>
          <span v-for="c in activeConditions" :key="c" class="chip" @click="toggleCondition(c)">
            {{ c === 'nuevo' ? 'Nuevo' : 'Refurbished' }}
            <AppIcon name="close" size="12px" />
          </span>
          <span v-if="minPrice > 0 || maxPrice < 10000" class="chip" @click="minPrice = 0; maxPrice = 10000">
            ${{ minPrice }} — ${{ maxPrice }}
            <AppIcon name="close" size="12px" />
          </span>
        </div>
      </div>
      <div class="filter-actions">
        <select class="sort-select" v-model="sortMode" @change="sortProducts">
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
        <button class="btn-filter-toggle" @click="drawerOpen = true">
          <AppIcon name="filter_list" size="16px" />
          Filtros
          <span v-if="filterCount" class="badge-count">{{ filterCount }}</span>
        </button>
      </div>
    </div>

    <!-- Product grid -->
    <div class="products-area">
      <div class="grid">
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
        <AppIcon name="search_off" size="56px" color="grey-4" />
        <h3>Sin resultados</h3>
        <p>No encontramos equipos con esos filtros. Probá con otra combinación.</p>
        <button class="btn btn-secondary" @click="resetAll">Limpiar todos los filtros</button>
      </div>

      <!-- Sentinel for infinite scroll -->
      <div v-if="!store.exhausted && sortedEquipos.length > 0" ref="sentinel" class="sentinel" />

      <div v-if="store.exhausted && sortedEquipos.length > 0" class="sp-divider">
        <span>Has visto todos los equipos disponibles</span>
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
          <AppIcon name="close" size="14px" class="ci-remove" @click="removeCompare(item)" />
        </div>
      </div>
      <div class="compare-actions">
        <button class="btn btn-secondary compare-btn" @click="clearCompare">Limpiar</button>
        <button class="btn btn-primary compare-btn" disabled>
          <AppIcon name="bar_chart" size="16px" />
          Comparar ({{ compareList.length }})
        </button>
      </div>
    </div>

    <!-- Filter drawer -->
    <FilterDrawer
      :open="drawerOpen"
      :brands="uniqueBrands"
      :active-brands="activeBrands"
      :active-conditions="activeConditions"
      :min-price="minPrice"
      :max-price="maxPrice"
      @close="drawerOpen = false"
      @toggle-brand="toggleBrand"
      @toggle-condition="toggleCondition"
      @reset-all="resetFilters"
      @apply="applyFilters"
      @update:min-price="(v) => { minPrice = v }"
      @update:max-price="(v) => { maxPrice = v }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEquiposStore } from '../../stores/equipos'
import { getCategorias } from '../../api/categorias'
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

const catIcons = { Laptops: 'laptop', Desktops: 'desktop_windows', Gaming: 'sports_esports', Workstation: 'developer_board', 'All-in-One': 'dock' }

const uniqueBrands = computed(() => [...new Set(store.equipos.map((e) => e.marca))].sort())

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
  if (activeCat.value) items = items.filter((e) => e.categoria_id === activeCat.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter((e) =>
      `${e.marca} ${e.modelo} ${e.descripcion || ''}`.toLowerCase().includes(q)
    )
  }
  if (activeBrands.value.length > 0) {
    items = items.filter((e) => activeBrands.value.includes(e.marca))
  }
  if (activeConditions.value.length > 0) {
    items = items.filter((e) => e.condicion && activeConditions.value.includes(e.condicion))
  }
  const min = Number(minPrice.value) || 0
  const max = Number(maxPrice.value) || Infinity
  items = items.filter((e) => Number(e.precio) >= min && Number(e.precio) <= max)
  return items
})

const sortedEquipos = computed(() => {
  const items = [...filteredEquipos.value]
  if (sortMode.value === 'price-asc') items.sort((a, b) => Number(a.precio) - Number(b.precio))
  if (sortMode.value === 'price-desc') items.sort((a, b) => Number(b.precio) - Number(a.precio))
  return items
})

const filteredCount = computed(() => sortedEquipos.value.length)

const featuredId = computed(() => store.equipos[0]?.id || 1)

function getServerParams() {
  const params = {}
  if (activeCat.value) params.categoria = activeCat.value
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
  }, { rootMargin: '0px 0px 1500px 0px' })
  observer.observe(sentinel.value)
}

function setCategory(id) {
  activeCat.value = id
  loadInitial()
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
  /* filtros reactivos via computed */
}

function resetFilters() {
  activeBrands.value = []
  activeConditions.value = []
  minPrice.value = 0
  maxPrice.value = 10000
}

function resetAll() {
  resetFilters()
  activeCat.value = null
  searchQuery.value = ''
  loadInitial()
}

function toggleBrand(brand) {
  const idx = activeBrands.value.indexOf(brand)
  if (idx >= 0) activeBrands.value.splice(idx, 1)
  else activeBrands.value.push(brand)
}

function toggleCondition(cond) {
  const idx = activeConditions.value.indexOf(cond)
  if (idx >= 0) activeConditions.value.splice(idx, 1)
  else activeConditions.value.push(cond)
}

onMounted(async () => {
  try {
    const { data } = await getCategorias()
    categorias.value = data
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
/* ── Hero ── */
.catalog-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(160deg, #f0f5ff 0%, #e8effe 25%, #fafbfd 55%, #f0f5ff 100%);
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 420px; align-items: center;
}
.catalog-hero::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 80% 30%, rgba(0,82,255,0.06), transparent),
    radial-gradient(ellipse 400px 300px at 20% 80%, rgba(0,198,255,0.05), transparent);
}
.catalog-hero .dots {
  position: absolute; right: -20px; top: -20px;
  width: 500px; height: 500px;
  background-image: radial-gradient(circle, rgba(0,82,255,0.08) 1.8px, transparent 1.8px);
  background-size: 34px 34px;
  pointer-events: none;
}
.hero-content { padding: 64px 28px 64px 32px; position: relative; z-index: 1; }
.hero-kicker {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: 99px;
  background: rgba(0,82,255,0.08); color: var(--accent);
  font-size: 13px; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 20px;
}
.hero-kicker .dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
}
.pulse-dot { animation: hero-dot-pulse 2s ease-in-out infinite; }
@keyframes hero-dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.hero-title {
  font-size: clamp(34px, 4vw, 52px); font-weight: 900;
  letter-spacing: -0.04em; line-height: 1.05; color: var(--fg); margin: 0 0 16px;
}
.hero-title em {
  font-style: normal;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc { font-size: 16px; color: var(--muted); max-width: 440px; margin: 16px 0 24px; line-height: 1.5; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.hero-visual {
  position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
  padding: 32px;
}
.laptop-frame {
  width: 100%; max-width: 520px;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.10));
  transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
  border-radius: 16px;
}
.hero-visual:hover .laptop-frame { transform: translateY(-6px); }
.spec-float {
  position: absolute; padding: 10px 16px; border-radius: var(--radius-md);
  background: var(--surface); border: 1px solid var(--border);
  box-shadow: var(--shadow-md); font-size: 13px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
  animation: float-bob 3s ease-in-out infinite;
  color: var(--fg);
}
.spec-float.f1 { top: 18%; right: 8%; animation-delay: 0s; }
.spec-float.f2 { bottom: 28%; left: 4%; animation-delay: 1.2s; }
.sf-icon {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center; flex-shrink: 0;
}
@keyframes float-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

/* ── Category pills ── */
.cat-strip {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 32px; border-bottom: 1px solid var(--border);
  overflow-x: auto; scrollbar-width: none;
}
.cat-strip::-webkit-scrollbar { display: none; }
.cat-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 99px;
  border: 1px solid var(--border); background: var(--surface);
  font-size: 14px; font-weight: 600; color: var(--fg);
  cursor: pointer; white-space: nowrap; transition: all 0.18s;
  flex-shrink: 0; font-family: var(--font-display);
}
.cat-pill:hover { border-color: var(--accent); color: var(--accent); }
.cat-pill.active {
  background: var(--accent); color: #fff; border-color: var(--accent);
  box-shadow: 0 4px 16px var(--accent-glow-strong);
}

/* ── Filter bar ── */
.filter-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 32px; gap: 16px; flex-wrap: wrap;
}
.filter-left { flex-wrap: wrap; }
.results-info { font-size: 14px; color: var(--muted); }
.results-info strong { color: var(--fg); font-family: var(--font-mono); }
.active-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 99px;
  background: var(--accent-glow); color: var(--accent);
  font-size: 12.5px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
}
.chip:hover { background: var(--accent-glow-strong); }
.filter-actions { display: flex; align-items: center; gap: 10px; }
.sort-select {
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 9px 14px; font-size: 13px; background: var(--surface);
  color: var(--fg); cursor: pointer; font-family: var(--font-body);
}
.sort-select:focus { outline: none; border-color: var(--accent); }
.btn-filter-toggle {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px; border-radius: var(--radius-md);
  border: 1px solid var(--border); background: var(--surface);
  font-size: 13px; font-weight: 600; color: var(--fg); cursor: pointer;
  transition: all 0.15s; font-family: var(--font-display);
}
.btn-filter-toggle:hover { border-color: var(--accent); color: var(--accent); }
.badge-count {
  background: var(--accent); color: #fff; font-family: var(--font-mono);
  font-size: 10px; padding: 2px 7px; border-radius: 99px; font-weight: 700;
}

/* ── Products area ── */
.products-area { padding: 0 32px 40px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
.empty-state { grid-column: 1/-1; text-align: center; padding: 80px 0; }
.empty-state h3 { font-size: 18px; margin-bottom: 6px; color: var(--fg); }
.empty-state p { color: var(--muted); font-size: 14px; margin-bottom: 16px; }

.sentinel { height: 1px; width: 100%; }

.sp-divider {
  text-align: center; padding: 40px 0 32px;
  color: var(--muted); font-size: 13px;
}
.sp-divider span {
  display: inline-block; padding: 8px 20px;
  border-radius: 999px; background: var(--border-light);
  color: var(--muted);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px; margin-top: 24px;
}
.skeleton-card {
  border-radius: var(--radius-lg); overflow: hidden;
  background: var(--surface);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.025);
}
.sk-img {
  aspect-ratio: 4/3;
  background: linear-gradient(90deg, var(--border-light) 25%, var(--surface) 50%, var(--border-light) 75%);
  background-size: 200% 100%;
  animation: sk-pulse 1.5s ease-in-out infinite;
}
.sk-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
.sk-line {
  height: 14px; border-radius: 4px; width: 80%;
  background: linear-gradient(90deg, var(--border-light) 25%, var(--surface) 50%, var(--border-light) 75%);
  background-size: 200% 100%;
  animation: sk-pulse 1.5s ease-in-out infinite;
}
.sk-line.sk-short { width: 50%; }
.sk-line.sk-long { width: 95%; }

@keyframes sk-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Compare bar ── */
.compare-bar {
  position: fixed; bottom: -120px; left: 0; right: 0; z-index: 70;
  background: var(--surface); border-top: 1px solid var(--border);
  box-shadow: 0 -8px 32px rgba(0,0,0,0.08);
  padding: 16px 32px; display: flex; align-items: center; gap: 20px;
  transition: bottom 0.35s cubic-bezier(0.23,1,0.32,1);
}
.compare-bar.visible { bottom: 0; }
.compare-items { display: flex; gap: 16px; flex: 1; overflow-x: auto; }
.compare-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px 8px 8px; border-radius: var(--radius-md);
  border: 1px solid var(--border); flex-shrink: 0;
}
.compare-item img { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; }
.compare-item .ci-name { font-size: 13px; font-weight: 600; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.compare-item .ci-remove { cursor: pointer; color: var(--muted); flex-shrink: 0; }
.compare-item .ci-remove:hover { color: var(--danger); }
.compare-actions { display: flex; gap: 10px; flex-shrink: 0; }
.compare-btn { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }

@media (max-width: 1024px) {
  .catalog-hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-visual { display: none; }
  .hero-content { padding: 40px 20px; }
  .cat-strip, .filter-bar { padding-left: 20px; padding-right: 20px; }
  .products-area { padding: 0 20px 32px; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .skeleton-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .skeleton-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 28px; }
  .compare-bar { padding: 12px 16px; flex-direction: column; }
  .compare-actions { width: 100%; }
}
</style>
