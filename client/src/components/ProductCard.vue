<template>
  <article
    class="product-card"
    :data-cat="equipo.categoria_id"
    @click="$router.push({ name: 'product-detail', params: { id: equipo.id } })"
  >
    <div class="card-media">
      <div
        class="compare-check"
        :class="{ selected: isCompared }"
        @click.stop="toggleCompare"
      >
        <input
          type="checkbox"
          :id="'cmp' + equipo.id"
          :checked="isCompared"
          @change="toggleCompare"
        />
        <label
          :for="'cmp' + equipo.id"
          :title="isCompared ? 'Quitar de comparar' : 'Comparar'"
        ></label>
      </div>
      <img
        :src="imgSrc"
        :alt="equipo.marca + ' ' + equipo.modelo"
        loading="lazy"
      />
    </div>

    <div class="card-body">
      <div class="card-brand">
        <span :class="['brand-dot', brandClass]" />
        {{ equipo.marca }}
        <span
          v-if="equipo.condicion"
          :class="[
            'cond-badge',
            equipo.condicion === 'refurbished' ? 'cond-refurb' : 'cond-new',
          ]"
        >
          {{ equipo.condicion === "refurbished" ? "Refurbished" : "Nuevo" }}
        </span>
      </div>

      <div class="card-name">{{ equipo.modelo }}</div>

      <div class="card-price-row">
        <div class="price-pill price-pill-sm">
          <span class="price-label">REF:</span>
          <span class="price-value price-value-sm">${{ formatPrice(equipo.precio) }}</span>
        </div>
        <span v-if="equipo.stock > 0" class="stock-tag stock-tag-in">En stock</span>
        <span v-else class="stock-tag stock-tag-out">Agotado</span>
      </div>

      <div class="specs-row">
        <span class="spec-tag">{{ equipo.procesador }}</span>
        <span class="spec-tag">{{ equipo.ram }}</span>
        <span class="spec-tag">{{ equipo.almacenamiento }}</span>
        <span v-if="equipo.pantalla" class="spec-tag">{{ equipo.pantalla }}</span>
        <span v-if="equipo.tactil" class="spec-tag">
          <AppIcon name="touch_app" size="13px" style="margin-right:2px;" />
          Táctil
        </span>
      </div>

      <div class="card-footer">
        <a
          class="btn-more"
          @click.stop="
            $router.push({ name: 'product-detail', params: { id: equipo.id } })
          "
        >
          Ver ficha técnica
          <AppIcon name="arrow_forward" size="11px" />
        </a>
        <button class="btn-quick" @click.stop="$emit('quickView', equipo)">
          Vista rápida
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  equipo: { type: Object, required: true },
  compared: { type: Boolean, default: false },
});

const emit = defineEmits(["quickView", "toggleCompare"]);

const isCompared = computed(() => props.compared);

const imgSrc = computed(
  () =>
    props.equipo.imagen_url ||
    "https://placehold.co/600x400/e8effe/0052ff?text=PCManager",
);

const brandClass = computed(() => {
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
  return `brand-dot--${map[props.equipo.marca.toLowerCase()] || "lenovo"}`;
});

function formatPrice(val) {
  return Number(val).toLocaleString("es-ES", { minimumFractionDigits: 2 });
}

function toggleCompare() {
  emit("toggleCompare", props.equipo);
}
</script>

<style scoped>
.compare-check {
  position: absolute;
  top: 12px; right: 12px; z-index: 2;
  opacity: 0; transform: scale(0.85);
  transition: all 0.22s cubic-bezier(0.23,1,0.32,1);
}
.product-card:hover .compare-check,
.compare-check.selected {
  opacity: 1; transform: scale(1);
}
.compare-check input[type="checkbox"] { display: none; }
.compare-check label {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  cursor: pointer; transition: all 0.18s; font-size: 0;
}
.compare-check label::before {
  content: "+"; font-size: 18px; font-weight: 400;
  color: var(--muted-light); line-height: 1;
}
.compare-check label:hover {
  border-color: var(--accent); background: rgba(0,82,255,0.04);
}
.compare-check input:checked + label {
  background: var(--accent); border-color: var(--accent);
}
.compare-check input:checked + label::before {
  content: "✓"; color: #fff; font-size: 14px; font-weight: 700;
}

.card-media::after {
  content: ""; position: absolute;
  bottom: -10%; left: 50%; transform: translateX(-50%);
  width: 80%; height: 50%;
  background: radial-gradient(ellipse at center, rgba(0,82,255,0.025), transparent 70%);
  pointer-events: none;
}

.product-card:hover .spec-tag {
  border-color: rgba(0,82,255,0.14);
  color: var(--accent);
  background: rgba(0,82,255,0.025);
}
</style>
