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
      <div class="header-search">
        <div class="search-wrap">
          <AppIcon name="search" size="18px" class="search-icon" color="grey-6" />
          <input
            class="input"
            v-model="searchQuery"
            placeholder="Buscar equipos..."
            type="text"
            autocomplete="off"
            @keyup.enter="doSearch"
            @input="debouncedSearch"
          />
        </div>
      </div>
    </header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="trust-stripe">
      <div class="trust-item">
        <div class="trust-icon"><AppIcon name="verified_user" size="20px" /></div>
        <div><strong>Garantía incluida</strong>Todos los equipos verificados</div>
      </div>
      <div class="trust-item">
        <div class="trust-icon"><AppIcon name="local_shipping" size="20px" /></div>
        <div><strong>Envío gratis nacional</strong>Empaque anti-impacto</div>
      </div>
      <div class="trust-item">
        <div class="trust-icon"><AppIcon name="build" size="20px" /></div>
        <div><strong>32 puntos de inspección</strong>Pantalla, batería, teclado, puertos</div>
      </div>
      <div class="trust-item">
        <div class="trust-icon"><AppIcon name="chat" size="20px" /></div>
        <div><strong>Soporte por WhatsApp</strong>Respuesta en menos de 24h</div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
let debounceTimer = null

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'catalog', query: { search: searchQuery.value } })
  }
}

function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      doSearch()
    }
  }, 400)
}
</script>

<style scoped>
.brand-link { text-decoration: none; color: var(--fg); }
.brand-name { font-weight: 700; font-size: 16px; letter-spacing: -0.02em; }
.header-search { flex: 1; max-width: 480px; margin: 0 32px; position: relative; }
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); z-index: 1; }
.header-search .input { padding-left: 42px; }
.header-btn { font-size: 13px; padding: 8px 16px; text-decoration: none; color: var(--fg); display: inline-flex; align-items: center; }

.trust-stripe {
  display: flex; align-items: center; justify-content: center; gap: 48px;
  padding: 32px; border-top: 1px solid var(--border); flex-wrap: wrap;
}
.trust-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); }
.trust-item .trust-icon {
  width: 40px; height: 40px; border-radius: var(--radius-sm);
  background: var(--accent-glow); color: var(--accent);
  display: grid; place-items: center; flex-shrink: 0;
}
.trust-item strong { display: block; color: var(--fg); font-size: 14px; }

@media (max-width: 1024px) {
  .header-search { margin: 0 16px; }
  .trust-stripe { gap: 24px; }
}
@media (max-width: 640px) {
  .trust-stripe { flex-direction: column; align-items: flex-start; gap: 16px; }
}
</style>
