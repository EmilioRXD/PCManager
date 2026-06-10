<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <div class="text-center q-mb-lg">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="q-mb-sm">
          <path d="M8 36c4-12 8-20 16-24 4 6 8 12 8 20-4 4-8 8-16 8s-12-4-8-4z" fill="var(--accent)" opacity="0.2"/>
          <path d="M12 38c4-8 8-16 16-20 4 4 8 8 8 16-4 4-8 6-14 6s-10-2-10-2z" fill="var(--accent)"/>
          <circle cx="18" cy="16" r="3" fill="var(--accent-2)"/>
          <circle cx="30" cy="20" r="2" fill="var(--accent-2)"/>
        </svg>
        <div class="text-h5 text-weight-bold" style="letter-spacing:-0.02em;">Panel de Administración</div>
        <div class="text-body2 text-grey">PCManager</div>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="q-mb-md">
          <label class="form-label" for="email">Email</label>
          <input class="input" id="email" v-model="email" type="email" placeholder="admin@pcmanager.com" autocomplete="email" />
        </div>

        <div class="q-mb-lg">
          <label class="form-label" for="password">Contraseña</label>
          <input class="input" id="password" v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;" :disabled="submitting">
          {{ submitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="errorMsg" class="text-negative text-center q-mt-md text-sm">
          <AppIcon name="error" size="xs" class="q-mr-xs" />{{ errorMsg }}
        </div>
      </form>

      <div class="divider q-my-lg" />

      <div class="text-center">
        <router-link to="/" class="btn btn-ghost">Volver al catálogo</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Email y contraseña son requeridos'
    return
  }
  submitting.value = true
  errorMsg.value = ''
  try {
    await authStore.loginAction({ email: email.value, password: password.value })
    $q.notify({ type: 'positive', message: 'Inicio de sesión exitoso', icon: 'check_circle' })
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Error al iniciar sesión'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--gradient-hero); position: relative; overflow: hidden;
}
.login-wrapper::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 50% 30%, rgba(0,82,255,0.05), transparent),
    radial-gradient(ellipse 400px 300px at 80% 70%, rgba(0,198,255,0.04), transparent);
}
.login-card {
  width: 100%; max-width: 400px; padding: 40px 32px;
  position: relative; z-index: 1;
}
.text-negative { color: var(--danger); }
</style>
