<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar-admin" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M8 36c4-12 8-20 16-24 4 6 8 12 8 20-4 4-8 8-16 8s-12-4-8-4z" fill="var(--accent)" opacity="0.2"/>
          <path d="M12 38c4-8 8-16 16-20 4 4 8 8 8 16-4 4-8 6-14 6s-10-2-10-2z" fill="var(--accent)"/>
          <circle cx="18" cy="16" r="3" fill="var(--accent-2)"/>
          <circle cx="30" cy="20" r="2" fill="var(--accent-2)"/>
        </svg>
        <span class="brand">PCManager</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Principal</div>
          <router-link to="/admin" class="sidebar-link" exact-active-class="active">
            <AppIcon name="grid_view" size="1.25rem" />
            Catálogo
          </router-link>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Operaciones</div>
          <router-link to="/" tag="a" class="sidebar-link">
            <AppIcon name="store" size="1.25rem" />
            Ver tienda
          </router-link>
        </div>
      </nav>
      <div class="sidebar-footer">
        <a class="sidebar-link logout-link" @click="handleLogout">
          <AppIcon name="logout" size="1.25rem" />
          Cerrar sesión
        </a>
      </div>
    </aside>

    <!-- Overlay -->
    <div class="overlay-admin" :class="{ active: sidebarOpen }" @click="sidebarOpen = false" />

    <!-- Main -->
    <div class="main-admin">
      <header class="header-admin">
        <div class="header-left">
          <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Menú">
            <AppIcon name="menu" size="1.25rem" />
          </button>
          <div class="breadcrumb-admin">
            <router-link to="/">Tienda</router-link> / Gestión / <span class="current-breadcrumb">Catálogo</span>
          </div>
        </div>
        <div class="header-right">
          <div class="user-avatar" title="Admin">{{ initials }}</div>
        </div>
      </header>

      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const initials = computed(() => {
  if (!authStore.user?.nombre) return 'A'
  return authStore.user.nombre.split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2)
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }

.sidebar-admin {
  width: 16.25rem; background: var(--surface); border-right: 0.0625rem solid var(--border);
  display: flex; flex-direction: column;
  position: fixed; inset: 0 auto 0 0; z-index: 50;
  transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
}
.sidebar-header { padding: 1.25rem 1.5rem; border-bottom: 0.0625rem solid var(--border); display: flex; align-items: center; gap: 0.75rem; }
.brand { font-weight: 700; font-size: 1rem; letter-spacing: -0.02em; }
.sidebar-nav { flex: 1; padding: 1rem 0.75rem; overflow-y: auto; }
.nav-section-title {
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--muted-light); padding: 0.75rem 1rem 0.5rem; font-weight: 700;
}
.sidebar-footer { padding: 1rem; border-top: 0.0625rem solid var(--border); }
.logout-link { color: var(--muted); }

.main-admin { flex: 1; margin-left: 16.25rem; min-width: 0; background: var(--bg); }

.header-admin {
  height: 4rem; background: rgba(255,255,255,0.82);
  backdrop-filter: blur(0.75rem); -webkit-backdrop-filter: blur(0.75rem);
  border-bottom: 0.0625rem solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; position: sticky; top: 0; z-index: 40;
}
.header-left { display: flex; align-items: center; gap: 1.25rem; }
.menu-toggle {
  display: none; width: 2.5rem; height: 2.5rem; border-radius: var(--radius-sm);
  border: 0.0625rem solid var(--border); background: var(--surface); color: var(--fg);
  cursor: pointer; align-items: center; justify-content: center;
}
.breadcrumb-admin { font-size: 0.75rem; color: var(--muted); }
.breadcrumb-admin a { color: var(--muted); text-decoration: none; }
.breadcrumb-admin a:hover { color: var(--accent); }
.current-breadcrumb { color: var(--fg); font-weight: 500; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.user-avatar {
  width: 2.25rem; height: 2.25rem; border-radius: 50%;
  background: var(--gradient-accent-subtle); color: var(--accent);
  font-weight: 700; font-size: 0.75rem; display: grid; place-items: center;
  cursor: pointer; border: 0.125rem solid transparent; transition: border-color 0.15s;
}
.user-avatar:hover { border-color: var(--accent); }
.overlay-admin { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 45; backdrop-filter: blur(0.125rem); }
.overlay-admin.active { display: block; }

@media (max-width: 64rem) {
  .sidebar-admin { transform: translateX(-100%); }
  .sidebar-admin.open { transform: translateX(0); }
  .main-admin { margin-left: 0; }
  .menu-toggle { display: inline-flex; }
  .header-admin { padding: 0 1.25rem; }
}
</style>
