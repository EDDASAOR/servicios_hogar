<template>
  <div class="admin-layout">
    <!-- Sidebar / Header móvil -->
    <header class="admin-header">
      <div class="admin-header__logo">
        <div class="auth-logo__icon" style="width:32px;height:32px;background:linear-gradient(135deg, #0ea5e9, #10b981);border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
        </div>
        <span style="font-weight:700;color:#0f172a;font-size:1.1rem;">Panel Admin</span>
      </div>
      <button class="admin-menu-btn" @click="sidebarOpen = !sidebarOpen">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </header>

    <aside :class="['admin-sidebar', sidebarOpen && 'open']">
      <div class="admin-sidebar__inner">
        <div class="admin-sidebar__top">
          <router-link to="/" class="admin-sidebar__logo">
            <div class="auth-logo__icon" style="width:36px;height:36px;background:linear-gradient(135deg, #0ea5e9, #10b981);border-radius:10px;display:flex;align-items:center;justify-content:center;">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </div>
            <span style="font-weight:800;color:white;font-size:1.25rem;">HogarPro</span>
          </router-link>

          <nav class="admin-nav">
            <a href="#" class="admin-nav__link active">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              Gestión de Citas
            </a>
            <!-- Futuras secciones de admin irían aquí -->
          </nav>
        </div>

        <div class="admin-sidebar__bottom">
          <div class="admin-user-card">
            <div class="admin-user-card__avatar">{{ authStore.user?.name?.charAt(0) || 'A' }}</div>
            <div style="flex:1;overflow:hidden;">
              <div class="admin-user-card__name">{{ authStore.user?.name }}</div>
              <div class="admin-user-card__role">Administrador</div>
            </div>
          </div>
          <button @click="handleLogout" class="admin-logout-btn">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="admin-overlay" @click="sidebarOpen = false"></div>

    <!-- Contenido principal -->
    <main class="admin-main">
      <div class="admin-main__header">
        <div>
          <h1 class="admin-page-title">Dashboard</h1>
          <p class="admin-page-desc">Vista general y gestión de solicitudes de servicio.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(14,165,233,0.1);color:#0ea5e9;">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div>
            <div class="stat-value">{{ totalAppointments }}</div>
            <div class="stat-label">Citas Totales</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,0.1);color:#f59e0b;">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div class="stat-value">{{ pendingAppointments }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(16,185,129,0.1);color:#10b981;">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div>
            <div class="stat-value">{{ completedAppointments }}</div>
            <div class="stat-label">Completadas</div>
          </div>
        </div>
      </div>

      <!-- Tabla principal -->
      <div class="admin-panel">
        <div class="admin-panel__header">
          <h2 class="admin-panel__title">Últimas Solicitudes</h2>
          <div class="admin-filters">
            <select v-model="filterStatus" class="form-input form-select" style="padding:8px 36px 8px 14px;font-size:0.875rem;">
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
            <button @click="fetchAppointments" class="btn btn-secondary btn-sm" :disabled="loading">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" :class="loading && 'anim-spin'"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Actualizar
            </button>
          </div>
        </div>

        <div v-if="loading && appointments.length === 0" class="admin-loading">
          <span class="anim-spin" style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#0ea5e9;border-radius:50%;display:inline-block;"></span>
          <p>Cargando citas...</p>
        </div>

        <div v-else-if="error" class="alert alert-error" style="margin:20px;">
          {{ error }}
        </div>

        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Cliente / Ubicación</th>
                <th>Fecha programada</th>
                <th>Urgencia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAppointments.length === 0">
                <td colspan="6" class="admin-table-empty">
                  No hay citas que coincidan con los filtros.
                </td>
              </tr>
              <tr v-for="app in filteredAppointments" :key="app._id">
                <td>
                  <div class="t-service">
                    <span class="t-service__icon">{{ getServiceIcon(app.serviceType) }}</span>
                    <div>
                      <div class="t-service__name">{{ getServiceName(app.serviceType) }}</div>
                      <div class="t-service__desc" :title="app.description">{{ truncate(app.description, 30) }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="t-client">
                    <div class="t-client__name">{{ app.clientName }}</div>
                    <div class="t-client__contact">📞 {{ app.clientPhone }}</div>
                    <div class="t-client__address" :title="app.address">📍 {{ truncate(app.address, 25) }}</div>
                  </div>
                </td>
                <td>
                  <div class="t-date">
                    <div class="t-date__day">{{ formatDate(app.scheduledDate) }}</div>
                    <div class="t-date__time">{{ formatTime(app.scheduledDate) }}</div>
                  </div>
                </td>
                <td>
                  <span :class="['badge', app.priority === 'urgent' ? 'badge-danger' : 'badge-primary']" style="font-size:0.7rem;">
                    {{ app.priority === 'urgent' ? '🚨 Urgente' : 'Normal' }}
                  </span>
                </td>
                <td>
                  <div class="t-status-wrap">
                    <select
                      v-model="app.status"
                      @change="updateStatus(app._id, app.status)"
                      :class="['t-status-select', `t-status-${app.status}`]"
                      :disabled="statusLoading === app._id"
                    >
                      <option value="pending">⏳ Pendiente</option>
                      <option value="confirmed">✅ Confirmada</option>
                      <option value="completed">🏆 Completada</option>
                      <option value="cancelled">❌ Cancelada</option>
                    </select>
                    <span v-if="statusLoading === app._id" class="anim-spin t-status-spin"></span>
                  </div>
                </td>
                <td>
                  <a :href="getWhatsAppLink(app)" target="_blank" class="t-wa-btn" title="Contactar por WhatsApp">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Contactar
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const appointments = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const statusLoading = ref<string | null>(null);
const filterStatus = ref('');

const fetchAppointments = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await api.get('/appointments/all');
    // Mapear los campos desde el schema Mongoose (español) a lo esperado en el frontend
    const mapped = response.data.map((app: any) => ({
      _id: app._id,
      createdAt: app.createdAt,
      serviceType: app.servicio,
      description: app.descripcion,
      scheduledDate: app.fechaProgramada,
      address: app.direccion || 'No especificada',
      priority: app.prioridad === 'urgente' ? 'urgent' : 'normal',
      status: app.estado === 'pendiente' ? 'pending' :
              app.estado === 'en proceso' || app.estado === 'confirmed' ? 'confirmed' :
              app.estado === 'finalizado' || app.estado === 'completed' ? 'completed' :
              app.estado === 'cancelado' || app.estado === 'cancelled' ? 'cancelled' : 'pending',
      clientName: app.client_id?.nombre || 'Cliente Anónimo',
      clientPhone: app.client_id?.telefono || 'Sin teléfono',
    }));
    appointments.value = mapped.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e: any) {
    if (e.response?.status === 403 || e.response?.status === 401) {
      error.value = 'No tienes permisos de administrador.';
      setTimeout(() => router.push('/'), 2000);
    } else {
      error.value = 'Error al cargar las citas.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.user?.rol !== 'admin') {
    router.push('/');
    return;
  }
  fetchAppointments();
});

const filteredAppointments = computed(() => {
  if (!filterStatus.value) return appointments.value;
  return appointments.value.filter(a => a.status === filterStatus.value);
});

const totalAppointments = computed(() => appointments.value.length);
const pendingAppointments = computed(() => appointments.value.filter(a => a.status === 'pending').length);
const completedAppointments = computed(() => appointments.value.filter(a => a.status === 'completed').length);

const updateStatus = async (id: string, newStatus: string) => {
  statusLoading.value = id;
  try {
    const estado = newStatus === 'pending' ? 'pendiente' :
                   newStatus === 'confirmed' ? 'confirmado' :
                   newStatus === 'completed' ? 'finalizado' : 
                   newStatus === 'cancelled' ? 'cancelado' : 'pendiente';
    
    let motivo = '';
    if (estado === 'cancelado') {
      const resp = prompt('Por favor, ingresa el motivo de la cancelación. Este motivo será enviado al cliente por correo:');
      if (resp === null) {
        // User clicked Cancel on prompt, revert status change
        fetchAppointments();
        return;
      }
      motivo = resp || 'Cancelado por el administrador sin motivo especificado';
    }
    
    await api.patch(`/appointments/${id}/status`, { estado, motivo: motivo || undefined });
  } catch (e) {
    alert('Error al actualizar el estado');
    // revert
    fetchAppointments();
  } finally {
    statusLoading.value = null;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const getServiceName = (id: string) => {
  const map: any = { 'plomeria': 'Plomería', 'electricidad': 'Electricidad', 'aire': 'Aire Acond.' };
  return map[id] || id;
};

const getServiceIcon = (id: string) => {
  const map: any = { 'plomeria': '💧', 'electricidad': '⚡', 'aire': '❄️' };
  return map[id] || '🔧';
};

const truncate = (str: string, len: number) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-ES', { year:'numeric', month:'short', day:'numeric' });
};
const formatTime = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const getWhatsAppLink = (app: any) => {
  const phone = app.clientPhone.replace(/\D/g, '');
  const msg = encodeURIComponent(`Hola ${app.clientName}, nos comunicamos de HogarPro respecto a tu solicitud de servicio de ${getServiceName(app.serviceType)}...`);
  return `https://wa.me/${phone}?text=${msg}`;
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

/* Header Móvil */
.admin-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
}
.admin-header__logo { display: flex; align-items: center; gap: 8px; }
.admin-menu-btn { background: transparent; border: none; color: #475569; padding: 4px; border-radius: 6px; cursor: pointer; }
@media (max-width: 1023px) {
  .admin-header { display: flex; }
  .admin-layout { flex-direction: column; padding-top: 57px; }
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background: #0f172a;
  color: white;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
  transition: transform 0.3s ease;
}
.admin-sidebar__inner { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
.admin-sidebar__top { padding: 32px 20px; }
.admin-sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-bottom: 48px;
}
.admin-nav { display: flex; flex-direction: column; gap: 8px; }
.admin-nav__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #94a3b8;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}
.admin-nav__link:hover { background: rgba(255,255,255,0.05); color: white; }
.admin-nav__link.active { background: #0ea5e9; color: white; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }

.admin-sidebar__bottom { padding: 24px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.admin-user-card { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.admin-user-card__avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 0.875rem;
}
.admin-user-card__name { font-size: 0.875rem; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.admin-user-card__role { font-size: 0.7rem; color: #94a3b8; }
.admin-logout-btn {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px;
  background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
  color: #fca5a5; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.admin-logout-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }

@media (max-width: 1023px) {
  .admin-sidebar { position: fixed; transform: translateX(-100%); }
  .admin-sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
}

.admin-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 45;
}

/* Main */
.admin-main { flex: 1; padding: 40px; overflow-x: hidden; }
@media (max-width: 1023px) { .admin-main { padding: 24px 16px; } }

.admin-main__header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
.admin-page-title { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.admin-page-desc { font-size: 0.9375rem; color: #64748b; }

/* Stats */
.admin-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
@media (max-width: 767px) { .admin-stats { grid-template-columns: 1fr; gap: 16px; } }

/* Panel / Table */
.admin-panel { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; }
.admin-panel__header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 16px; }
.admin-panel__title { font-size: 1.125rem; font-weight: 700; color: #1e293b; }
.admin-filters { display: flex; gap: 12px; }

.admin-loading { padding: 48px; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 16px; }

.admin-table-wrap { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; }
.admin-table th { padding: 16px 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.admin-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.admin-table-empty { text-align: center; padding: 48px !important; color: #94a3b8; font-style: italic; }

.t-service { display: flex; align-items: center; gap: 12px; }
.t-service__icon { width: 32px; height: 32px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
.t-service__name { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
.t-service__desc { font-size: 0.75rem; color: #94a3b8; }

.t-client__name { font-size: 0.875rem; font-weight: 600; color: #334155; }
.t-client__contact, .t-client__address { font-size: 0.75rem; color: #64748b; margin-top: 2px; }

.t-date__day { font-size: 0.875rem; font-weight: 600; color: #334155; }
.t-date__time { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

.t-status-wrap { position: relative; display: inline-flex; align-items: center; }
.t-status-select {
  appearance: none;
  padding: 6px 32px 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}
.t-status-pending   { background-color: #fef3c7; color: #b45309; border-color: #fde68a; }
.t-status-confirmed { background-color: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
.t-status-completed { background-color: #dcfce7; color: #15803d; border-color: #bbf7d0; }
.t-status-cancelled { background-color: #fee2e2; color: #b91c1c; border-color: #fecaca; }
.t-status-spin { position: absolute; right: -24px; width: 14px; height: 14px; border: 2px solid #cbd5e1; border-top-color: #0ea5e9; border-radius: 50%; display: inline-block; }

.t-wa-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px;
  background: rgba(37,211,102,0.1); color: #25D366;
  text-decoration: none; transition: all 0.2s;
}
.t-wa-btn:hover { background: #25D366; color: white; transform: translateY(-2px); }
</style>
