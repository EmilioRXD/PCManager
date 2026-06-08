<template>
  <div v-if="equipo">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/">Catálogo</router-link>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      <router-link :to="{ name: 'catalog', query: { categoria: equipo.categoria_id } }">{{ equipo.categoria_nombre }}</router-link>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      <span>{{ equipo.modelo }}</span>
    </div>

    <div class="detail-wrapper">
      <div class="detail-layout">
        <!-- Gallery Column -->
        <div class="gallery-col">
          <ImageGallery :images="galleryImages" :alt="equipo.modelo" />

          <!-- Warranty section below gallery -->
          <div class="detail-section">
            <h2 class="section-title">
              <span class="section-icon"><AppIcon name="verified_user" size="18px" /></span>
              Garantías y beneficios
            </h2>
            <WarrantyCards :items="warrantyItems" />
          </div>
        </div>

        <!-- Info Column -->
        <div class="info-col">
          <div class="status-row">
            <span class="badge">{{ equipo.categoria_nombre }}</span>
            <span class="badge badge-accent">Garantía incluida</span>
          </div>

          <h1 class="product-title">{{ equipo.modelo }}</h1>
          <p class="product-subtitle">{{ equipo.marca }} — {{ equipo.descripcion || 'Equipo de alto rendimiento para profesionales.' }}</p>

          <div class="price-block">
            <div>
              <div class="price-big">${{ formatPrice(equipo.precio) }}</div>
              <div class="price-info">Precio válido por tiempo limitado</div>
            </div>
            <span :class="['stock-badge', equipo.stock > 5 ? 'stock-in' : equipo.stock > 0 ? 'stock-low' : 'stock-out']">
              <span v-if="equipo.stock > 0" class="stock-dot" />
              {{ equipo.stock > 0 ? `En stock — ${equipo.stock} unidades` : 'Agotado' }}
            </span>
          </div>

          <div class="actions-row">
            <a :href="whatsappLink" target="_blank" rel="noopener" class="btn-whatsapp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>

          <!-- Specs -->
          <div class="detail-section" style="margin-top:32px;">
            <h2 class="section-title">
              <span class="section-icon"><AppIcon name="memory" size="18px" /></span>
              Especificaciones técnicas
            </h2>
            <SpecsGrid :specs="specsList" />
          </div>

          <!-- Accordion -->
          <div class="detail-section">
            <h2 class="section-title">
              <span class="section-icon"><AppIcon name="info" size="18px" /></span>
              Más información
            </h2>
            <div class="accordion">
              <div v-for="(acc, idx) in accordionItems" :key="idx" :class="['accordion-item', { open: openAccordion === idx }]">
                <div class="accordion-header" @click="openAccordion = openAccordion === idx ? -1 : idx">
                  <span>{{ acc.title }}</span>
                  <AppIcon name="expand_more" :class="['chevron', { rotated: openAccordion === idx }]" size="16px" />
                </div>
                <div class="accordion-body" v-show="openAccordion === idx">{{ acc.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating WhatsApp -->
    <a :href="whatsappLink" target="_blank" rel="noopener" class="floating-wa" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp">
      <span class="pulse-ring"></span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>

  <div v-else-if="loading" class="flex flex-center" style="min-height:60vh;">
    <q-spinner color="primary" size="4em" />
  </div>

  <div v-else class="flex flex-center" style="min-height:60vh;">
    <div class="text-center text-grey-7">
      <AppIcon name="error_outline" size="5em" class="q-mb-md" />
      <div class="text-h5">Equipo no encontrado</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEquiposStore } from '../../stores/equipos'
import ImageGallery from '../../components/ImageGallery.vue'
import SpecsGrid from '../../components/SpecsGrid.vue'
import WarrantyCards from '../../components/WarrantyCards.vue'

const route = useRoute()
const store = useEquiposStore()

const equipo = ref(null)
const loading = ref(true)
const openAccordion = ref(0)

const galleryImages = computed(() => {
  if (!equipo.value) return []
  return equipo.value.imagenes?.length
    ? equipo.value.imagenes
    : [{ url: equipo.value.imagen_url || 'https://placehold.co/800x600/e8effe/0052ff?text=PCManager' }]
})

const specsList = computed(() => {
  if (!equipo.value) return []
  const e = equipo.value
  return [
    { label: 'Procesador', value: e.procesador, icon: 'memory' },
    { label: 'Memoria RAM', value: e.ram, icon: 'sd_card' },
    { label: 'Almacenamiento', value: e.almacenamiento, icon: 'storage' },
    { label: 'Marca', value: e.marca, icon: 'branding_watermark' },
    ...(e.tarjeta_grafica ? [{ label: 'Tarjeta Gráfica', value: e.tarjeta_grafica, icon: 'videocam' }] : []),
    { label: 'Categoría', value: e.categoria_nombre, icon: 'category' },
  ]
})

const accordionItems = computed(() => {
  if (!equipo.value) return []
  return [
    { title: 'Descripción del producto', content: equipo.value.descripcion || 'Equipo de alto rendimiento con componentes de calidad.' },
    { title: 'Estado y garantía', content: 'Equipo nuevo o en perfectas condiciones. Incluye garantía técnica por defectos de funcionamiento. No cubre daños físicos, líquidos o mal uso.' },
    { title: 'Envío y entrega', content: 'Envío gratis a todo el país. Empaque con espuma anti-impacto. Tiempo de entrega: 2 a 4 días hábiles. Se proporciona número de rastreo.' },
  ]
})

const whatsappLink = computed(() => {
  if (!equipo.value) return '#'
  const msg = encodeURIComponent(`Hola! Me interesa el equipo ${equipo.value.marca} ${equipo.value.modelo} (ID: ${equipo.value.id})`)
  return `https://wa.me/5210000000000?text=${msg}`
})

const warrantyItems = [
  { icon: 'verified_user', label: 'Garantía incluida', desc: 'Cobertura técnica por defectos.' },
  { icon: 'local_shipping', label: 'Envío gratis nacional', desc: 'Empaque anti-impacto, 2-4 días.' },
  { icon: 'credit_card', label: 'Equipo inspeccionado', desc: 'Revisión de 32 puntos.' },
  { icon: 'chat', label: 'Soporte por WhatsApp', desc: 'Respuesta en menos de 24h.' },
]

function formatPrice(val) {
  return Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })
}

onMounted(async () => {
  try {
    equipo.value = await store.fetchEquipo(route.params.id)
  } catch {
    equipo.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.breadcrumb {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 24px 0; font-size: 13px; color: var(--muted);
}
.breadcrumb a { color: var(--muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--accent); }
.breadcrumb span { color: var(--fg); font-weight: 500; }

.detail-wrapper { max-width: 1280px; margin: 0 auto; padding: 0 24px 64px; }
.detail-layout { display: grid; grid-template-columns: 1fr 440px; gap: 56px; margin-top: 24px; align-items: start; }
.gallery-col { position: sticky; top: 88px; }
.info-col { position: sticky; top: 88px; }
.status-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.product-title { font-size: 34px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 8px; color: var(--fg); }
.product-subtitle { font-size: 15px; color: var(--muted); margin: 0 0 20px; }

.price-block {
  background: var(--gradient-accent-subtle);
  border: 1px solid var(--accent-glow);
  border-radius: var(--radius-lg);
  padding: 20px 24px; margin-bottom: 20px;
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.price-big { font-family: var(--font-mono); font-size: 38px; font-weight: 700; color: var(--accent); line-height: 1; }
.price-info { font-size: 13px; color: var(--muted); }
.stock-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--radius-pill); font-size: 13px; font-weight: 600; }
.stock-in { background: var(--success-glow); color: var(--success); }
.stock-low { background: var(--warning-glow); color: var(--warning); }
.stock-out { background: var(--danger-glow); color: var(--danger); }
.stock-dot { width: 9px; height: 9px; border-radius: 50%; }
.stock-in .stock-dot { background: var(--success); }
.stock-low .stock-dot { background: var(--warning); }

.actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
.btn-whatsapp {
  flex: 1; display: inline-flex; align-items: center; justify-content: center;
  gap: 10px; padding: 14px 20px; font-size: 15px; font-weight: 600;
  border-radius: 12px; background: #25d366; color: #fff; border: none;
  cursor: pointer; text-decoration: none; transition: all 0.2s;
  font-family: var(--font-display);
}
.btn-whatsapp:hover { background: #1ebe57; box-shadow: 0 6px 20px rgba(37,211,102,0.3); }

.detail-section { margin-top: 36px; }
.section-title {
  font-size: 18px; font-weight: 700; margin-bottom: 18px;
  display: flex; align-items: center; gap: 10px;
  color: var(--fg); font-family: var(--font-display);
}
.section-icon {
  width: 34px; height: 34px; border-radius: var(--radius-sm);
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center;
}

.accordion { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.accordion-item + .accordion-item { border-top: 1px solid var(--border-light); }
.accordion-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; cursor: pointer; font-weight: 600; font-size: 14px;
  background: var(--surface); transition: background 0.12s;
  font-family: var(--font-display);
}
.accordion-header:hover { background: var(--gradient-accent-subtle); }
.accordion-body { padding: 16px 20px; font-size: 14px; color: var(--muted); line-height: 1.65; border-top: 1px solid var(--border-light); }
.chevron { transition: transform 0.25s cubic-bezier(0.23,1,0.32,1); color: var(--muted); }
.chevron.rotated { transform: rotate(180deg); }

.floating-wa {
  position: fixed; bottom: 28px; right: 28px;
  width: 58px; height: 58px; border-radius: 50%;
  background: #25d366; color: #fff; border: none;
  box-shadow: 0 8px 24px rgba(37,211,102,0.35);
  cursor: pointer; display: grid; place-items: center;
  transition: transform 0.2s; z-index: 30;
}
.floating-wa:hover { transform: scale(1.08); }
.pulse-ring {
  position: absolute; inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(37,211,102,0.4);
  animation: wa-pulse 2s ease-out infinite;
}
@keyframes wa-pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

@media (max-width: 1024px) {
  .detail-layout { grid-template-columns: 1fr; gap: 32px; }
  .gallery-col, .info-col { position: static; }
  .product-title { font-size: 26px; }
  .price-big { font-size: 30px; }
}
@media (max-width: 640px) {
  .actions-row .btn-whatsapp { min-width: 100%; }
  .detail-wrapper { padding: 0 16px 48px; }
}
</style>
