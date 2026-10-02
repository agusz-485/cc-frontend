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
 * Convierte rutas relativas o URLs de uploads a URLs funcionales hacia el backend correcto (local o producción),
 * preservando Data URIs, Blobs y URLs externas de CDNs.
 */
export const getMediaUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const clean = url.trim();
    if (!clean || clean === 'null' || clean === 'undefined') return '';
    
    // Si ya es un data URI o blob local en memoria
    if (clean.startsWith('data:') || clean.startsWith('blob:')) {
        return clean;
    }

    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Detectar si es un archivo subido al backend de CareConnect
    const uploadMatch = clean.match(/(?:https?:\/\/[^\/]+)?(?:\/api\/v1)?\/?uploads\/(.+)$/);
    if (uploadMatch && uploadMatch[1]) {
        const subPath = uploadMatch[1].replace(/^\/+/, '');
        if (isLocal) {
            return `/api/v1/uploads/${subPath}`;
        }
        return `${BACKEND_PROD_URL}/api/v1/uploads/${subPath}`;
    }

    // Ruta relativa pura comenzando con /api/v1/
    if (clean.startsWith('/api/v1/')) {
        if (isLocal) return clean;
        return `${BACKEND_PROD_URL}${clean}`;
    }

    // URL externa completa (Unsplash, Google, UI-Avatars, Cloudinary, etc.)
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        return clean;
    }

    // Fallback general para rutas relativas
    const normalized = clean.startsWith('/') ? clean : `/${clean}`;
    if (isLocal) {
        return normalized;
    }
    return `${BACKEND_PROD_URL}${normalized}`;
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

// Interceptor para respuestas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // No borrar destructivamente el token en requests de fondo secundarios para evitar invalidar la sesión
        return Promise.reject(error);
    }
);

export default api;