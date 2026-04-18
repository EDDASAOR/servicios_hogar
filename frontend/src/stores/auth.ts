import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null as string | null,
    authReady: false,   // true cuando initAuth() ya terminó (éxito o error)
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    /**
     * Verificar la sesión guardada al iniciar la app.
     * Siempre marca authReady = true al terminar (con o sin error).
     */
    async initAuth() {
      if (!this.token) {
        this.authReady = true;
        return;
      }
      try {
        const response = await api.get('/auth/me');
        this.user = response.data;
      } catch {
        this.user  = null;
        this.token = null;
        localStorage.removeItem('token');
      } finally {
        this.authReady = true;
      }
    },
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.access_token;
        this.user  = response.data.user;
        if (this.token) {
          localStorage.setItem('token', this.token);
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(nombre: string, email: string, password: string, telefono: string) {
      this.loading = true;
      this.error = null;
      try {
        await api.post('/users/register', { nombre, email, password, telefono });
        await this.login(email, password);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al registrarse';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user  = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});
