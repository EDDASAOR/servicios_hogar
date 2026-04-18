import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/servicios',
    name: 'Services',
    component: () => import('../views/Services.vue')
  },
  {
    path: '/solicitar',
    name: 'RequestService',
    component: () => import('../views/RequestService.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global: solo redirige si authReady = true (auth ya terminó de verificar).
// Esto evita redirecciones prematuras mientras initAuth() está en curso.
router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true
  const authStore = useAuthStore()
  if (authStore.authReady && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
