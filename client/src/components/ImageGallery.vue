<template>
  <div class="gallery">
    <div class="main-image" @click="openViewer">
      <button v-if="images.length > 1" class="nav-btn nav-prev" @click.stop="prevImage" aria-label="Anterior">‹</button>
      <img :src="currentImage" :alt="alt" />
      <button v-if="images.length > 1" class="nav-btn nav-next" @click.stop="nextImage" aria-label="Siguiente">›</button>
      <div class="click-hint">Presiona para ampliar</div>
    </div>
    <div v-if="images.length > 1" class="thumbs-wrapper">
      <button v-if="images.length > 4" class="scroll-btn scroll-left" @click="scrollThumbs(-1)" aria-label="Anterior">‹</button>
      <div class="thumbs" ref="thumbsRef">
        <div
          v-for="(img, idx) in images"
          :key="idx"
          :class="['thumb-item', { active: currentIdx === idx }]"
          @click="setImage(idx)"
        >
          <img :src="img.url || img" :alt="'Vista ' + (idx + 1)" loading="lazy" />
        </div>
      </div>
      <button v-if="images.length > 4" class="scroll-btn scroll-right" @click="scrollThumbs(1)" aria-label="Siguiente">›</button>
    </div>
    <Teleport to="body">
      <div v-if="showViewer" ref="viewerOverlay" class="viewer-overlay" tabindex="0"
        @click.self="closeViewer"
        @keydown="onViewerKeydown"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
        @wheel.passive="onWheel">
        <button class="viewer-close" @click.stop="closeViewer" aria-label="Cerrar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button v-if="images.length > 1" class="viewer-nav viewer-prev" @click.stop="prevImage" aria-label="Anterior">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-if="images.length > 1" class="viewer-nav viewer-next" @click.stop="nextImage" aria-label="Siguiente">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="viewer-image-wrapper" @mousedown.prevent="onViewerMouseDown" @dblclick="zoomToggle" :class="{ grabbing: isDragging }" :style="{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : '' }">
          <img :src="currentImage" :alt="alt" class="viewer-image" :class="{ dragging: isDragging }" :style="viewerTransform" draggable="false" />
        </div>
        <div class="viewer-controls">
          <button class="ctrl-btn" @click.stop="zoomOut" aria-label="Alejar" :disabled="scale <= 1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
          <button class="ctrl-btn" @click.stop="zoomIn" aria-label="Acercar" :disabled="scale >= 10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="ctrl-btn ctrl-reset" @click.stop="resetZoom" aria-label="Restaurar" :disabled="scale <= 1 && translateX === 0 && translateY === 0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
        </div>
        <div v-if="images.length > 1" class="viewer-bottom">
          <div class="viewer-counter">{{ currentIdx + 1 }} / {{ images.length }}</div>
          <div class="viewer-thumbs">
            <div
              v-for="(img, idx) in images"
              :key="idx"
              :class="['viewer-thumb', { active: currentIdx === idx }]"
              @click.stop="setImage(idx)"
            >
              <img :src="img.url || img" :alt="'Vista ' + (idx + 1)" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  alt: { type: String, default: '' },
})

const currentIdx = ref(0)
const thumbsRef = ref(null)

const currentImage = computed(() => {
  const img = props.images[currentIdx.value]
  if (!img) return 'https://placehold.co/800x600/e8effe/0052ff?text=PCManager'
  return img.url || img
})

// Viewer state
const showViewer = ref(false)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const viewerOverlay = ref(null)

// Touch state
let touchStartX = 0
let touchStartTime = 0
let lastPinchDist = 0
let isPinching = false

// Drag state
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0

function setImage(idx) {
  currentIdx.value = idx
  if (showViewer.value) resetZoom()
}

function prevImage() {
  currentIdx.value = currentIdx.value > 0 ? currentIdx.value - 1 : props.images.length - 1
  if (showViewer.value) resetZoom()
}

function nextImage() {
  currentIdx.value = currentIdx.value < props.images.length - 1 ? currentIdx.value + 1 : 0
  if (showViewer.value) resetZoom()
}

function scrollThumbs(dir) {
  if (!thumbsRef.value) return
  thumbsRef.value.scrollBy({ left: dir * 160, behavior: 'smooth' })
}

function openViewer() {
  showViewer.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => viewerOverlay.value?.focus())
}

function closeViewer() {
  showViewer.value = false
  document.body.style.overflow = ''
  resetZoom()
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function zoomIn() {
  scale.value = Math.min(10, scale.value + 0.5)
}

function zoomOut() {
  scale.value = Math.max(1, scale.value - 0.5)
  if (scale.value <= 1) resetZoom()
}

function zoomToggle() {
  if (scale.value > 1) {
    resetZoom()
  } else {
    scale.value = 2.5
    translateX.value = 0
    translateY.value = 0
  }
}

const viewerTransform = computed(() => {
  if (scale.value === 1 && translateX.value === 0 && translateY.value === 0) return {}
  return {
    transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})`,
  }
})

function onWheel(e) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const next = Math.max(1, Math.min(10, scale.value + delta))
  scale.value = next
  if (next <= 1) resetZoom()
}

function onViewerMouseDown(e) {
  if (scale.value <= 1) return
  isDragging.value = true
  dragStartX = e.clientX - translateX.value
  dragStartY = e.clientY - translateY.value

  const onMove = (ev) => {
    if (!isDragging.value) return
    translateX.value = ev.clientX - dragStartX
    translateY.value = ev.clientY - dragStartY
  }

  const onUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onTouchStart(e) {
  const t = e.touches
  if (t.length === 1) {
    touchStartX = t[0].clientX
    touchStartTime = Date.now()
    dragStartX = t[0].clientX - translateX.value
    dragStartY = t[0].clientY - translateY.value
    isPinching = false
  } else if (t.length === 2) {
    isPinching = true
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    lastPinchDist = Math.sqrt(dx * dx + dy * dy)
  }
}

function onTouchMove(e) {
  const t = e.touches
  if (t.length === 2 && isPinching) {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (lastPinchDist > 0) {
      scale.value = Math.max(1, Math.min(10, scale.value * (dist / lastPinchDist)))
    }
    lastPinchDist = dist
  } else if (t.length === 1 && scale.value > 1) {
    translateX.value = t[0].clientX - dragStartX
    translateY.value = t[0].clientY - dragStartY
  }
}

function onTouchEnd(e) {
  if (!isPinching && scale.value <= 1 && e.changedTouches.length === 1) {
    const dt = Date.now() - touchStartTime
    const dx = e.changedTouches[0].clientX - touchStartX
    if (dt < 300 && Math.abs(dx) > 40) {
      if (dx < 0) nextImage()
      else prevImage()
    }
  }
  isPinching = false
}

function onViewerKeydown(e) {
  if (e.key === 'Escape') closeViewer()
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevImage() }
  if (e.key === 'ArrowRight') { e.preventDefault(); nextImage() }
}
</script>

<style scoped>
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
}
.click-hint {
  position: absolute; bottom: 14px; right: 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 5px 10px;
  font-size: 11px; color: var(--muted); pointer-events: none;
  transition: opacity 0.2s;
}
.main-image:hover .click-hint { opacity: 0; }

.nav-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--fg); font-size: 22px; line-height: 1;
  cursor: pointer; z-index: 2; display: grid; place-items: center;
  transition: all 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.nav-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
.nav-prev { left: 12px; }
.nav-next { right: 12px; }

.thumbs-wrapper {
  display: flex; align-items: center; gap: 8px; margin-top: 14px;
}
.thumbs {
  display: flex; gap: 10px; overflow-x: auto; scroll-behavior: smooth;
  scrollbar-width: none; flex: 1;
}
.thumbs::-webkit-scrollbar { display: none; }

.scroll-btn {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--muted); font-size: 18px; line-height: 1;
  cursor: pointer; display: grid; place-items: center;
  transition: all 0.18s; flex-shrink: 0;
}
.scroll-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.thumb-item {
  width: 76px; height: 76px; border-radius: var(--radius-md);
  border: 2px solid var(--border); background: var(--surface);
  cursor: pointer; display: grid; place-items: center;
  transition: all 0.18s; overflow: hidden; flex-shrink: 0;
}
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }
.thumb-item.active { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.thumb-item:hover { border-color: var(--accent); }

/* Viewer */
.viewer-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.93);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  outline: none;
  -webkit-user-select: none; user-select: none;
  touch-action: none;
}
.viewer-close {
  position: absolute; top: 16px; right: 16px;
  width: 44px; height: 44px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.12);
  color: #fff; cursor: pointer; z-index: 10;
  display: grid; place-items: center;
  transition: background 0.18s;
}
.viewer-close:hover { background: rgba(255,255,255,0.25); }

.viewer-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 48px; height: 48px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.12);
  color: #fff; cursor: pointer; z-index: 10;
  display: grid; place-items: center;
  transition: background 0.18s;
}
.viewer-nav:hover { background: rgba(255,255,255,0.25); }
.viewer-prev { left: 16px; }
.viewer-next { right: 16px; }

.viewer-controls {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px); margin-bottom: 4px;
}
.ctrl-btn {
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: transparent; color: #fff;
  cursor: pointer; display: grid; place-items: center;
  transition: background 0.15s; flex-shrink: 0;
}
.ctrl-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); }
.ctrl-btn:disabled { opacity: 0.3; cursor: default; }
.ctrl-reset svg { stroke-width: 2.2; }
.zoom-level {
  min-width: 44px; text-align: center;
  font-size: 13px; font-weight: 600; color: #fff;
  font-variant-numeric: tabular-nums;
}

.viewer-image-wrapper {
  flex: 1; width: 100%; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.viewer-image-wrapper.grabbing { cursor: grabbing !important; }
.viewer-image {
  display: block; max-width: 100%; max-height: 100%;
  object-fit: contain; will-change: transform;
}
.viewer-image.dragging { transition: none; }

.viewer-bottom {
  width: 100%; padding: 12px 16px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.viewer-counter {
  color: rgba(255,255,255,0.6); font-size: 13px;
  font-weight: 500; letter-spacing: 0.02em;
}
.viewer-thumbs {
  display: flex; gap: 8px; overflow-x: auto;
  scrollbar-width: none; max-width: 100%;
  padding: 0 16px;
}
.viewer-thumbs::-webkit-scrollbar { display: none; }
.viewer-thumb {
  width: 52px; height: 52px; border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.2);
  overflow: hidden; cursor: pointer; flex-shrink: 0;
  transition: border-color 0.15s;
}
.viewer-thumb img { width: 100%; height: 100%; object-fit: cover; }
.viewer-thumb.active { border-color: var(--accent); }
.viewer-thumb:hover { border-color: rgba(255,255,255,0.5); }

@media (max-width: 640px) {
  .viewer-nav { width: 40px; height: 40px; }
  .viewer-nav svg { width: 24px; height: 24px; }
  .viewer-prev { left: 8px; }
  .viewer-next { right: 8px; }
  .viewer-image-wrapper { padding: 8px; }
  .viewer-thumb { width: 44px; height: 44px; }
  .viewer-controls { padding: 6px 10px; gap: 4px; }
  .ctrl-btn { width: 32px; height: 32px; }
  .ctrl-btn svg { width: 18px; height: 18px; }
  .zoom-level { min-width: 36px; font-size: 12px; }
}
</style>
