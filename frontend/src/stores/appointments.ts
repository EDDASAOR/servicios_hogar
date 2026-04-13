import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    appointments: [],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async createAppointment(data: any) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/appointments', data);
        this.appointments.push(response.data as never);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al agendar cita';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchMyAppointments() {
      this.loading = true;
      try {
        const response = await api.get('/appointments/my-appointments');
        this.appointments = response.data;
      } catch (err: any) {
        this.error = 'No se pudieron cargar las citas';
      } finally {
        this.loading = false;
      }
    },
    async fetchAllAppointments() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/appointments/all');
        this.appointments = response.data;
      } catch (err: any) {
        this.error = 'No se pudieron cargar las citas del sistema (Requiere Admin)';
      } finally {
        this.loading = false;
      }
    },
    async updateAppointmentStatus(id: string, estado: string) {
      try {
        await api.patch(`/appointments/${id}/status`, { estado });
        const appt: any = this.appointments.find((a: any) => a._id === id);
        if (appt) appt.estado = estado;
      } catch (err: any) {
        console.error('Error al actualizar', err);
      }
    }
  }
});
