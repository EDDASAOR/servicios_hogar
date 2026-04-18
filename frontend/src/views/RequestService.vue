<template>
  <div class="rq-page">
    <!-- Header -->
    <div class="rq-header">
      <div class="container-app">
        <div class="section-label" style="margin-bottom:12px;">Agenda Online</div>
        <h1 class="rq-header__title">Solicitar Servicio</h1>
        <p class="rq-header__desc">Completa el formulario y te confirmamos en menos de 15 minutos.</p>
      </div>
    </div>

    <div class="container-app rq-body">
      <!-- Pasos -->
      <div class="rq-steps">
        <div v-for="(s, i) in steps" :key="i" :class="['rq-step', currentStep === i && 'active', currentStep > i && 'done']">
          <div class="rq-step__circle">
            <svg v-if="currentStep > i" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="rq-step__label">{{ s }}</span>
          <div v-if="i < steps.length - 1" class="rq-step__line"></div>
        </div>
      </div>

      <div class="rq-main">
        <!-- Formulario -->
        <div class="rq-form-col">

          <!-- Step 1 — Servicio -->
          <div v-if="currentStep === 0" class="rq-card anim-fade-up">
            <h2 class="rq-card__title">¿Qué servicio necesitas?</h2>

            <div class="rq-service-grid">
              <div v-for="svc in services" :key="svc.id"
                   :class="['rq-svc', form.serviceType === svc.id && 'selected']"
                   :style="form.serviceType === svc.id ? { borderColor: svc.color, background: svc.light } : {}"
                   @click="form.serviceType = svc.id">
                <div class="rq-svc__icon" :style="{ background: svc.color }">
                  <svg :viewBox="svc.icon.vb" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="svc.icon.p"/>
                  </svg>
                </div>
                <div class="rq-svc__name">{{ svc.name }}</div>
                <div class="rq-svc__price">Desde {{ svc.price }}</div>
                <div v-if="form.serviceType === svc.id" class="rq-svc__check" :style="{ background: svc.color }">✓</div>
              </div>
            </div>

            <div class="form-group" style="margin-top:20px;">
              <label class="form-label">Urgencia</label>
              <div class="rq-urgency">
                <label :class="['rq-urgency-opt', form.priority === 'normal' && 'active-green']">
                  <input type="radio" v-model="form.priority" value="normal" style="display:none;" />
                  <span>🗓 Normal (24-48 h)</span>
                </label>
                <label :class="['rq-urgency-opt', form.priority === 'urgent' && 'active-red']">
                  <input type="radio" v-model="form.priority" value="urgent" style="display:none;" />
                  <span>🚨 Urgente (menos de 2 h)</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Describe el problema</label>
              <textarea v-model="form.description" class="form-input form-textarea" placeholder="Ej: Tengo una fuga de agua debajo del lavabo de la cocina que lleva 2 días..." rows="4"></textarea>
            </div>

            <button :disabled="!form.serviceType" class="btn btn-primary btn-lg" style="width:100%;" @click="currentStep = 1">
              Continuar →
            </button>
          </div>

          <!-- Step 2 — Fecha y datos -->
          <div v-if="currentStep === 1" class="rq-card anim-fade-up">
            <h2 class="rq-card__title">Datos de contacto y fecha</h2>

            <div class="rq-form-grid">
              <div class="form-group">
                <label class="form-label">Nombre completo *</label>
                <input v-model="form.name" class="form-input" type="text" placeholder="Tu nombre completo" required />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono de contacto *</label>
                <input v-model="form.phone" class="form-input" type="tel" placeholder="+1 234 567 890" required />
              </div>
              <div class="form-group" style="grid-column:1/-1;">
                <label class="form-label">Dirección / Ubicación *</label>
                <input v-model="form.address" class="form-input" type="text" placeholder="Calle, número, colonia, ciudad" required />
              </div>
              <div class="form-group">
                <label class="form-label">Fecha preferida *</label>
                <input
                  v-model="form.date"
                  class="form-input"
                  type="date"
                  :min="minDate"
                  :disabled="form.priority === 'urgent'"
                  :title="form.priority === 'urgent' ? 'Los servicios urgentes son siempre para hoy' : ''"
                  required
                />
                <span v-if="form.priority === 'urgent'" class="rq-field-locked">🔒 Bloqueado — servicio urgente</span>
              </div>
              <div class="form-group">
                <label class="form-label">Horario preferido *</label>
                <select
                  v-model="form.time"
                  class="form-input form-select"
                  :disabled="form.priority === 'urgent'"
                  required
                >
                  <option value="">Selecciona horario</option>
                  <option value="08:00">8:00 AM - 10:00 AM</option>
                  <option value="10:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00">12:00 PM - 2:00 PM</option>
                  <option value="14:00">2:00 PM - 4:00 PM</option>
                  <option value="16:00">4:00 PM - 6:00 PM</option>
                  <option v-if="form.date === minDate" value="urgent">🚨 Lo antes posible</option>
                </select>
                <span v-if="form.priority === 'urgent'" class="rq-field-locked">🔒 Bloqueado — se asignará el primer slot disponible</span>
              </div>
            </div>

            <div class="rq-nav-btns">
              <button class="btn btn-secondary btn-lg" @click="currentStep = 0">← Atrás</button>
              <button :disabled="!canProceedStep2" class="btn btn-primary btn-lg" @click="currentStep = 2">Revisar →</button>
            </div>
          </div>

          <!-- Step 3 — Confirmación -->
          <div v-if="currentStep === 2" class="rq-card anim-fade-up">
            <h2 class="rq-card__title">Confirmación</h2>

            <div class="rq-summary">
              <div class="rq-summary__row">
                <span class="rq-summary__key">Servicio</span>
                <span class="rq-summary__val">{{ selectedService?.name }}</span>
              </div>
              <div class="rq-summary__row">
                <span class="rq-summary__key">Urgencia</span>
                <span class="rq-summary__val">{{ form.priority === 'urgent' ? '🚨 Urgente' : '🗓 Normal' }}</span>
              </div>
              <div class="rq-summary__row">
                <span class="rq-summary__key">Nombre</span>
                <span class="rq-summary__val">{{ form.name }}</span>
              </div>
              <div class="rq-summary__row">
                <span class="rq-summary__key">Teléfono</span>
                <span class="rq-summary__val">{{ form.phone }}</span>
              </div>
              <div class="rq-summary__row">
                <span class="rq-summary__key">Dirección</span>
                <span class="rq-summary__val">{{ form.address }}</span>
              </div>
              <div class="rq-summary__row">
                <span class="rq-summary__key">Fecha</span>
                <span class="rq-summary__val">{{ form.date }} — {{ form.time }}</span>
              </div>
              <div v-if="form.description" class="rq-summary__row">
                <span class="rq-summary__key">Descripción</span>
                <span class="rq-summary__val">{{ form.description }}</span>
              </div>
            </div>

            <div v-if="error" class="alert alert-error" style="margin-bottom:16px;">{{ error }}</div>

            <div class="rq-nav-btns">
              <button class="btn btn-secondary btn-lg" @click="currentStep = 1">← Atrás</button>
              <button class="btn btn-primary btn-lg" @click="submit" :disabled="loading">
                <span v-if="loading" class="anim-spin" style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;display:inline-block;"></span>
                <span v-else>Confirmar Cita</span>
              </button>
            </div>
          </div>

          <!-- Success State -->
          <div v-if="submitted" class="rq-success anim-scale-in">
            <div class="rq-success__icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="rq-success__title">¡Solicitud confirmada!</h2>
            <p class="rq-success__desc">Te contactaremos en los próximos 15 minutos para confirmar los detalles. Revisa tu WhatsApp.</p>
            <div class="rq-success__info">
              <strong>Servicio:</strong> {{ selectedService?.name }}<br/>
              <strong>Fecha:</strong> {{ form.date }} — {{ form.time }}
            </div>
            <router-link to="/" class="btn btn-primary btn-lg" style="margin-top:24px;">Volver al inicio</router-link>
          </div>
        </div>

        <!-- Sidebar — Cotizador -->
        <div v-if="!submitted" class="rq-sidebar">
          <div class="rq-quote-card">
            <h3 class="rq-quote__title">💰 Estimado de costo</h3>
            <div v-if="selectedService" class="rq-quote__service" :style="{ color: selectedService.color }">{{ selectedService.name }}</div>
            <div v-else class="rq-quote__placeholder">Selecciona un servicio</div>

            <div class="rq-quote__range">
              <div class="rq-quote__from">
                <div class="rq-quote__label">Precio base</div>
                <div class="rq-quote__amount">{{ estimatedPrice.base }}</div>
              </div>
              <div class="rq-quote__sep">—</div>
              <div class="rq-quote__to">
                <div class="rq-quote__label">Hasta</div>
                <div class="rq-quote__amount">{{ estimatedPrice.max }}</div>
              </div>
            </div>
            <div v-if="form.priority === 'urgent'" class="rq-quote__urgent-note">
              🚨 Se añade recargo de urgencia (+$20)
            </div>
            <p class="rq-quote__note">* Precio final según diagnóstico in situ. Sin costo de visita.</p>
          </div>

          <div class="rq-info-card">
            <div class="rq-info__item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Diagnóstico gratuito
            </div>
            <div class="rq-info__item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Técnico puntual garantizado
            </div>
            <div class="rq-info__item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Garantía 30 días en trabajo
            </div>
          </div>

          <a href="https://wa.me/1234567890" class="btn btn-md" style="width:100%;background:#25D366;color:white;font-weight:600;">
            💬 Chat por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const route  = useRoute();
const authStore  = useAuthStore();
const currentStep = ref(0);
const loading    = ref(false);
const error      = ref('');
const submitted  = ref(false);

// ── Leer query param al montar
onMounted(() => {
  // El router guard ya protege esta ruta — no es necesario verificar isAuthenticated aquí.
  // Pre-seleccionar servicio si viene desde una tarjeta del Home
  const servicioParam = route.query.servicio as string;
  if (servicioParam && ['plomeria', 'electricidad', 'aire'].includes(servicioParam)) {
    form.serviceType = servicioParam;
  }
});

// ── Auto-completar fecha/hora en reservas urgentes
const getNextSlot = (): string => {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const slots = [8, 10, 12, 14, 16];
  const slotValues = ['08:00', '10:00', '12:00', '14:00', '16:00'];
  const idx = slots.findIndex(h => h > currentHour);
  return idx !== -1 ? slotValues[idx] : 'urgent'; // 'urgent' = Lo antes posible
};

const steps = ['Servicio', 'Datos y Fecha', 'Confirmación'];

const form = reactive({
  serviceType: '',
  priority: 'normal',
  description: '',
  name: authStore.user?.nombre || '',
  phone: '',
  address: '',
  date: '',
  time: '',
});

// Watch urgencia: cuando cambia a urgente → bloquea fecha=hoy, hora=Lo antes posible
watch(() => form.priority, (val) => {
  if (val === 'urgent') {
    form.date = minDate;  // siempre hoy
    form.time = 'urgent'; // Lo antes posible (bloqueado)
  } else {
    form.date = '';
    form.time = '';
  }
});

// Watch fecha: si el usuario cambia a un día != hoy y tenía 'Lo antes posible', limpiar hora
watch(() => form.date, (newDate) => {
  if (newDate !== minDate && form.time === 'urgent') {
    form.time = '';
  }
});

const services = [
  { id: 'plomeria',     name: 'Plomería',          price: '$35', color: '#0ea5e9', light: 'rgba(14,165,233,0.08)',  baseMin: 35, baseMax: 120, icon: { vb:'0 0 24 24', p:'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' } },
  { id: 'electricidad', name: 'Electricidad',       price: '$45', color: '#f59e0b', light: 'rgba(245,158,11,0.08)', baseMin: 45, baseMax: 180, icon: { vb:'0 0 24 24', p:'M13 10V3L4 14h7v7l9-11h-7z' } },
  { id: 'aire',         name: 'Aire Acondicionado', price: '$55', color: '#10b981', light: 'rgba(16,185,129,0.08)', baseMin: 55, baseMax: 200, icon: { vb:'0 0 24 24', p:'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' } },
];

const selectedService = computed(() => services.find(s => s.id === form.serviceType));

const estimatedPrice = computed(() => {
  const svc = selectedService.value;
  if (!svc) return { base: '--', max: '--' };
  const surge = form.priority === 'urgent' ? 20 : 0;
  return {
    base: `$${svc.baseMin + surge}`,
    max:  `$${svc.baseMax + surge}`,
  };
});

const minDate = new Date().toISOString().split('T')[0];

const canProceedStep2 = computed(() =>
  form.name.trim() && form.phone.trim() && form.address.trim() && form.date && form.time
);

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const payload = {
      servicio: selectedService.value?.name || form.serviceType,
      descripcion: form.description || `Solicitud de ${selectedService.value?.name}`,
      fechaProgramada: new Date(`${form.date}T${form.time === 'urgent' ? '08:00' : form.time}`).toISOString(),
      direccion: form.address,
      prioridad: form.priority === 'urgent' ? 'urgente' : 'normal',
    };
    await api.post('/appointments', payload);
    submitted.value = true;
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al enviar la solicitud. Por favor intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.rq-page { background: #f8fafc; min-height: calc(100vh - 68px); }

.rq-header {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 64px 0 48px;
  text-align: center;
}
.rq-header__title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 900; color: white; margin-bottom: 12px; }
.rq-header__desc  { font-size: 1.0625rem; color: rgba(255,255,255,0.65); max-width: 480px; margin: 0 auto; }

.rq-body { padding: 48px 16px 80px; }

/* Campos bloqueados en modo urgente */
.form-input:disabled,
.form-select:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 1;
}
.rq-field-locked {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 4px;
  font-weight: 600;
}

/* Steps */
.rq-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 40px;
}
.rq-step {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}
.rq-step__circle {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.3s;
  border: 2px solid transparent;
}
.rq-step.active .rq-step__circle {
  background: #0ea5e9;
  color: white;
  box-shadow: 0 0 0 4px rgba(14,165,233,0.2);
}
.rq-step.done .rq-step__circle {
  background: #10b981;
  color: white;
  border-color: #10b981;
}
.rq-step__label { font-size: 0.8125rem; font-weight: 600; color: #94a3b8; }
.rq-step.active .rq-step__label { color: #0ea5e9; }
.rq-step.done  .rq-step__label  { color: #10b981; }
.rq-step__line {
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
}
@media (max-width: 479px) { .rq-step__label { display: none; } }

.rq-main {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
}
@media (max-width: 1023px) { .rq-main { grid-template-columns: 1fr; } }

/* Card */
.rq-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.rq-card__title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 24px; }

/* Service select */
.rq-service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
@media (max-width: 479px) { .rq-service-grid { grid-template-columns: 1fr; } }
.rq-svc {
  position: relative;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}
.rq-svc:hover { border-color: #cbd5e1; transform: translateY(-2px); }
.rq-svc.selected { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.rq-svc__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.rq-svc__name  { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.rq-svc__price { font-size: 0.75rem; color: #94a3b8; }
.rq-svc__check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Urgency */
.rq-urgency { display: flex; gap: 12px; }
.rq-urgency-opt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.rq-urgency-opt:hover { border-color: #cbd5e1; background: #f8fafc; }
.rq-urgency-opt.active-green { border-color: #10b981; background: rgba(16,185,129,0.08); color: #059669; font-weight: 700; }
.rq-urgency-opt.active-red   { border-color: #ef4444; background: rgba(239,68,68,0.08);  color: #dc2626; font-weight: 700; }

/* Form grid */
.rq-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 599px) { .rq-form-grid { grid-template-columns: 1fr; } }

/* Nav buttons */
.rq-nav-btns { display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end; flex-wrap: wrap; }

/* Summary */
.rq-summary { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 14px; }
.rq-summary__row { display: flex; justify-content: space-between; gap: 12px; font-size: 0.875rem; }
.rq-summary__key { font-weight: 600; color: #64748b; flex-shrink: 0; }
.rq-summary__val { color: #1e293b; text-align: right; }

/* Success */
.rq-success {
  background: white;
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.rq-success__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 32px rgba(16,185,129,0.4);
}
.rq-success__title { font-size: 1.75rem; font-weight: 900; color: #10b981; margin-bottom: 12px; }
.rq-success__desc  { font-size: 0.9375rem; color: #64748b; line-height: 1.6; max-width: 400px; margin: 0 auto 20px; }
.rq-success__info  { background: #f0fdf4; border-radius: 10px; padding: 16px; font-size: 0.875rem; color: #334155; line-height: 1.8; }

/* Sidebar */
.rq-sidebar { display: flex; flex-direction: column; gap: 16px; }

.rq-quote-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.rq-quote__title       { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.rq-quote__service     { font-size: 1.125rem; font-weight: 800; margin-bottom: 16px; }
.rq-quote__placeholder { font-size: 0.875rem; color: #94a3b8; margin-bottom: 16px; }
.rq-quote__range { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 12px; }
.rq-quote__label  { font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
.rq-quote__amount { font-size: 1.5rem; font-weight: 900; color: #0f172a; }
.rq-quote__sep    { font-size: 1.25rem; color: #cbd5e1; }
.rq-quote__urgent-note { font-size: 0.8rem; color: #dc2626; font-weight: 600; margin-bottom: 8px; }
.rq-quote__note   { font-size: 0.75rem; color: #94a3b8; line-height: 1.5; }

.rq-info-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.rq-info__item { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: #334155; font-weight: 500; }
</style>
