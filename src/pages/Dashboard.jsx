import { useAuth } from '../context/AuthContext';
import FamiliarDashboard from './dashboard/FamiliarDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import CuidadorDashboard from './dashboard/CuidadorDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();
    
    // Evaluar rol del usuario (soporta rol o role, por compatibilidad con el backend y AuthContext)
    const userRole = (user?.rol || user?.role || 'FAMILIAR').toUpperCase();

    if (userRole === 'FAMILIAR') {
        return <FamiliarDashboard />;
    }

    if (userRole === 'CUIDADOR' || userRole === 'ENFERMERO') {
        return <CuidadorDashboard />;
    }

    if (userRole === 'ADMIN' || userRole === 'ADMINISTRADOR') {
        return <AdminDashboard />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-extrabold">C</div>
                    <span className="font-extrabold text-teal-800 text-lg">CareConnect</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{user?.nombre || user?.email || 'Usuario'}</p>
                        <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">{userRole}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Contenido principal - Panel Informativo de Roles en Desarrollo */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l-4.64 4.64A2.238 2.238 0 113.63 16.68l4.64-4.64m3.15 3.13h-.028m-.016 0a.75.75 0 011.085-.045L15.75 9.75a2.25 2.25 0 00-3.182-3.182L9.75 9.75M11.42 15.17l3.15-3.13m-4.73 4.73L9 18M18 9l.008-.008" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 mb-2">Panel en Desarrollo</h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        El panel para el rol de <strong className="text-teal-700">{userRole}</strong> está siendo desarrollado por la Célula 4 y estará disponible próximamente.
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left text-slate-600 space-y-2">
                        <p className="font-bold text-slate-700 text-slate-800">¿Qué puedes probar ahora?</p>
                        <p>• Puedes cambiar tu rol temporalmente en <code className="bg-slate-200 px-1 py-0.5 rounded">src/context/AuthContext.jsx</code> a <code className="bg-slate-200 px-1 py-0.5 rounded">"FAMILIAR"</code> para probar el Panel Familiar.</p>
                        <p>• Visitar el <a href="/directory" className="text-teal-600 hover:underline font-semibold">Directorio de Búsqueda</a> para explorar profesionales de cuidado.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}