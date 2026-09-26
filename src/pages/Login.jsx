import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login({ email, password });

            // Busca el rol tanto plano como anidado
            const rawRole = data?.rol || data?.role || data?.user?.rol || data?.user?.role || '';
            const role = rawRole.toUpperCase();

            console.log('Datos recibidos:', data, 'Rol detectado:', role);

            if (role.includes('ADMIN')) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.response?.data?.message || 'Credenciales inválidas o error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">CareConnect</h2>

                {error && (
                    <div className="mb-4 rounded bg-red-100 p-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="ejemplo@careconnect.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}