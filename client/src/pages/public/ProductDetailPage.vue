<template>
  <div v-if="equipo">
    <div class="detail-wrapper">
      <div class="detail-layout">
        <!-- Gallery Column -->
        <div class="gallery-col">
          <ImageGallery :images="galleryImages" :alt="equipo.modelo" />

          <!-- Warranty section below gallery -->
          <div class="detail-section">
            <h2 class="section-title">
              <span class="section-icon"
                ><AppIcon name="verified_user" size="1.25rem"
              /></span>
              Garantías y beneficios
            </h2>
            <WarrantyCards :items="warrantyItems" />
          </div>
        </div>

        <!-- Info Column -->
        <div class="info-col">
          <div class="price-block">
            <div class="status-row">
              <span class="badge badge-success">{{
                equipo.categoria_nombre
              }}</span>
              <span v-if="equipo.condicion" class="badge badge-success">
                {{
                  equipo.condicion === "refurbished" ? "Refurbished" : "Nuevo"
                }}
              </span>
              <span class="badge badge-success">Garantía incluida</span>
            </div>

            <h1 class="product-title">{{ equipo.modelo }}</h1>
            <p class="product-subtitle">
              {{ equipo.marca }} —
              {{
                equipo.descripcion ||
                "Equipo de alto rendimiento para profesionales."
              }}
            </p>

            <div class="price-row-wrap">
              <div class="price-right-only">
                <span class="price-label">REF:</span>
                <span class="price-value"
                  >${{ formatPrice(equipo.precio) }}</span
                >
              </div>
            </div>
            <div class="price-info">Válido al cancelar</div>

            <div class="detail-actions-grid">
              <div class="detail-action-box">
                <img src="/images/payments/Zelle.webp" alt="Zelle" />
              </div>
              <div class="detail-action-box">
                <img src="/images/payments/Binance.webp" alt="Binance" />
              </div>
              <div class="detail-action-box detail-action-box--cash">
                <span class="cash-symbol">$</span>
              </div>
              <div class="detail-action-box">
                <img src="/images/payments/Banesco.webp" alt="Banesco" />
              </div>
            </div>
          </div>

          <div class="stock-row">
            <span
              :class="[
                'stock-badge',
                equipo.stock > 5
                  ? 'stock-in'
                  : equipo.stock > 0
                    ? 'stock-low'
                    : 'stock-out',
              ]"
            >
              <span v-if="equipo.stock > 0" class="stock-dot" />
              {{
                equipo.stock > 0
                  ? `En stock — ${equipo.stock} unidades`
                  : "Agotado"
              }}
            </span>
          </div>

          <div class="actions-row">
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="btn-whatsapp btn-whatsapp-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>

          <!-- Specs -->
          <div class="detail-section" style="margin-top: 2rem">
            <h2 class="section-title">
              <span class="section-icon"
                ><AppIcon name="memory" size="1.25rem"
              /></span>
              Especificaciones técnicas
            </h2>
            <SpecsGrid :specs="specsList" />
          </div>

          <!-- Accordion -->
          <div class="detail-section">
            <h2 class="section-title">
              <span class="section-icon"
                ><AppIcon name="info" size="1.25rem"
              /></span>
              Más información
            </h2>
            <div class="accordion">
              <div
                v-for="(acc, idx) in accordionItems"
                :key="idx"
                :class="['accordion-item', { open: openAccordion === idx }]"
              >
                <div
                  class="accordion-header"
                  @click="openAccordion = openAccordion === idx ? -1 : idx"
                >
                  <span>{{ acc.title }}</span>
                  <AppIcon
                    name="expand_more"
                    :class="[
                      'accordion-chevron',
                      { rotated: openAccordion === idx },
                    ]"
                    size="1rem"
                  />
                </div>
                <div class="accordion-body" v-show="openAccordion === idx">
                  {{ acc.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating WhatsApp -->
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener"
      class="floating-wa"
      aria-label="Consultar por WhatsApp"
      title="Consultar por WhatsApp"
    >
      <span class="pulse-ring"></span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        />
      </svg>
    </a>
  </div>

  <div v-else-if="loading" class="flex flex-center" style="min-height: 60vh">
    <q-spinner color="primary" size="4em" />
  </div>

  <div v-else class="flex flex-center" style="min-height: 60vh">
    <div class="text-center text-grey-7">
      <AppIcon name="error_outline" size="5em" class="q-mb-md" />
      <div class="text-h5">Equipo no encontrado</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useEquiposStore } from "../../stores/equipos";
import ImageGallery from "../../components/ImageGallery.vue";
import SpecsGrid from "../../components/SpecsGrid.vue";
import WarrantyCards from "../../components/WarrantyCards.vue";

const route = useRoute();
const store = useEquiposStore();

const equipo = ref(null);
const loading = ref(true);
const openAccordion = ref(0);

const galleryImages = computed(() => {
  if (!equipo.value) return [];
  return equipo.value.imagenes?.length
    ? equipo.value.imagenes
    : [
        {
          url:
            equipo.value.imagen_url ||
            "https://placehold.co/800x600/e8effe/0052ff?text=PCManager",
        },
      ];
});

const specsList = computed(() => {
  if (!equipo.value) return [];
  const e = equipo.value;
  return [
    { label: "Procesador", value: e.procesador, icon: "memory" },
    { label: "Memoria RAM", value: e.ram, icon: "sd_card" },
    { label: "Almacenamiento", value: e.almacenamiento, icon: "storage" },
    ...(e.pantalla
      ? [{ label: "Pantalla", value: e.pantalla, icon: "display_settings" }]
      : []),
    ...(e.tactil ? [{ label: "Táctil", value: "Sí", icon: "pan_tool" }] : []),
    { label: "Marca", value: e.marca, icon: "branding_watermark" },
    ...(e.tarjeta_grafica
      ? [
          {
            label: "Tarjeta Gráfica",
            value: e.tarjeta_grafica,
            icon: "videocam",
          },
        ]
      : []),
    { label: "Categoría", value: e.categoria_nombre, icon: "category" },
  ];
});

const accordionItems = computed(() => {
  if (!equipo.value) return [];
  return [
    {
      title: "Descripción del producto",
      content:
        equipo.value.descripcion ||
        "Equipo de alto rendimiento con componentes de calidad.",
    },
    {
      title: "Estado y garantía",
      content:
        equipo.value?.condicion === "refurbished"
          ? "Equipo refurbished en excelentes condiciones. Inspeccionado, certificado y libre de defectos funcionales. Incluye garantía técnica por defectos de funcionamiento. No cubre daños físicos, líquidos o mal uso."
          : "Equipo nuevo de paquete original. Incluye garantía técnica por defectos de funcionamiento. No cubre daños físicos, líquidos o mal uso.",
    },
    {
      title: "Envío y entrega",
      content:
        "Envío gratis a todo el país. Empaque con espuma anti-impacto. Tiempo de entrega: 2 a 4 días hábiles. Se proporciona número de rastreo.",
    },
  ];
});

const whatsappLink = computed(() => {
  if (!equipo.value) return "#";
  const msg = encodeURIComponent(
    `Hola! Me interesa el equipo ${equipo.value.marca} ${equipo.value.modelo} (ID: ${equipo.value.id})`,
  );
  return `https://wa.me/5210000000000?text=${msg}`;
});

const warrantyItems = [
  {
    icon: "verified_user",
    label: "Garantía incluida",
    desc: "Cobertura técnica por defectos.",
  },
  {
    icon: "local_shipping",
    label: "Envío gratis nacional",
    desc: "Empaque anti-impacto, 2-4 días.",
  },
  {
    icon: "credit_card",
    label: "Equipo inspeccionado",
    desc: "Revisión de 32 puntos.",
  },
  {
    icon: "chat",
    label: "Soporte por WhatsApp",
    desc: "Respuesta en menos de 24h.",
  },
];

function formatPrice(val) {
  return Number(val).toLocaleString("es-MX", { minimumFractionDigits: 2 });
}

watch(
  () => route.params.id,
  async (id) => {
    loading.value = true;
    equipo.value = null;
    try {
      equipo.value = await store.fetchEquipo(id);
    } catch {
      equipo.value = null;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.detail-wrapper {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 27.5rem;
  gap: 3.5rem;
  margin-top: 1.5rem;
  align-items: start;
}
.gallery-col {
  position: sticky;
  top: 5.5rem;
}
.info-col {
  position: sticky;
  top: 5.5rem;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.product-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 0.5rem;
  color: var(--fg);
}
.product-subtitle {
  font-size: 1rem;
  color: var(--muted);
  margin: 0;
}

.price-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.5rem 0 1.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}
.price-row-wrap {
  display: flex;
  justify-content: flex-start;
  margin-top: 1.25rem;
}
.price-right-only {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent), #3b82f6);
  border-radius: 0 62.5rem 62.5rem 0;
  padding: 1rem 1rem 1rem 2.5rem;
  margin-left: -1.5rem;
  font-family: var(--font-display);
  color: #fff;
}
.price-right-only .price-label {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}
.price-right-only .price-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: var(--font-mono);
}
.price-info {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-dark);
  padding: 0.25rem 0 0.75rem;
}
.detail-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 3rem);
  justify-content: start;
  gap: 0.5rem;
  padding: 1rem 0;
}
.detail-action-box {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: var(--surface);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.detail-action-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail-action-box--cash {
  background: #22c55e;
  border-color: #22c55e;
}
.cash-symbol {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stock-row {
  margin-bottom: 1rem;
}

.actions-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.detail-section {
  margin-top: 2.25rem;
}

@media (max-width: 64rem) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .gallery-col,
  .info-col {
    position: static;
  }
  .product-title {
    font-size: 1.75rem;
  }
  .price-right-only .price-value {
    font-size: 1.75rem;
  }
  .price-right-only .price-label {
    font-size: 0.75rem;
  }
}
@media (max-width: 40rem) {
  .actions-row .btn-whatsapp {
    min-width: 100%;
  }
  .detail-wrapper {
    padding: 0 1rem 3rem;
  }
  .detail-actions-grid {
    grid-template-columns: repeat(2, 3.75rem);
    gap: 0.75rem;
  }
}
</style>
