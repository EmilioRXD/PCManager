<template>
  <div class="highlight-cards">
    <div v-for="item in items" :key="item.label" class="highlight-item">
      <div class="hl-icon"><AppIcon :name="item.icon" size="1.25rem" /></div>
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
/* Uses global .highlight-cards, .highlight-item, .hl-icon, .hl-text */
</style>
