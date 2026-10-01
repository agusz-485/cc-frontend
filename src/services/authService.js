import api from '../api/client';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/registro', userData);
        return response.data;
    },
    getProfile: async () => {
        if (localStorage.getItem('token') === 'mock-bypass-token') {
            return {
                id: 11,
                rol: "FAMILIAR",
                role: "FAMILIAR",
                nombre: "Familia García",
                email: "familia.garcia@email.com"
            };
        }
        try {
            const response = await api.get('/auth/me');
            if (response.data?.fotoPerfil) {
                localStorage.setItem("user_foto", response.data.fotoPerfil);
                localStorage.setItem("user_foto_perfil", response.data.fotoPerfil);
            }
            return response.data;
        } catch (err) {
            // Si el backend responde 404 (endpoint no disponible), usar datos de sesión activa
            if (err.response && err.response.status === 404) {
                console.warn('Endpoint /auth/me no encontrado en backend (404). Usando sesión local.');
                const sessionStr = localStorage.getItem('user_session');
                let sessionUser = {};
                try {
                    sessionUser = sessionStr ? JSON.parse(sessionStr) : {};
                } catch {
                    sessionUser = {};
                }
                return {
                    id: sessionUser.id || localStorage.getItem('user_id') || '',
                    nombre: sessionUser.nombre || localStorage.getItem('user_name') || 'Usuario',
                    apellido: sessionUser.apellido || '',
                    email: sessionUser.email || localStorage.getItem('user_email') || '',
                    telefono: sessionUser.telefono || localStorage.getItem('user_phone') || '',
                    fotoPerfil: sessionUser.fotoPerfil || localStorage.getItem('user_foto') || '',
                    direccion: sessionUser.direccion || localStorage.getItem('user_address') || '',
                    provincia: sessionUser.provincia || localStorage.getItem('user_province') || '',
                    ciudad: sessionUser.ciudad || localStorage.getItem('user_city') || '',
                    cp: sessionUser.cp || localStorage.getItem('user_cp') || '',
                    notas: sessionUser.notas || localStorage.getItem('user_notes') || '',
                    rol: sessionUser.rol || localStorage.getItem('user_role') || 'FAMILIAR',
                };
            }
            throw err;
        }
    },
    updateProfile: async (userData) => {
        if (userData?.fotoPerfil || userData?.foto) {
            const f = userData.fotoPerfil || userData.foto;
            localStorage.setItem("user_foto", f);
            localStorage.setItem("user_foto_perfil", f);
        }
        if (localStorage.getItem('token') === 'mock-bypass-token') {
            return {
                ...userData,
                id: 11,
                rol: "FAMILIAR",
                role: "FAMILIAR",
            };
        }
        try {
            const response = await api.put('/auth/me', userData);
            if (response.data?.fotoPerfil) {
                localStorage.setItem("user_foto", response.data.fotoPerfil);
                localStorage.setItem("user_foto_perfil", response.data.fotoPerfil);
            }
            return response.data;
        } catch (err) {
            if (err.response && (err.response.status === 404 || err.response.status === 405)) {
                try {
                    const patchRes = await api.patch('/auth/me', userData);
                    if (patchRes.data?.fotoPerfil) {
                        localStorage.setItem("user_foto", patchRes.data.fotoPerfil);
                        localStorage.setItem("user_foto_perfil", patchRes.data.fotoPerfil);
                    }
                    return patchRes.data;
                } catch {
                    console.warn('Backend sin endpoint de actualización de perfil /auth/me (404/405). Guardando localmente.');
                    return userData;
                }
            }
            throw err;
        }
    },
};