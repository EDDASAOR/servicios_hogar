/**
 * botpress-init.ts
 * ─────────────────────────────────────────────────────────────────
 * Composable que conecta el chatbot de Botpress con la app HogarPro.
 *
 * Coloca este archivo en:  frontend/src/composables/botpress-init.ts
 *
 * Compatible con Botpress Webchat v3.6+ (inject.js)
 *
 * Funcionalidades:
 *  • Inyecta los datos del usuario autenticado al bot (nombre, email, teléfono, rol)
 *  • Expone al bot funciones para REGISTRAR usuario y AGENDAR cita normal vía API
 *  • Limpia el contexto del bot cuando el usuario cierra sesión
 *  • Escucha eventos del bot (acciones enviadas desde el flujo de Botpress)
 * ─────────────────────────────────────────────────────────────────
 */

import { watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

// ─── Tipado de la API global de Botpress v3.6 ────────────────────
// El script inject.js expone window.botpress (ya NO window.botpressWebChat)
declare global {
    interface Window {
        botpress?: {
            /** Envía un evento/payload desde la web hacia el flujo del bot */
            sendEvent: (event: { type: string; payload?: Record<string, unknown> }) => void;
            /** Envía un mensaje como si lo hubiera escrito el usuario (v3) */
            sendMessage: (message: { type: string; text?: string; payload?: Record<string, unknown> }) => void;
            /** Suscribe un handler a eventos del webchat o eventos personalizados del bot */
            on: (
                eventType: string,
                handler: (event: Record<string, unknown>) => void
            ) => () => void;  // retorna una función para desuscribirse
        };
        // Objeto compartido entre la página y el bot (accesible en Execute Code de BP)
        hogarProContext?: HogarProContext;
    }
}

interface HogarProContext {
    /** Indica si hay sesión activa */
    isAuthenticated: boolean;
    /** Datos del usuario logueado (null si no está autenticado) */
    user: {
        nombre: string;
        email: string;
        telefono?: string;
        rol: string;
    } | null;
    /**
     * Registra un nuevo usuario en la plataforma.
     * Llamar desde un Execute Code de Botpress: await window.hogarProContext.registerUser(...)
     */
    registerUser: (nombre: string, email: string, password: string, telefono: string) => Promise<RegisterResult>;
    /**
     * Agenda una cita NORMAL (no urgente) usando el JWT del usuario autenticado.
     * Llamar desde un Execute Code de Botpress: await window.hogarProContext.scheduleAppointment(...)
     */
    scheduleAppointment: (data: AppointmentPayload) => Promise<AppointmentResult>;
}

interface RegisterResult {
    ok: boolean;
    message: string;
    user?: { id: string; nombre: string; email: string };
    autoLoginToken?: string;
}

interface AppointmentPayload {
    servicio: string;          // Nombre del servicio: 'plomeria' | 'electricidad' | 'aire'
    descripcion: string;       // Descripción del problema
    direccion: string;         // Dirección del cliente
    fechaProgramada: string;   // ISO 8601, ej: '2026-04-20T10:00:00'
}

interface AppointmentResult {
    ok: boolean;
    message: string;
    appointmentId?: string;
}

// ─── Helpers internos ────────────────────────────────────────────

async function registerUser(
    nombre: string,
    email: string,
    password: string,
    telefono: string
): Promise<RegisterResult> {
    try {
        await api.post('/users/register', { nombre, email, password, telefono });

        // Auto-login para obtener el token
        const loginRes = await api.post('/auth/login', { email, password });
        const token: string = loginRes.data.access_token;
        const user = loginRes.data.user;

        // Persistir sesión en la app Vue igual que si hubiera usado el formulario
        localStorage.setItem('token', token);

        // Notificar al store de Pinia (recarga de estado sin refrescar la página)
        const authStore = useAuthStore();
        authStore.token = token;
        authStore.user = user;

        // Actualizar el contexto compartido con el bot inmediatamente
        if (window.hogarProContext) {
            window.hogarProContext.isAuthenticated = true;
            window.hogarProContext.user = {
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono ?? '',
                rol: user.rol,
            };
        }

        return {
            ok: true,
            message: `Cuenta creada y sesión iniciada. ¡Bienvenido, ${user.nombre}!`,
            user: { id: user._id, nombre: user.nombre, email: user.email },
            autoLoginToken: token,
        };
    } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const msg = axiosErr.response?.data?.message ?? 'Error al crear la cuenta';
        return { ok: false, message: msg };
    }
}

async function scheduleAppointment(data: AppointmentPayload): Promise<AppointmentResult> {
    try {
        const payload = {
            servicio: data.servicio,
            descripcion: data.descripcion,
            direccion: data.direccion,
            fechaProgramada: data.fechaProgramada,
            prioridad: 'normal',
        };

        const res = await api.post('/appointments', payload);
        return {
            ok: true,
            message: '¡Cita agendada con éxito! Te confirmamos por correo.',
            appointmentId: res.data._id,
        };
    } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const msg = axiosErr.response?.data?.message ?? 'Error al agendar la cita';
        return { ok: false, message: msg };
    }
}

// ─── Función principal: inicializar el puente bot ↔ página ───────

export function useBotpressInit() {
    const authStore = useAuthStore();

    /**
     * Construye / actualiza el objeto window.hogarProContext que el bot puede leer
     * desde sus nodos "Execute Code".
     */
    function syncContextToBot() {
        window.hogarProContext = {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.user
                ? {
                    nombre: authStore.user.nombre,
                    email: authStore.user.email,
                    telefono: authStore.user.telefono ?? '',
                    rol: authStore.user.rol,
                }
                : null,
            registerUser,
            scheduleAppointment,
        };
    }

    /**
     * Envía el contexto del usuario al bot cuando abre el chat.
     * Compartiendo la misma sesión web a través de variables de contexto.
     */
    function sendUserPayloadToBot() {
        if (!window.botpress) return;

        const data = authStore.isAuthenticated && authStore.user
            ? {
                isAuthenticated: true,
                access_token: authStore.token,
            }
            : {
                isAuthenticated: false,
            };

        // Limpieza de memoria temporal
        var payload = {
            access_token: data.isAuthenticated ? data.access_token : "",
            client_nombre: data.isAuthenticated && authStore.user ? authStore.user.nombre : "",
            client_email: data.isAuthenticated && authStore.user ? authStore.user.email : "",
            client_telefono: data.isAuthenticated && authStore.user ? (authStore.user.telefono || "") : ""
        };

        // Enchufamos TODAS las variables puras en memoria sin lanzar Eventos ni Textos visibles
        if (window.botpress.updateUser) {
            window.botpress.updateUser(payload);
        } else if (window.botpress.sendEvent) {
             // Fallback si la versión de Webchat lo encapsula bajo eventos del sistema
            window.botpress.sendEvent({
                type: 'updateUser',
                payload: payload
            });
        }
    }

    /**
     * Escucha eventos personalizados que el bot dispara hacia la página.
     * En Botpress v3.6 usa window.botpress.on('customEvent', handler).
     * Retorna la función de desuscripción para limpiar listeners.
     */
    function listenToBotActions(): () => void {
        if (!window.botpress) return () => {};

        const unsubscribe = window.botpress.on('customEvent', (event) => {
            // Acción 1: Redirecciones Web
            if (event['type'] === 'REDIRECT_TO') {
                const path = event['path'] as string | undefined;
                if (path) window.location.href = path;
            }
            
            // Acción 2: Botpress nos pide los datos de sesión activamente porque el usuario dio clic en "SÍ"
            if (event['type'] === 'GET_SESSION') {
                const data = authStore.isAuthenticated && authStore.user ? { isAuthenticated: true } : { isAuthenticated: false };
                
                var payload = {
                    access_token: data.isAuthenticated ? authStore.token : "",
                    client_nombre: data.isAuthenticated && authStore.user ? authStore.user.nombre : "",
                    client_email: data.isAuthenticated && authStore.user ? authStore.user.email : "",
                    client_telefono: data.isAuthenticated && authStore.user ? (authStore.user.telefono || "") : ""
                };

                // Le devolvemos a Botpress la información inyectando directamente sus variables maestras
                if (window.botpress!.updateUser) {
                    window.botpress!.updateUser(payload);
                } else if (window.botpress!.sendEvent) {
                    window.botpress!.sendEvent({ type: 'trigger', payload: payload });
                }
            }
        });

        return unsubscribe;
    }

    /**
     * Punto de entrada principal: llamar en onMounted() de App.vue.
     *
     * FIX ISSUE 1 — Por qué se cambia 'webchat:initialized' → 'webchat:opened':
     *   sendEvent() sólo funciona cuando hay una conversación activa en el bot.
     *   En 'webchat:initialized' Botpress carga el widget pero la conversación
     *   no existe aún, así que el evento USER_CONTEXT se pierde silenciosamente.
     *   En 'webchat:opened' el usuario ya abrió el chat y la conversación está
     *   activa, garantizando que el evento llega al flujo del bot.
     */
    function init() {
        syncContextToBot();

        let cleanupOpened:  (() => void) | null = null;
        let cleanupActions: (() => void) | null = null;

        const onBotpressReady = () => {
            // Escuchar acciones del bot → página
            cleanupActions = listenToBotActions();

            // Enviar USER_CONTEXT cuando el chat está 100% listo para recibir eventos
            cleanupOpened = window.botpress!.on('webchat:ready', () => {
                sendUserPayloadToBot();
            });
        };

        if (window.botpress) {
            onBotpressReady();
        } else {
            window.addEventListener('botpress:webchat:initialized', onBotpressReady, { once: true });

            const fallbackTimer = setTimeout(() => {
                if (window.botpress) onBotpressReady();
            }, 5000);

            window.addEventListener(
                'botpress:webchat:initialized',
                () => clearTimeout(fallbackTimer),
                { once: true }
            );
        }

        // Reaccionar a cambios de sesión mientras el chat está abierto
        watch(
            () => authStore.isAuthenticated,
            () => {
                syncContextToBot();
                sendUserPayloadToBot();
            }
        );

        watch(
            () => authStore.user,
            () => {
                syncContextToBot();
                sendUserPayloadToBot();
            },
            { deep: true }
        );

        return () => {
            cleanupOpened?.();
            cleanupActions?.();
        };
    }

    return { init };
}