<template>
  <div style="min-height:100vh; display:flex; flex-direction:column; background:#f8fafc;">

    <!-- ═══════════ NAVBAR ═══════════ -->
    <header v-if="!isAuthPage" id="main-header" :class="['hp-nav', scrolled && 'hp-nav--scrolled']">
      <nav class="container-app" style="display:flex; align-items:center; justify-content:space-between; height:68px;">

        <!-- Logo -->
        <router-link to="/" class="hp-logo" @click="closeMobile">
          <div class="hp-logo__icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <span class="hp-logo__text">Hogar<span>Pro</span></span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hp-nav__links">
          <router-link to="/" class="hp-nav__link" :class="scrolled ? 'scrolled' : ''">Inicio</router-link>
          <router-link to="/servicios" class="hp-nav__link" :class="scrolled ? 'scrolled' : ''">Servicios</router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link v-if="authStore.user?.rol === 'admin'" to="/admin" class="hp-nav__link" :class="scrolled ? 'scrolled' : ''">Admin</router-link>
            <span class="hp-nav__user">¡Hola, {{ authStore.user?.nombre?.split(' ')[0] || 'Usuario' }}!</span>
            <button @click="handleLogout" class="hp-nav__link hp-nav__logout" :class="scrolled ? 'scrolled' : ''">Salir</button>
          </template>
          <template v-else>
            <router-link to="/login" class="hp-nav__link" :class="scrolled ? 'scrolled' : ''">Iniciar Sesión</router-link>
          </template>

          <router-link to="/solicitar" class="btn btn-primary btn-sm">
            Solicitar Servicio
          </router-link>
        </div>

        <!-- Hamburger -->
        <button class="hp-nav__burger" :class="scrolled ? 'scrolled' : ''" @click="mobileOpen = !mobileOpen" aria-label="Menú">
          <span :class="['hp-burger__bar', mobileOpen && 'open-1']"></span>
          <span :class="['hp-burger__bar', mobileOpen && 'open-2']"></span>
          <span :class="['hp-burger__bar', mobileOpen && 'open-3']"></span>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <transition name="slide">
        <div v-if="mobileOpen" class="hp-mobile-menu">
          <router-link to="/" class="hp-mobile__link" @click="closeMobile">🏠 Inicio</router-link>
          <router-link to="/servicios" class="hp-mobile__link" @click="closeMobile">🔧 Servicios</router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link v-if="authStore.user?.rol === 'admin'" to="/admin" class="hp-mobile__link" @click="closeMobile">⚙️ Panel Admin</router-link>
            <button @click="handleLogout" class="hp-mobile__link hp-mobile__logout">🚪 Cerrar Sesión</button>
          </template>
          <template v-else>
            <router-link to="/login" class="hp-mobile__link" @click="closeMobile">🔑 Iniciar Sesión</router-link>
          </template>
          <router-link to="/solicitar" class="btn btn-primary btn-md" style="width:100%; margin-top:8px;" @click="closeMobile">
            Solicitar Servicio
          </router-link>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main :style="{ flex: 1, paddingTop: isAuthPage ? '0' : '68px' }">
      <!-- Spinner mientras se verifica la sesión guardada -->
      <div v-if="!authStore.authReady" class="auth-loading">
        <div class="auth-spinner"></div>
      </div>
      <router-view v-else v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- ═══════════ FOOTER ═══════════ -->
    <footer v-if="!isAuthPage" class="hp-footer">
      <div class="container-app">
        <div class="hp-footer__grid">

          <!-- Brand -->
          <div class="hp-footer__brand">
            <router-link to="/" class="hp-logo" style="margin-bottom:16px;">
              <div class="hp-logo__icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>
              <span class="hp-logo__text">Hogar<span>Pro</span></span>
            </router-link>
            <p class="hp-footer__desc">Expertos en plomería, electricidad y aire acondicionado. Soluciones profesionales con garantía de satisfacción.</p>
            <div class="hp-footer__social">
              <a href="#" class="hp-social__btn" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/1234567890" class="hp-social__btn" aria-label="WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="#" class="hp-social__btn" aria-label="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div>
            <h4 class="hp-footer__heading">Navegación</h4>
            <ul class="hp-footer__list">
              <li><router-link to="/">Inicio</router-link></li>
              <li><router-link to="/servicios">Servicios</router-link></li>
              <li><router-link to="/solicitar">Solicitar Cita</router-link></li>
              <li><router-link to="/login">Panel Cliente</router-link></li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4 class="hp-footer__heading">Servicios</h4>
            <ul class="hp-footer__list">
              <li><a href="#">Plomería 24/7</a></li>
              <li><a href="#">Electricidad</a></li>
              <li><a href="#">Aire Acondicionado</a></li>
              <li><a href="#">Mantenimiento preventivo</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="hp-footer__heading">Contacto</h4>
            <ul class="hp-footer__contact">
              <li>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0ea5e9" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                info@hogarpro.com
              </li>
              <li>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#10b981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +1 234 567 890
              </li>
              <li>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Atención 24 / 7
              </li>
            </ul>
          </div>
        </div>

        <div class="hp-footer__bottom">
          <span>© 2026 HogarPro. Todos los derechos reservados.</span>
          <div class="hp-footer__bottom-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Bot Botpress (reemplaza el FAB de WhatsApp) -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const mobileOpen = ref(false);
const scrolled = ref(false);

const isAuthPage = computed(() => ['/login', '/admin'].includes(route.path));

const onScroll = () => { scrolled.value = window.scrollY > 50; };
onMounted(async () => {
  // Verificar sesión guardada. Hasta que termine, App.vue muestra un spinner
  // en lugar del contenido, evitando condiciones de carrera.
  await authStore.initAuth();
  // Después de auth listo, si estamos en una ruta protegida y no hay sesión,
  // el guard del router re-evalúa y redirige correctamente.
  if (route.meta.requiresAuth && !authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));

const closeMobile = () => { mobileOpen.value = false; };
const handleLogout = () => { authStore.logout(); router.push('/'); closeMobile(); };
</script>

<style scoped>
/* ── Navbar ── */
.hp-nav {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 1000;
  background: white; /* Always solid by default */
  box-shadow: 0 1px 0 rgba(0,0,0,0.08); /* slight border */
  transition: all 0.35s ease;
}
.hp-nav--scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.06);
}

/* Logo */
.hp-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.hp-logo__icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14,165,233,0.35);
  transition: transform 0.3s ease;
}
.hp-logo:hover .hp-logo__icon { transform: scale(1.08) rotate(-4deg); }
.hp-logo__text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  transition: color 0.3s;
}
.hp-logo__text span { color: #10b981; }

/* Nav Links */
.hp-nav__links {
  display: flex;
  align-items: center;
  gap: 4px;
}
@media (max-width: 767px) { .hp-nav__links { display: none; } }

.hp-nav__link {
  padding: 8px 14px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}
.hp-nav__link:hover,
.hp-nav__link.router-link-active { color: #0ea5e9; background: rgba(14,165,233,0.08); }
.hp-nav__logout { color: #ef4444 !important; }
.hp-nav__user {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  padding: 0 8px;
}

/* Hamburger */
.hp-nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.hp-nav__burger:hover { background: rgba(0,0,0,0.06); }
@media (max-width: 767px) { .hp-nav__burger { display: flex; } }

.hp-burger__bar {
  width: 22px;
  height: 2px;
  background: #1e293b;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}
.open-1 { transform: rotate(45deg) translate(5px, 5px); }
.open-2 { opacity: 0; transform: scaleX(0); }
.open-3 { transform: rotate(-45deg) translate(5px, -5px); }

/* Mobile Menu */
.hp-mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 16px;
  background: white;
  border-top: 1px solid #f1f5f9;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.hp-mobile__link {
  display: block;
  padding: 12px 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}
.hp-mobile__link:hover { background: #f8fafc; color: #0ea5e9; }
.hp-mobile__logout { color: #ef4444 !important; }

/* Footer */
.hp-footer { background: #0f172a; color: white; padding: 64px 0 0; }
.hp-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
@media (max-width: 1023px) { .hp-footer__grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
@media (max-width: 639px)  { .hp-footer__grid { grid-template-columns: 1fr; gap: 24px; } }

.hp-footer__brand .hp-logo__text { color: white; }
.hp-footer__desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #64748b;
  max-width: 320px;
  margin-bottom: 20px;
}
.hp-footer__social { display: flex; gap: 10px; }
.hp-social__btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  text-decoration: none;
}
.hp-social__btn:hover { background: #0ea5e9; color: white; transform: translateY(-2px); }

.hp-footer__heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  margin-bottom: 16px;
}
.hp-footer__list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.hp-footer__list a {
  font-size: 0.875rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}
.hp-footer__list a:hover { color: white; }

.hp-footer__contact { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.hp-footer__contact li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #94a3b8;
}

.hp-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 0.8125rem;
  color: #475569;
  gap: 16px;
  flex-wrap: wrap;
}
.hp-footer__bottom-links { display: flex; gap: 20px; }
.hp-footer__bottom-links a { color: #475569; text-decoration: none; transition: color 0.2s; }
.hp-footer__bottom-links a:hover { color: white; }

/* Auth loading spinner */
.auth-loading {
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(14, 165, 233, 0.2);
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: auth-spin 0.7s linear infinite;
}
@keyframes auth-spin { to { transform: rotate(360deg); } }

</style>