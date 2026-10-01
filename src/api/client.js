import axios from 'axios';

const getBaseUrl = () => {
    let envUrl = (import.meta.env.VITE_API_URL || '').trim();
    if (!envUrl) return '/api/v1'; // Usa el proxy de Vite en desarrollo local
    // Elimina slashes al final
    envUrl = envUrl.replace(/\/+$/, '');
    // Asegura que termine en /api/v1
    if (!envUrl.endsWith('/api/v1')) {
        envUrl = `${envUrl}/api/v1`;
    }
    return envUrl;
};

/**
 * Convierte rutas relativas de backend (/api/v1/uploads/...) a URLs absolutas en produccion.
 */
export const getMediaUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const clean = url.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('blob:')) {
        return clean;
    }
    const base = getBaseUrl();
    if (base.startsWith('http')) {
        try {
            const origin = new URL(base).origin;
            return clean.startsWith('/') ? `${origin}${clean}` : `${origin}/${clean}`;
        } catch (e) {
            return clean;
        }
    }
    return clean;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar automáticamente el JWT en cada request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para capturar errores globales (ej. token expirado 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!error.config?.url?.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_session');
            }
        }
        return Promise.reject(error);
    }
);

export default api;