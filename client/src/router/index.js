import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'catalog',
        component: () => import('../pages/public/CatalogPage.vue'),
      },
      {
        path: 'equipo/:id',
        name: 'product-detail',
        component: () => import('../pages/public/ProductDetailPage.vue'),
      },
      {
        path: 'buscar',
        name: 'search',
        component: () => import('../pages/public/SearchResultsPage.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../pages/admin/LoginPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-equipos',
        component: () => import('../pages/admin/EquiposPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'admin-login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
