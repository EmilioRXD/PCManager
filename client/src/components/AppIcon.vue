<template>
  <span class="material-symbols-outlined app-icon" :style="iconStyle" v-bind="$attrs">{{ name }}</span>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
  color: { type: String, default: null },
})

const iconStyle = {
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color || undefined,
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
}
</script>

<style>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
