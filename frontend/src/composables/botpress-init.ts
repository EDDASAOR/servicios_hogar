import { watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

declare global {
    interface Window {
        botpress?: {
            sendEvent: (event: { type: string; payload?: Record<string, unknown> }) => void;
            sendMessage: (message: { type: string; text?: string; payload?: Record<string, unknown> }) => void;
            on: (
                eventType: string,
                handler: (event: Record<string, unknown>) => void
            ) => () => void;
        };
        hogarProContext?: HogarProContext;
    }
}

interface HogarProContext {
    isAuthenticated: boolean;
    user: {
        nombre: string;
        email: string;
        telefono?: string;
        rol: string;
    } | null;
    // ← NUEVO: el bot llama esto para obtener el JWT
    getToken: () => string | null;
    registerUser: (nombre: string, email: string, password: string, telefono: string) => Promise<RegisterResult>;
    scheduleAppointment: (data: AppointmentPayload) => Promise<AppointmentResult>;
}

interface RegisterResult {
    ok: boolean;
    message: string;
    user?: { id: string; nombre: string; email: string };
    autoLoginToken?: string;
}

interface AppointmentPayload {
    servicio: string;
    descripcion: string;
    direccion: string;
    fechaProgramada: string;
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
        const loginRes = await api.post('/auth/login', { email, password });
        const token: string = loginRes.data.access_token;
        const user = loginRes.data.user;

        localStorage.setItem('token', token);

        const authStore = useAuthStore();
        authStore.token = token;
        authStore.user = user;

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
        const res = await api.post('/appointments', {
            servicio: data.servicio,
            descripcion: data.descripcion,
            direccion: data.direccion,
            fechaProgramada: data.fechaProgramada,
            prioridad: 'normal',
        });
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

// ─── Función principal ───────────────────────────────────────────

export function useBotpressInit() {
    const authStore = useAuthStore();

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
            // ← el bot lee esto y hace el fetch a /auth/me él solo
            getToken: () => authStore.token ?? null,
            registerUser,
            scheduleAppointment,
        };
    }

    function listenToBotActions(): () => void {
        if (!window.botpress) return () => {};

        const unsubscribe = window.botpress.on('customEvent', (event) => {
            if (event['type'] === 'REDIRECT_TO') {
                const path = event['path'] as string | undefined;
                if (path) window.location.href = path;
            }
            // GET_SESSION ya no es necesario — el bot obtiene el token
            // directamente de hogarProContext.getToken() en Execute Code
        });

        return unsubscribe;
    }

    function init() {
        syncContextToBot();

        let cleanupActions: (() => void) | null = null;

        const onBotpressReady = () => {
            cleanupActions = listenToBotActions();
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

        // Actualizar hogarProContext si cambia la sesión
        watch(() => authStore.isAuthenticated, () => syncContextToBot());
        watch(() => authStore.user, () => syncContextToBot(), { deep: true });

        return () => {
            cleanupActions?.();
        };
    }

    return { init };
}