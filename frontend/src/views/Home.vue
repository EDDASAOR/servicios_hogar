<template>
  <div class="home-page">
    <!-- ══════════════════════════════════════════════
         HERO — Fullscreen Cinematográfico
    ══════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero__bg">
        <img src="/hero_banner.png" alt="Técnico profesional HogarPro" class="hero__img" />
        <div class="hero__overlay"></div>
      </div>

      <div class="container-app hero__content">
        <div class="hero__left anim-fade-up">
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            Servicio Profesional 24/7
          </div>

          <h1 class="hero__title">
            Soluciones<br/>
            <span class="gradient-text">expertas</span><br/>
            para tu hogar.
          </h1>

          <p class="hero__subtitle">
            Plomería, electricidad y climatización con técnicos certificados.
            Diagnóstico gratis · Precios transparentes · Garantía real.
          </p>

          <div class="hero__actions">
            <router-link to="/solicitar" class="btn btn-primary btn-xl">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Solicitar Servicio
            </router-link>
            <a href="tel:+1234567890" class="btn btn-ghost btn-xl">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Llamar Ahora
            </a>
          </div>

          <div class="hero__stats">
            <div v-for="s in stats" :key="s.value" class="hero__stat">
              <div class="hero__stat-value">{{ s.value }}</div>
              <div class="hero__stat-label">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="hero__scroll">
        <div class="hero__scroll-dot"></div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         TRUST STRIP — Logos/Acreditaciones
    ══════════════════════════════════════════════ -->
    <section class="trust-strip">
      <div class="container-app trust-strip__inner">
        <div v-for="t in trust" :key="t.label" class="trust-strip__item">
          <div class="trust-strip__icon" :style="{ background: t.bg }">
            <svg :viewBox="t.icon.vb" width="22" height="22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="t.icon.p"/>
            </svg>
          </div>
          <div>
            <div class="trust-strip__title">{{ t.label }}</div>
            <div class="trust-strip__sub">{{ t.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         WHY US — Features
    ══════════════════════════════════════════════ -->
    <section class="section">
      <div class="container-app">
        <div class="section-header">
          <div class="section-label">¿Por qué elegirnos?</div>
          <h2 class="section-title">Tu hogar merece lo mejor</h2>
          <p class="section-desc">Comprometidos con la excelencia desde el primer diagnóstico hasta el último tornillo.</p>
        </div>

        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-card__icon" :style="{ background: f.bg }">
              <svg :viewBox="f.icon.vb" width="26" height="26" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="f.icon.p"/>
              </svg>
            </div>
            <h3 class="feature-card__title">{{ f.title }}</h3>
            <p class="feature-card__desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SERVICES — Cards con imágenes
    ══════════════════════════════════════════════ -->
    <section class="section section--gray">
      <div class="container-app">
        <div class="section-header">
          <div class="section-label">Nuestros Servicios</div>
          <h2 class="section-title">Especialistas en cada área</h2>
        </div>

        <div class="services-grid">
          <div v-for="svc in services" :key="svc.title" class="svc-card" @click="$router.push('/solicitar')">
            <div class="svc-card__img-wrap">
              <img :src="svc.image" :alt="svc.title" class="svc-card__img" />
              <div class="svc-card__overlay"></div>
              <span class="svc-card__badge" :style="{ background: svc.color }">{{ svc.badge }}</span>
            </div>
            <div class="svc-card__body">
              <div class="svc-card__icon" :style="{ background: svc.light }">
                <svg :viewBox="svc.icon.vb" width="22" height="22" fill="none" :stroke="svc.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="svc.icon.p"/>
                </svg>
              </div>
              <h3 class="svc-card__title" :style="{ color: svc.color }">{{ svc.title }}</h3>
              <p class="svc-card__desc">{{ svc.desc }}</p>
              <div class="svc-card__price">Desde {{ svc.price }}</div>
              <div class="svc-card__cta" :style="{ color: svc.color }">
                Solicitar cotización <span>→</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:center; margin-top:40px;">
          <router-link to="/servicios" class="btn btn-secondary btn-lg">Ver todos los servicios</router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         HOW IT WORKS — Proceso
    ══════════════════════════════════════════════ -->
    <section class="section">
      <div class="container-app">
        <div class="section-header">
          <div class="section-label">Cómo funciona</div>
          <h2 class="section-title">3 pasos simples</h2>
          <p class="section-desc">Reserva tu servicio en minutos desde el celular o la computadora.</p>
        </div>

        <div class="process-grid">
          <div v-for="(step, i) in process" :key="step.title" class="process-step">
            <div class="process-step__num">{{ i + 1 }}</div>
            <div class="process-step__icon" :style="{ background: step.bg }">
              <svg :viewBox="step.icon.vb" width="28" height="28" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="step.icon.p"/>
              </svg>
            </div>
            <h3 class="process-step__title">{{ step.title }}</h3>
            <p class="process-step__desc">{{ step.desc }}</p>
            <div v-if="i < process.length - 1" class="process-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         TESTIMONIALS
    ══════════════════════════════════════════════ -->
    <section class="section section--gray">
      <div class="container-app">
        <div class="section-header">
          <div class="section-label">Testimonios</div>
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
        </div>

        <div class="testimonials-grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <div class="testimonial-card__stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-card__text">"{{ t.text }}"</p>
            <div class="testimonial-card__author">
              <div class="testimonial-card__avatar" :style="{ background: t.color }">{{ t.initial }}</div>
              <div>
                <div class="testimonial-card__name">{{ t.name }}</div>
                <div class="testimonial-card__service">{{ t.service }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         CTA BAND — Emergencia
    ══════════════════════════════════════════════ -->
    <section class="cta-band">
      <div class="container-app cta-band__inner">
        <div class="cta-band__text">
          <h2 class="cta-band__title">¿Tienes una emergencia?</h2>
          <p class="cta-band__desc">Respuesta garantizada en menos de 60 minutos. Llámanos ahora o agenda en línea.</p>
        </div>
        <div class="cta-band__actions">
          <router-link to="/solicitar" class="btn btn-white btn-xl">Solicitar ahora</router-link>
          <a href="tel:+1234567890" class="btn btn-ghost btn-xl">📞 Llamar ahora</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '+2,800', label: 'Servicios completados' },
  { value: '4.9★',  label: 'Calificación promedio' },
  { value: '24/7',  label: 'Disponibilidad' },
];

const trust = [
  { label: 'Técnicos Certificados', sub: 'Con licencia vigente', bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)', icon: { vb:'0 0 24 24', p:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { label: 'Respuesta en 60 min',   sub: 'Para urgencias',       bg: 'linear-gradient(135deg,#10b981,#059669)', icon: { vb:'0 0 24 24', p:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { label: 'Garantía Total',        sub: '30 días garantizados', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: { vb:'0 0 24 24', p:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' } },
  { label: 'Precios Transparentes', sub: 'Sin sorpresas',        bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: { vb:'0 0 24 24', p:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' } },
];

const features = [
  { title: 'Atención 24/7',         bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)', desc: 'Disponibles toda la noche y los fines de semana. Tu emergencia es nuestra prioridad.', icon: { vb:'0 0 24 24', p:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { title: 'Técnicos Certificados', bg: 'linear-gradient(135deg,#10b981,#059669)', desc: 'Todo nuestro equipo tiene certificaciones vigentes y más de 5 años de experiencia.',    icon: { vb:'0 0 24 24', p:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { title: 'Garantía en Trabajo',   bg: 'linear-gradient(135deg,#f59e0b,#d97706)', desc: 'Si algo falla dentro de 30 días de nuestro servicio, regresamos sin costo adicional.', icon: { vb:'0 0 24 24', p:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' } },
  { title: 'App & Web',             bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', desc: 'Agenda, rastrea y actualiza tu cita desde cualquier dispositivo en tiempo real.',     icon: { vb:'0 0 24 24', p:'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' } },
  { title: 'Diagnóstico Gratis',    bg: 'linear-gradient(135deg,#ef4444,#dc2626)', desc: 'Evaluamos el problema sin costo. Solo pagas si decides contratar el servicio.',       icon: { vb:'0 0 24 24', p:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' } },
  { title: 'Pago Seguro',           bg: 'linear-gradient(135deg,#06b6d4,#0891b2)', desc: 'Múltiples métodos de pago. Factura electrónica disponible para empresas y personas.', icon: { vb:'0 0 24 24', p:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' } },
];

const services = [
  { title: 'Plomería', badge: 'Más popular', color: '#0ea5e9', light: 'rgba(14,165,233,0.1)', image: '/servicio_plomeria.png', price: '$35', desc: 'Reparación de fugas, destapes, tuberías y calentadores de agua.', icon: { vb:'0 0 24 24', p:'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' } },
  { title: 'Electricidad', badge: 'Urgencias', color: '#f59e0b', light: 'rgba(245,158,11,0.1)', image: '/servicio_electricidad.png', price: '$45', desc: 'Cableado, tableros eléctricos, iluminación LED y cortocircuitos.', icon: { vb:'0 0 24 24', p:'M13 10V3L4 14h7v7l9-11h-7z' } },
  { title: 'Aire Acondicionado', badge: 'Garantía 1 año', color: '#10b981', light: 'rgba(16,185,129,0.1)', image: '/servicio_aire.png', price: '$55', desc: 'Mantenimiento preventivo, recargas de gas y reparación de equipos split.', icon: { vb:'0 0 24 24', p:'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' } },
];

const process = [
  { title: 'Elige tu servicio',    desc: 'Selecciona plomería, electricidad o A/C y describe brevemente el problema.', bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)', icon: { vb:'0 0 24 24', p:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' } },
  { title: 'Confirma tu cita',     desc: 'Elige fecha y horario. Te confirmamos en menos de 15 minutos por WhatsApp.',  bg: 'linear-gradient(135deg,#10b981,#059669)', icon: { vb:'0 0 24 24', p:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' } },
  { title: 'Recibe el servicio',   desc: 'Tu técnico llega puntual, resuelve el problema y recibes garantía por escrito.', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: { vb:'0 0 24 24', p:'M5 13l4 4L19 7' } },
];

const testimonials = [
  { name: 'Carlos Méndez',  initial: 'C', color: '#0ea5e9', service: 'Plomería',          text: 'El técnico llegó en 45 minutos. Solucionó la fuga de agua en tiempo récord y a un precio muy justo. ¡Totalmente recomendados!' },
  { name: 'María Torres',   initial: 'M', color: '#10b981', service: 'Electricidad',       text: 'Excelente atención desde el primer momento. Muy profesionales y ordenados. Dejaron todo impecable después del trabajo.' },
  { name: 'Roberto Silva',  initial: 'R', color: '#f59e0b', service: 'Aire Acondicionado', text: 'Mi A/C había dejado de enfriar. En el mismo día me lo arreglaron. El precio fue justo y cumplieron con la garantía.' },
];
</script>

<style scoped>
/* ── Hero ── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero__bg { position: absolute; inset: 0; }
.hero__img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.72) 55%, rgba(14,165,233,0.12) 100%);
}
.hero__content { position: relative; padding-top: 80px; padding-bottom: 60px; }
.hero__left { max-width: 620px; }

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(56,189,248,0.15);
  border: 1px solid rgba(56,189,248,0.3);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #38bdf8;
  margin-bottom: 24px;
}
.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  animation: pulse-ring 2s ease infinite;
  display: inline-block;
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4.75rem);
  font-weight: 900;
  line-height: 1.05;
  color: white;
  margin-bottom: 24px;
  text-wrap: balance;
}
.hero__subtitle {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  line-height: 1.75;
  color: rgba(255,255,255,0.72);
  margin-bottom: 40px;
  max-width: 520px;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 56px;
}
.hero__stats {
  display: flex;
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,0.12);
}
.hero__stat-value {
  font-size: 1.875rem;
  font-weight: 900;
  color: #38bdf8;
  line-height: 1;
}
.hero__stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.hero__scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero__scroll-dot {
  width: 6px;
  height: 24px;
  border-radius: 3px;
  background: rgba(255,255,255,0.4);
  animation: float 2s ease-in-out infinite;
}

/* ── Trust Strip ── */
.trust-strip {
  background: white;
  border-bottom: 1px solid #f1f5f9;
  padding: 28px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}
.trust-strip__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.trust-strip__item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 180px;
}
.trust-strip__icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.trust-strip__title { font-size: 0.875rem; font-weight: 700; color: #1e293b; }
.trust-strip__sub   { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

/* ── Section ── */
.section { padding: 96px 0; }
.section--gray { background: #f8fafc; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #0f172a;
  margin-top: 12px;
  text-wrap: balance;
}
.section-desc {
  font-size: 1.0625rem;
  color: #64748b;
  max-width: 560px;
  margin: 16px auto 0;
  line-height: 1.7;
}

/* ── Features ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1023px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px)  { .features-grid { grid-template-columns: 1fr; } }

.feature-card {
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  background: white;
  transition: all 0.3s ease;
}
.feature-card:hover {
  box-shadow: 0 16px 48px rgba(0,0,0,0.1);
  transform: translateY(-4px);
  border-color: transparent;
}
.feature-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.feature-card__title { font-size: 1.0625rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
.feature-card__desc  { font-size: 0.875rem; line-height: 1.7; color: #64748b; }

/* ── Services ── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
@media (max-width: 1023px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px)  { .services-grid { grid-template-columns: 1fr; } }

.svc-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}
.svc-card:hover {
  box-shadow: 0 20px 60px rgba(0,0,0,0.14);
  transform: translateY(-6px);
}
.svc-card__img-wrap { position: relative; height: 200px; overflow: hidden; }
.svc-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.svc-card:hover .svc-card__img { transform: scale(1.07); }
.svc-card__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.55), transparent); }
.svc-card__badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}
.svc-card__body { padding: 24px; }
.svc-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.svc-card__title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
.svc-card__desc  { font-size: 0.875rem; line-height: 1.65; color: #64748b; margin-bottom: 16px; }
.svc-card__price { font-size: 0.8125rem; font-weight: 600; color: #94a3b8; margin-bottom: 12px; }
.svc-card__cta   { font-size: 0.875rem; font-weight: 700; display: flex; align-items: center; gap: 4px; }

/* ── Process ── */
.process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  position: relative;
}
@media (max-width: 767px) { .process-grid { grid-template-columns: 1fr; } }

.process-step {
  text-align: center;
  position: relative;
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  background: white;
  transition: all 0.3s ease;
}
.process-step:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.09); transform: translateY(-3px); }
.process-step__num {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0f172a;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.process-step__icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.process-step__title { font-size: 1.0625rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
.process-step__desc  { font-size: 0.875rem; line-height: 1.65; color: #64748b; }
.process-arrow {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #cbd5e1;
  z-index: 1;
}
@media (max-width: 767px) { .process-arrow { display: none; } }

/* ── Testimonials ── */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1023px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px)  { .testimonials-grid { grid-template-columns: 1fr; } }

.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}
.testimonial-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.09); transform: translateY(-3px); }
.testimonial-card__stars  { font-size: 0.875rem; margin-bottom: 14px; letter-spacing: 1px; }
.testimonial-card__text   { font-size: 0.875rem; line-height: 1.75; color: #475569; font-style: italic; margin-bottom: 20px; }
.testimonial-card__author { display: flex; align-items: center; gap: 12px; }
.testimonial-card__avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}
.testimonial-card__name    { font-weight: 600; font-size: 0.875rem; color: #1e293b; }
.testimonial-card__service { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

/* ── CTA Band ── */
.cta-band { background: linear-gradient(135deg, #0ea5e9, #0369a1 60%, #0f172a); padding: 80px 0; }
.cta-band__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}
.cta-band__title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: white; margin-bottom: 8px; }
.cta-band__desc  { font-size: 1rem; color: rgba(255,255,255,0.72); }
.cta-band__actions { display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }

@media (max-width: 767px) {
  .cta-band__inner { flex-direction: column; text-align: center; }
  .cta-band__actions { justify-content: center; width: 100%; }
  .hero__stats { gap: 20px; }
}
</style>
