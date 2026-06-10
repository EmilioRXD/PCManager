<template>
  <Teleport to="body">
    <div class="qv-overlay" :class="{ open }" @click.self="close">
      <div class="qv-modal">
        <button class="qv-close" @click="close">
          <AppIcon name="close" size="1.25rem" />
        </button>
        <div class="qv-image">
          <img :src="imgSrc" :alt="equipo?.modelo" />
        </div>
        <div class="qv-info">
          <div>
            <span class="badge badge-cat">{{ equipo?.categoria_nombre }}</span>
            <span
              v-if="equipo?.condicion"
              :class="[
                'badge',
                equipo.condicion === 'refurbished'
                  ? 'badge-warning'
                  : 'badge-success',
              ]"
              style="margin-left: 0.5rem"
            >
              {{ equipo.condicion === "refurbished" ? "Refurbished" : "Nuevo" }}
            </span>
          </div>
          <div class="card-brand">
            <span :class="['brand-dot', brandClass]" />
            {{ equipo?.marca }}
          </div>
          <h2 class="qv-title"> {{ equipo?.modelo }}</h2>
          <div class="card-price-row">
            <div class="price-pill price-pill-lg">
              <span class="price-label">REF:</span>
              <span class="price-value price-value-md">${{ formatPrice(equipo?.precio) }}</span>
            </div>
          </div>
          <div class="specs-row">
            <span v-if="equipo?.procesador" class="spec-tag">{{ equipo.procesador }}</span>
            <span v-if="equipo?.ram" class="spec-tag">{{ equipo.ram }}</span>
            <span v-if="equipo?.almacenamiento" class="spec-tag">{{ equipo.almacenamiento }}</span>
            <span v-if="equipo?.tarjeta_grafica" class="spec-tag">{{ equipo.tarjeta_grafica }}</span>
            <span v-if="equipo?.pantalla" class="spec-tag">{{ equipo.pantalla }}</span>
            <span v-if="equipo?.tactil" class="spec-tag">
              <AppIcon name="touch_app" size="0.75rem" style="margin-right: 0.125rem" />
              Táctil
            </span>
          </div>
          <div class="qv-actions">
            <a class="btn btn-primary qv-go-btn" @click.stop="goToDetail">
              Ver ficha completa
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  open: { type: Boolean, default: false },
  equipo: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const router = useRouter();

const imgSrc = computed(
  () =>
    props.equipo?.imagen_url ||
    "https://placehold.co/600x400/e8effe/0052ff?text=PCManager",
);

const brandClass = computed(() => {
  if (!props.equipo) return "lenovo";
  const map = {
    lenovo: "lenovo",
    dell: "dell",
    asus: "asus",
    apple: "apple",
    hp: "hp",
    msi: "msi",
    alienware: "alien",
    macbook: "apple",
  };
  return map[props.equipo.marca?.toLowerCase()] || "lenovo";
});

function formatPrice(val) {
  if (!val) return "0.00";
  return Number(val).toLocaleString("es-MX", { minimumFractionDigits: 2 });
}

function close() {
  emit("close");
}

function goToDetail() {
  close();
  if (props.equipo)
    router.push({ name: "product-detail", params: { id: props.equipo.id } });
}
</script>

<style scoped>
.qv-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 80;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity 0.25s;
}
.qv-overlay.open { opacity: 1; pointer-events: auto; }

.qv-modal {
  background: var(--surface); border-radius: var(--radius-lg);
  width: 56.25rem; max-width: 95vw; max-height: 85vh; overflow: hidden;
  display: grid; grid-template-columns: 1fr 1fr;
  transform: translateY(1.25rem);
  transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
}
.qv-overlay.open .qv-modal { transform: translateY(0); }

.qv-modal .qv-image {
  position: relative; overflow: hidden;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}
.qv-modal .qv-image img {
  width: 100%; height: 100%; object-fit: cover;
}
.qv-modal .qv-info {
  padding: 1.75rem; display: flex; flex-direction: column;
  gap: 0.75rem; overflow-y: auto;
}
.qv-modal .qv-close {
  position: absolute; top: 1rem; right: 1rem;
  width: 2.25rem; height: 2.25rem; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  cursor: pointer; display: grid; place-items: center;
  transition: all 0.15s; z-index: 2;
}
.qv-modal .qv-close:hover { background: var(--border-light); }

.qv-title {
  font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.1; color: var(--fg); margin: 0;
}
.qv-actions {
  margin-top: auto; padding-top: 1.5rem;
  display: flex; gap: 0.75rem;
}
.qv-go-btn {
  flex: 1; display: flex; align-items: center;
  justify-content: center; gap: 0.5rem;
  text-decoration: none; color: #fff !important;
}

.badge-cat {
  background: transparent; color: var(--accent-dark);
  border: 0.125rem solid var(--accent-dark);
}

@media (max-width: 64rem) {
  .qv-modal { grid-template-columns: 1fr; max-height: 90vh; }
  .qv-modal .qv-image {
    max-height: 18.75rem;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .qv-modal .qv-info { padding: 1.25rem 1.5rem 1.75rem; }
}
</style>
