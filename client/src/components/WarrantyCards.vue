<template>
  <div class="highlight-cards">
    <div v-for="item in items" :key="item.label" class="highlight-card">
      <div class="hl-icon"><AppIcon :name="item.icon" size="18px" /></div>
      <div class="hl-text">
        <strong>{{ item.label }}</strong>
        {{ item.desc }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<style scoped>
.highlight-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.highlight-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex; gap: 12px; align-items: flex-start;
  background: var(--surface);
  transition: all 0.15s;
}
.highlight-card:hover { border-color: var(--accent-glow); background: var(--gradient-accent-subtle); }
.hl-icon {
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center; flex-shrink: 0;
}
.hl-text { font-size: 13px; line-height: 1.4; color: var(--muted); }
.hl-text strong { display: block; font-size: 14px; color: var(--fg); margin-bottom: 2px; }
@media (max-width: 1024px) { .highlight-cards { grid-template-columns: 1fr; } }
</style>
