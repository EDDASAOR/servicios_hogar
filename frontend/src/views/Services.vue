<template>
  <div class="services-page">
    <!-- Hero de servicios -->
    <section class="sv-hero">
      <div class="container-app sv-hero__content">
        <div class="section-label" style="margin-bottom:16px;">Catálogo Completo</div>
        <h1 class="sv-hero__title">Nuestros Servicios</h1>
        <p class="sv-hero__desc">Brindamos soluciones integrales con especialistas certificados. Presupuesto gratuito en todos los servicios.</p>
      </div>
    </section>

    <!-- Servicios detallados -->
    <section class="section">
      <div class="container-app">
        <div v-for="svc in services" :key="svc.id" class="sv-block">
          <div class="sv-block__img-col">
            <img :src="svc.image" :alt="svc.title" class="sv-block__img" />
            <div class="sv-block__price-tag" :style="{ background: svc.color }">
              Desde {{ svc.price }}
            </div>
          </div>
          <div class="sv-block__content">
            <div class="sv-block__category" :style="{ color: svc.color, background: svc.light }">{{ svc.category }}</div>
            <h2 class="sv-block__title">{{ svc.title }}</h2>
            <p class="sv-block__desc">{{ svc.desc }}</p>

            <div class="sv-block__features">
              <div v-for="f in svc.features" :key="f" class="sv-block__feature">
                <div class="sv-block__check" :style="{ background: svc.light, color: svc.color }">✓</div>
                {{ f }}
              </div>
            </div>

            <div class="sv-block__guarantees">
              <div class="sv-guarantee">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" :stroke="svc.color" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Garantía 30 días
              </div>
              <div class="sv-guarantee">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" :stroke="svc.color" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Diagnóstico gratis
              </div>
              <div class="sv-guarantee">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" :stroke="svc.color" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Disponible 24/7
              </div>
            </div>

            <router-link to="/solicitar" class="btn btn-primary btn-lg">
              Solicitar este servicio
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Garantías globales -->
    <section class="section section--gray">
      <div class="container-app">
        <div class="section-header">
          <div class="section-label">Nuestro compromiso</div>
          <h2 class="section-title">Garantías que nos respaldan</h2>
        </div>
        <div class="sv-guarantees-grid">
          <div v-for="g in guarantees" :key="g.title" class="sv-gcard">
            <div class="sv-gcard__icon" :style="{ background: g.bg }">
              <svg :viewBox="g.icon.vb" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="g.icon.p"/>
              </svg>
            </div>
            <h3 class="sv-gcard__title">{{ g.title }}</h3>
            <p class="sv-gcard__desc">{{ g.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="cta-band">
      <div class="container-app cta-band__inner">
        <div class="cta-band__text">
          <h2 class="cta-band__title">¿Listo para solicitar un servicio?</h2>
          <p class="cta-band__desc">Agenda en línea en menos de 2 minutos. Confirmación inmediata.</p>
        </div>
        <div class="cta-band__actions">
          <router-link to="/solicitar" class="btn btn-white btn-xl">Solicitar ahora</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    id: 'plomeria', title: 'Plomería Profesional', category: '💧 Plomería',
    color: '#0ea5e9', light: 'rgba(14,165,233,0.1)',
    image: '/servicio_plomeria.png', price: '$35 USD',
    desc: 'Solucionamos desde pequeñas fugas hasta grandes instalaciones hidráulicas con materiales de primera calidad.',
    features: ['Reparación de fugas visibles y ocultas', 'Destapes de tuberías y drenajes', 'Instalación de tuberías nuevas', 'Mantenimiento de calentadores de agua', 'Cambio de llaves y regaderas', 'Revisión de presión de agua', 'Reparación de inodoros y cisternas'],
  },
  {
    id: 'electricidad', title: 'Servicios Eléctricos', category: '⚡ Electricidad',
    color: '#f59e0b', light: 'rgba(245,158,11,0.1)',
    image: '/servicio_electricidad.png', price: '$45 USD',
    desc: 'Técnicos certificados para resolver cualquier problema eléctrico de forma segura y eficiente.',
    features: ['Instalación y cableado eléctrico', 'Revisión y cambio de tableros', 'Instalación de iluminación LED', 'Reparación de cortocircuitos', 'Instalación de tomacorrientes', 'Certificación eléctrica residencial', 'Instalación de sistemas de emergencia'],
  },
  {
    id: 'aire', title: 'Aire Acondicionado', category: '❄️ Climatización',
    color: '#10b981', light: 'rgba(16,185,129,0.1)',
    image: '/servicio_aire.png', price: '$55 USD',
    desc: 'Mantenemos tu equipo en óptimas condiciones para máxima eficiencia y vida útil prolongada.',
    features: ['Mantenimiento preventivo completo', 'Recarga de gas refrigerante', 'Limpieza profunda de filtros', 'Reparación de unidades split', 'Instalación de equipos nuevos', 'Diagnóstico de equipos centrales', 'Garantía de 1 año en instalaciones'],
  },
];

const guarantees = [
  { title: 'Satisfacción Garantizada',  desc: 'Si no quedas satisfecho con nuestro trabajo, regresamos a corregirlo sin costo.', bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)', icon: { vb:'0 0 24 24', p:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { title: 'Técnicos Verificados',      desc: 'Todo nuestro personal pasa por verificación de antecedentes y certificación técnica.', bg: 'linear-gradient(135deg,#10b981,#059669)', icon: { vb:'0 0 24 24', p:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' } },
  { title: 'Precios Fijos',             desc: 'Cotizamos antes de empezar. El precio acordado es el precio final, sin sorpresas.', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: { vb:'0 0 24 24', p:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' } },
  { title: 'Respuesta Inmediata',       desc: 'Para emergencias respondemos en menos de 60 minutos a tu ubicación.', bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: { vb:'0 0 24 24', p:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' } },
];
</script>

<style scoped>
.sv-hero {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 80px 0 60px;
  text-align: center;
}
.sv-hero__content { padding: 0 16px; }
.sv-hero__title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: white; margin-bottom: 16px; }
.sv-hero__desc  { font-size: 1.0625rem; color: rgba(255,255,255,0.65); max-width: 560px; margin: 0 auto; line-height: 1.7; }

.sv-block {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 48px;
  align-items: center;
  padding: 64px 0;
  border-bottom: 1px solid #f1f5f9;
}
.sv-block:last-child { border-bottom: none; }
.sv-block:nth-child(even) .sv-block__img-col { order: 2; }
.sv-block:nth-child(even) .sv-block__content  { order: 1; }
@media (max-width: 767px) {
  .sv-block { grid-template-columns: 1fr; gap: 28px; }
  .sv-block:nth-child(even) .sv-block__img-col,
  .sv-block:nth-child(even) .sv-block__content { order: initial; }
}

.sv-block__img-col { position: relative; }
.sv-block__img {
  width: 100%;
  border-radius: 16px;
  aspect-ratio: 4/3;
  object-fit: cover;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
}
.sv-block__price-tag {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.sv-block__category {
  display: inline-flex;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.sv-block__title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; color: #0f172a; margin-bottom: 12px; }
.sv-block__desc  { font-size: 0.9375rem; line-height: 1.7; color: #64748b; margin-bottom: 24px; }

.sv-block__features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
@media (max-width: 479px) { .sv-block__features { grid-template-columns: 1fr; } }
.sv-block__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #334155;
}
.sv-block__check {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.sv-block__guarantees { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
.sv-guarantee {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.sv-guarantees-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1023px) { .sv-guarantees-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px)  { .sv-guarantees-grid { grid-template-columns: 1fr; } }

.sv-gcard {
  background: white;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #f1f5f9;
  text-align: center;
  transition: all 0.3s ease;
}
.sv-gcard:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.09); transform: translateY(-3px); }
.sv-gcard__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.sv-gcard__title { font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.sv-gcard__desc  { font-size: 0.8125rem; line-height: 1.65; color: #64748b; }

/* reutilizadas globales */
.cta-band { background: linear-gradient(135deg, #0ea5e9, #0369a1 60%, #0f172a); padding: 80px 0; }
.cta-band__inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.cta-band__title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: white; margin-bottom: 8px; }
.cta-band__desc  { font-size: 1rem; color: rgba(255,255,255,0.72); }
.cta-band__actions { display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }
@media (max-width: 767px) {
  .cta-band__inner { flex-direction: column; text-align: center; }
  .cta-band__actions { justify-content: center; width: 100%; }
}
</style>
