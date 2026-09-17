import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

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

                    let fullName = rawNombre;
                    if (apellido && !fullName.toLowerCase().includes(apellido.toLowerCase())) {
                        fullName = `${fullName} ${apellido}`.trim();
                    }

                    const fullUserData = {
                        ...userData,
                        nombre: fullName || rawNombre,
                        apellido: apellido,
                    };

                    if (fullName) localStorage.setItem('user_name', fullName);
                    if (apellido) localStorage.setItem('user_apellido', apellido);
                    setUser(fullUserData);
                } catch (error) {
                    console.error('Error al recuperar sesión:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);

        const rawUser = data.user || data || {};
        const apellido = rawUser.apellido || rawUser.lastName || data.apellido || '';
        const rawNombre = rawUser.nombre || rawUser.name || rawUser.firstName || data.nombre || '';

        let fullName = rawNombre;
        if (apellido && !fullName.toLowerCase().includes(apellido.toLowerCase())) {
            fullName = `${fullName} ${apellido}`.trim();
        }

        const userData = {
            id: rawUser.id || data.id,
            nombre: fullName || rawNombre,
            apellido: apellido,
            email: rawUser.email || data.email,
            rol: rawUser.rol || rawUser.role || data.rol || 'FAMILIAR',
        };

        localStorage.setItem('token', data.token);
        if (userData.id) localStorage.setItem('user_id', userData.id);
        if (fullName) localStorage.setItem('user_name', fullName);
        if (apellido) localStorage.setItem('user_apellido', apellido);
        if (userData.email) localStorage.setItem('user_email', userData.email);
        if (userData.rol) localStorage.setItem('user_role', userData.rol);
        localStorage.setItem('user_session', JSON.stringify(userData));

        setToken(data.token);
        setUser(userData);

        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_apellido');
        localStorage.removeItem('user_session');
        setToken(null);
        setUser(null);
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