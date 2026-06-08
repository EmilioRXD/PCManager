<template>
  <Teleport to="body">
    <div class="qv-overlay" :class="{ open }" @click.self="close">
      <div class="qv-modal">
        <button class="qv-close" @click="close">
          <AppIcon name="close" size="18px" />
        </button>
        <div class="qv-image">
          <img :src="imgSrc" :alt="equipo?.modelo" />
        </div>
        <div class="qv-info">
          <div>
            <span class="badge badge-accent">{{ equipo?.categoria_nombre }}</span>
            <span v-if="equipo?.condicion" :class="['badge', equipo.condicion === 'refurbished' ? 'badge-warning' : 'badge-success']" style="margin-left:6px;">
              {{ equipo.condicion === 'refurbished' ? 'Refurbished' : 'Nuevo' }}
            </span>
          </div>
          <div class="card-brand" style="display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);">
            <span :class="['brand-dot', brandClass]" style="width:7px;height:7px;border-radius:50%;flex-shrink:0;" />
            {{ equipo?.marca }}
          </div>
          <h2 style="font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:var(--fg);margin:0;">{{ equipo?.modelo }}</h2>
          <div class="card-price" style="font-size:28px;display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;font-family:var(--font-mono);font-weight:700;color:var(--accent);">
            ${{ formatPrice(equipo?.precio) }}
          </div>
          <div class="specs" style="display:flex;flex-wrap:wrap;gap:5px;">
            <span v-if="equipo?.procesador" class="spec-tag">{{ equipo.procesador }}</span>
            <span v-if="equipo?.ram" class="spec-tag">{{ equipo.ram }}</span>
            <span v-if="equipo?.almacenamiento" class="spec-tag">{{ equipo.almacenamiento }}</span>
            <span v-if="equipo?.tarjeta_grafica" class="spec-tag">{{ equipo.tarjeta_grafica }}</span>
          </div>
          <div style="margin-top:auto;display:flex;gap:10px;">
            <a class="btn btn-primary" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;color:#fff;" @click.stop="goToDetail">
              Ver ficha completa
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  open: { type: Boolean, default: false },
  equipo: { type: Object, default: null },
})

const emit = defineEmits(['close'])
const router = useRouter()

const imgSrc = computed(() =>
  props.equipo?.imagen_url || 'https://placehold.co/600x400/e8effe/0052ff?text=PCManager'
)

const brandClass = computed(() => {
  if (!props.equipo) return 'lenovo'
  const map = { lenovo: 'lenovo', dell: 'dell', asus: 'asus', apple: 'apple', hp: 'hp', msi: 'msi', alienware: 'alien', macbook: 'apple' }
  return map[props.equipo.marca?.toLowerCase()] || 'lenovo'
})

function formatPrice(val) {
  if (!val) return '0.00'
  return Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })
}

function close() { emit('close') }

function goToDetail() {
  close()
  if (props.equipo) router.push({ name: 'product-detail', params: { id: props.equipo.id } })
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
  background: var(--surface); border-radius: var(--radius-lg); width: 900px;
  max-width: 95vw; max-height: 85vh; overflow-y: auto;
  display: grid; grid-template-columns: 1fr 1fr;
  transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
}
.qv-overlay.open .qv-modal { transform: translateY(0); }
.qv-modal .qv-image {
  display: grid; place-items: center; padding: 40px;
  background: var(--border-light); position: relative;
}
.qv-modal .qv-image img { width: 100%; max-height: 380px; object-fit: contain; }
.qv-modal .qv-info { padding: 40px 32px; display: flex; flex-direction: column; gap: 14px; }
.qv-modal .qv-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  cursor: pointer; display: grid; place-items: center; transition: all 0.15s;
  z-index: 2;
}
.qv-modal .qv-close:hover { background: var(--border-light); }

.spec-tag {
  padding: 4px 9px; border-radius: 5px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  color: var(--fg-secondary); letter-spacing: -0.01em;
}

@media (max-width: 1024px) {
  .qv-modal { grid-template-columns: 1fr; max-height: 90vh; }
  .qv-modal .qv-image { padding: 24px; }
  .qv-modal .qv-info { padding: 20px 24px 32px; }
}
</style>
