import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getMediaUrl } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_apellido');
        localStorage.removeItem('user_foto');
        localStorage.removeItem('user_foto_perfil');
        localStorage.removeItem('user_session');
        setToken(null);
        setUser(null);
    }, []);

    // Escuchar expiración automática de sesión desde el interceptor de peticiones
    useEffect(() => {
        const handleSessionExpired = () => {
            console.warn('⚠️ Evento de expiración de sesión recibido en AuthContext. Reseteando estado...');
            logout();
        };

        window.addEventListener('careconnect:session_expired', handleSessionExpired);
        return () => {
            window.removeEventListener('careconnect:session_expired', handleSessionExpired);
        };
    }, [logout]);

    // Al recargar la página, si hay token, intentamos recuperar el perfil
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const data = await authService.getProfile();
                    const userData = data?.user || data || {};
                    const apellido = userData.apellido || userData.lastName || localStorage.getItem('user_apellido') || '';
                    const rawNombre = userData.nombre || userData.name || userData.firstName || localStorage.getItem('user_name') || '';
                    const rawFoto = userData.fotoPerfil || userData.fotoUrl || userData.foto || localStorage.getItem('user_foto') || localStorage.getItem('user_foto_perfil') || '';

                    let fullName = rawNombre;
                    if (apellido && !fullName.toLowerCase().includes(apellido.toLowerCase())) {
                        fullName = `${fullName} ${apellido}`.trim();
                    }

                    const fullUserData = {
                        ...userData,
                        nombre: fullName || rawNombre,
                        apellido: apellido,
                        fotoPerfil: rawFoto,
                        foto: rawFoto,
                    };

                    if (fullName) localStorage.setItem('user_name', fullName);
                    if (apellido) localStorage.setItem('user_apellido', apellido);
                    if (rawFoto) {
                        localStorage.setItem('user_foto', rawFoto);
                        localStorage.setItem('user_foto_perfil', rawFoto);
                    }
                    setUser(fullUserData);
                } catch (error) {
                    console.warn('Sesión caducada o inválida en el servidor:', error?.message);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [logout]);

    const login = async (credentials) => {
        const data = await authService.login(credentials);

        const rawUser = data.user || data || {};
        const apellido = rawUser.apellido || rawUser.lastName || data.apellido || '';
        const rawNombre = rawUser.nombre || rawUser.name || rawUser.firstName || data.nombre || '';
        const rawFoto = rawUser.fotoPerfil || rawUser.fotoUrl || rawUser.foto || data.fotoPerfil || data.foto || '';

        let fullName = rawNombre;
        if (apellido && !fullName.toLowerCase().includes(apellido.toLowerCase())) {
            fullName = `${fullName} ${apellido}`.trim();
        }

        const userData = {
            id: rawUser.id || data.id,
            nombre: fullName || rawNombre,
            apellido: apellido,
            email: rawUser.email || data.email,
            fotoPerfil: rawFoto,
            foto: rawFoto,
            rol: rawUser.rol || rawUser.role || data.rol || 'FAMILIAR',
        };

        localStorage.setItem('token', data.token);
        if (userData.id) localStorage.setItem('user_id', userData.id);
        if (fullName) localStorage.setItem('user_name', fullName);
        if (apellido) localStorage.setItem('user_apellido', apellido);
        if (userData.email) localStorage.setItem('user_email', userData.email);
        if (userData.rol) localStorage.setItem('user_role', userData.rol);
        if (rawFoto) {
            localStorage.setItem('user_foto', rawFoto);
            localStorage.setItem('user_foto_perfil', rawFoto);
        }
        localStorage.setItem('user_session', JSON.stringify(userData));

        setToken(data.token);
        setUser(userData);

        return data;
    };

    const updateUser = (partialData) => {
        setUser((prev) => {
            const updated = { ...(prev || {}), ...partialData };
            if (partialData.fotoPerfil || partialData.foto) {
                const f = partialData.fotoPerfil || partialData.foto;
                localStorage.setItem('user_foto', f);
                localStorage.setItem('user_foto_perfil', f);
            }
            if (partialData.nombre) localStorage.setItem('user_name', partialData.nombre);
            localStorage.setItem('user_session', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                loading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};