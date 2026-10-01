import axios from 'axios';

const BACKEND_PROD_URL = 'https://cc-backend-cfar.onrender.com';

const getBaseUrl = () => {
    let envUrl = (import.meta.env.VITE_API_URL || '').trim();
    if (!envUrl) {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `${BACKEND_PROD_URL}/api/v1`;
        }
        return '/api/v1'; // Usa el proxy de Vite en desarrollo local
    }
    envUrl = envUrl.replace(/\/+$/, '');
    if (!envUrl.endsWith('/api/v1')) {
        envUrl = `${envUrl}/api/v1`;
    }
    return envUrl;
};

/**
 * Convierte rutas relativas o URLs desalineadas de uploads a URLs absolutas funcionales hacia el backend.
 */
export const getMediaUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    let clean = url.trim();
    if (!clean) return '';
    
    // Si ya es un data URI o blob local en memoria
    if (clean.startsWith('data:') || clean.startsWith('blob:')) {
        return clean;
    }

    // Corregir URLs guardadas que apuntaban por error al dominio de frontend o localhost
    if (clean.includes('vercel.app/api/v1/uploads') || clean.includes('localhost:5173/api/v1/uploads') || clean.includes('vercel.app/uploads')) {
        clean = clean.replace(/https?:\/\/[^\/]+/, BACKEND_PROD_URL);
        return clean;
    }

    // Si ya es URL completa HTTP/HTTPS hacia el backend o cloud storage
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        return clean;
    }

    // Si es una ruta relativa (/api/v1/uploads/..., /uploads/...)
    const base = getBaseUrl();
    const origin = base.startsWith('http') ? new URL(base).origin : BACKEND_PROD_URL;
    return clean.startsWith('/') ? `${origin}${clean}` : `${origin}/${clean}`;
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