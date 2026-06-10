<template>
  <q-layout view="hHh Lpr lff">
    <header class="header">
      <div class="flex items-center gap-6">
        <router-link to="/" class="flex items-center gap-2 brand-link">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <path d="M8 36c4-12 8-20 16-24 4 6 8 12 8 20-4 4-8 8-16 8s-12-4-8-4z" fill="var(--accent)" opacity="0.2"/>
            <path d="M12 38c4-8 8-16 16-20 4 4 8 8 8 16-4 4-8 6-14 6s-10-2-10-2z" fill="var(--accent)"/>
            <circle cx="18" cy="16" r="3" fill="var(--accent-2)"/>
            <circle cx="30" cy="20" r="2" fill="var(--accent-2)"/>
          </svg>
          <span class="font-bold text-lg brand-name">PCManager</span>
        </router-link>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-search-icon" @click="searchOpen = true" aria-label="Buscar">
          <AppIcon name="search" size="20px" />
        </button>
        <SearchOverlay :open="searchOpen" @close="searchOpen = false" />
      </div>
    </header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="trust-stripe">
      <div class="trust-item">
        <div class="hl-icon hl-icon-lg"><AppIcon name="verified_user" size="20px" /></div>
        <div><strong>Garantía incluida</strong>Todos los equipos verificados</div>
      </div>
      <div class="trust-item">
        <div class="hl-icon hl-icon-lg"><AppIcon name="local_shipping" size="20px" /></div>
        <div><strong>Envío gratis nacional</strong>Empaque anti-impacto</div>
      </div>
      <div class="trust-item">
        <div class="hl-icon hl-icon-lg"><AppIcon name="build" size="20px" /></div>
        <div><strong>32 puntos de inspección</strong>Pantalla, batería, teclado, puertos</div>
      </div>
      <div class="trust-item">
        <div class="hl-icon hl-icon-lg"><AppIcon name="chat" size="20px" /></div>
        <div><strong>Soporte por WhatsApp</strong>Respuesta en menos de 24h</div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SearchOverlay from '../components/SearchOverlay.vue'

const searchOpen = ref(false)
</script>

<style scoped>
.brand-link { text-decoration: none; color: var(--fg); }
.brand-name { font-weight: 700; font-size: 16px; letter-spacing: -0.02em; }
.btn-search-icon {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--muted); cursor: pointer;
  display: grid; place-items: center; transition: all 0.15s;
}
.btn-search-icon:hover { border-color: var(--accent); color: var(--accent); }

.trust-stripe {
  display: flex; align-items: center; justify-content: center; gap: 48px;
  padding: 32px; border-top: 1px solid var(--border); flex-wrap: wrap;
}
.trust-item {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: var(--muted);
}
.trust-item strong { display: block; color: var(--fg); font-size: 14px; }

@media (max-width: 640px) {
  .trust-stripe { flex-direction: column; align-items: flex-start; gap: 16px; }
}
</style>
