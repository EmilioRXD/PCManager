<template>
  <div class="specs-grid-detail">
    <div v-for="spec in specs" :key="spec.label" class="spec-item-detail">
      <div class="spec-icon-box"><AppIcon :name="spec.icon" size="20px" /></div>
      <div class="spec-body">
        <span class="spec-label">{{ spec.label }}</span>
        <span class="spec-value">{{ spec.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  specs: { type: Array, required: true },
})
</script>

<style scoped>
.specs-grid-detail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.spec-item-detail {
  display: flex; gap: 14px; align-items: center;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition: all 0.18s;
}
.spec-item-detail:hover {
  border-color: var(--accent-glow);
  box-shadow: var(--shadow-sm);
}
.spec-icon-box {
  width: 42px; height: 42px; border-radius: var(--radius-sm);
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center; flex-shrink: 0;
}
.spec-body { display: flex; flex-direction: column; gap: 3px; }
.spec-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.spec-value { font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: var(--fg); }
@media (max-width: 640px) { .specs-grid-detail { grid-template-columns: 1fr; } }
</style>
