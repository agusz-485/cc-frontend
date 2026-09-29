import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1', // Usa el proxy de Vite en dev o la URL configurada
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