<template>
  <div class="gallery">
    <div class="main-image" @mousemove="onMouseMove" @mouseleave="zoomed = false">
      <img :src="currentImage" :alt="alt" :style="imgTransform" />
      <div class="zoom-hint">Pasa el cursor para ampliar</div>
    </div>
    <div v-if="images.length > 1" class="thumbs">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        :class="['thumb-item', { active: currentIdx === idx }]"
        @click="setImage(idx)"
      >
        <img :src="img.url || img" :alt="'Vista ' + (idx + 1)" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  alt: { type: String, default: '' },
})

const currentIdx = ref(0)
const zoomed = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

const currentImage = computed(() => {
  const first = props.images[0]
  if (!first) return 'https://placehold.co/800x600/e8effe/0052ff?text=PCManager'
  return first.url || first
})

const imgTransform = computed(() => {
  if (!zoomed.value) return {}
  return {
    transform: 'scale(1.8)',
    transformOrigin: `${mouseX.value * 100}% ${mouseY.value * 100}%`,
  }
})

function setImage(idx) {
  currentIdx.value = idx
  zoomed.value = false
}

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width
  mouseY.value = (e.clientY - rect.top) / rect.height
  zoomed.value = true
}
</script>

<style scoped>
.gallery { position: sticky; top: 88px; }
.main-image {
  aspect-ratio: 4/3;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--border-light), var(--surface));
  display: grid; place-items: center;
  position: relative; overflow: hidden;
  cursor: zoom-in;
}
.main-image img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.23,1,0.32,1);
}
.zoom-hint {
  position: absolute; bottom: 14px; right: 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 5px 10px;
  font-size: 11px; color: var(--muted); pointer-events: none;
  transition: opacity 0.2s;
}
.main-image:hover .zoom-hint { opacity: 0; }
.thumbs { display: flex; gap: 10px; margin-top: 14px; }
.thumb-item {
  width: 76px; height: 76px; border-radius: var(--radius-md);
  border: 2px solid var(--border); background: var(--surface);
  cursor: pointer; display: grid; place-items: center;
  transition: all 0.18s; overflow: hidden;
}
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }
.thumb-item.active { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.thumb-item:hover { border-color: var(--accent); }
</style>
