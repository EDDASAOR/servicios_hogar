<template>
  <div class="auth-page">
    <!-- Left panel — solo desktop -->
    <div class="auth-left">
      <div class="auth-left__overlay"></div>
      <img src="/hero_banner.png" alt="HogarPro servicios" class="auth-left__img" />
      <div class="auth-left__content">
        <router-link to="/" class="auth-logo">
          <div class="auth-logo__icon">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <span>Hogar<strong>Pro</strong></span>
        </router-link>
        <h2 class="auth-left__title">Soluciones expertas para tu hogar</h2>
        <p class="auth-left__desc">Plomería · Electricidad · Aire Acondicionado</p>
        <div class="auth-left__badges">
          <span class="auth-badge">✓ Técnicos Certificados</span>
          <span class="auth-badge">✓ Garantía 30 días</span>
          <span class="auth-badge">✓ Atención 24/7</span>
        </div>
      </div>
    </div>

    <!-- Right panel — formulario -->
    <div class="auth-right">
      <div class="auth-form-wrap">
        <!-- Logo móvil -->
        <router-link to="/" class="auth-mobile-logo">
          <div class="auth-logo__icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <span>Hogar<strong>Pro</strong></span>
        </router-link>

        <h1 class="auth-form__title">{{ isLogin ? 'Bienvenido de vuelta' : 'Crear tu cuenta' }}</h1>
        <p class="auth-form__subtitle">{{ isLogin ? 'Ingresa a tu panel de clientes' : 'Regístrate gratis en menos de 1 minuto' }}</p>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button :class="['auth-tab', isLogin && 'active']" @click="isLogin = true">Iniciar Sesión</button>
          <button :class="['auth-tab', !isLogin && 'active']" @click="isLogin = false">Registrarse</button>
        </div>

        <!-- Error alert -->
        <div v-if="error" class="alert alert-error anim-scale-in">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error }}
        </div>

        <!-- Success alert -->
        <div v-if="success" class="alert alert-success anim-scale-in">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ success }}
        </div>

        <!-- Form -->
        <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="auth-form">
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Nombre completo</label>
            <input v-model="form.name" type="text" class="form-input" placeholder="Ej: Juan García" required autocomplete="name" />
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="tu@correo.com" required autocomplete="email" />
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label class="form-label">Contraseña</label>
              <a v-if="isLogin" href="#" class="auth-forgot">¿Olvidaste la contraseña?</a>
            </div>
            <div class="auth-pw-wrap">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="form-input" placeholder="Mínimo 6 caracteres" required autocomplete="current-password" />
              <button type="button" class="auth-pw-toggle" @click="showPw = !showPw" tabindex="-1">
                <svg v-if="!showPw" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%; margin-top:8px;" :disabled="loading">
            <span v-if="loading" class="anim-spin" style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;display:inline-block;"></span>
            <span v-else>{{ isLogin ? 'Ingresar al portal' : 'Crear cuenta gratis' }}</span>
          </button>
        </form>

        <div class="divider" style="margin:20px 0;">o contáctanos por</div>

        <a href="https://wa.me/1234567890" class="btn btn-md" style="width:100%;background:#25D366;color:white;font-weight:600;gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Continuar por WhatsApp
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router    = useRouter();
const authStore = useAuthStore();
const isLogin   = ref(true);
const showPw    = ref(false);
const loading   = ref(false);
const error     = ref('');
const success   = ref('');
const form      = reactive({ name: '', email: '', password: '' });

const handleLogin = async () => {
  error.value = ''; success.value = '';
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    if (authStore.user?.rol === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Credenciales incorrectas. Verifica tu email y contraseña.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  error.value = ''; success.value = '';
  if (form.password.length < 6) { error.value = 'La contraseña debe tener al menos 6 caracteres.'; return; }
  loading.value = true;
  try {
    await authStore.register(form.name, form.email, form.password, '');
    success.value = '¡Cuenta creada exitosamente! Iniciando sesión...';
    setTimeout(() => router.push('/'), 1500);
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al crear la cuenta. El correo puede ya estar registrado.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: calc(100vh - 68px);
}

/* Left panel */
.auth-left {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
@media (max-width: 767px) { .auth-left { display: none; } }

.auth-left__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.auth-left__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%);
  z-index: 1;
}
.auth-left__content {
  position: relative;
  z-index: 2;
  padding: 48px;
  width: 100%;
}
.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 48px;
}
.auth-logo__icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-left__title { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 8px; }
.auth-left__desc  { font-size: 1rem; color: rgba(255,255,255,0.65); margin-bottom: 24px; }
.auth-left__badges { display: flex; flex-direction: column; gap: 10px; }
.auth-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  font-size: 0.875rem;
  color: white;
  backdrop-filter: blur(8px);
  width: fit-content;
}

/* Right panel */
.auth-right {
  width: 100%;
  max-width: 480px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}
@media (max-width: 767px) { .auth-right { max-width: 100%; } }

.auth-form-wrap { width: 100%; max-width: 380px; }
.auth-mobile-logo {
  display: none;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 28px;
}
@media (max-width: 767px) { .auth-mobile-logo { display: flex; } }

.auth-form__title    { font-size: 1.625rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.auth-form__subtitle { font-size: 0.875rem; color: #64748b; margin-bottom: 24px; }

/* Tabs */
.auth-tabs {
  display: flex;
  background: #f8fafc;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
  gap: 4px;
}
.auth-tab {
  flex: 1;
  padding: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 7px;
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.auth-tab.active { background: white; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

/* PW toggle */
.auth-pw-wrap { position: relative; }
.auth-pw-wrap .form-input { padding-right: 44px; }
.auth-pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.auth-pw-toggle:hover { color: #475569; }
.auth-forgot { font-size: 0.8rem; color: #0ea5e9; text-decoration: none; font-weight: 500; }
.auth-forgot:hover { text-decoration: underline; }

/* Form */
.auth-form { display: flex; flex-direction: column; gap: 16px; }
</style>
