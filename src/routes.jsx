import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Directory from './pages/Directory';
import Profile from './pages/Profile';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* 1. Rutas Públicas (Marketplace, Landing, Perfiles de Cuidadores, Login, Registro) */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directorio" element={<Directory />} />
            <Route path="/marketplace" element={<Directory />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/cuidador/:id" element={<Profile />} />

            {/* 2. Rutas Privadas (Requieren sesión activa) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* 3. Ruta exclusiva de Administrador */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRADOR']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* 4. Fallback general */}
            <Route path="*" element={<Navigate to="/directory" replace />} />
        </Routes>
    );
};