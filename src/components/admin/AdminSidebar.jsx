import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Shield, Users, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoCareConnect from "../../assets/logo_careconnect.png";
import { P } from "../shared";

export default function AdminSidebar({ activeTab = "inicio_admin", setActiveTab }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const items = [
        { id: "inicio_admin", icon: LayoutDashboard, label: "Métricas" },
        { id: "moderacion", icon: Shield, label: "Verificaciones" },
        { id: "gestion_usuarios", icon: Users, label: "Usuarios" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Si el nombre es solo "Super", mostramos "Super Admin"
    const displayName = user?.nombre?.toLowerCase() === "super" 
        ? "Super Admin" 
        : (user?.nombre || "Administrador");

    return (
        <aside className="w-56 flex-shrink-0 flex flex-col h-screen" style={{ backgroundColor: P?.dark || "#0f172a" }}>
            {/* Logo */}
            <div className="px-5 py-5.5 flex items-center justify-center border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <button type="button" onClick={() => navigate("/directory")} className="hover:scale-[1.02] transition-transform duration-200 focus:outline-none cursor-pointer" aria-label="Ir al Marketplace de CareConnect">
                    <img src={logoCareConnect} alt="CareConnect" className="h-9 w-auto object-contain brightness-0 invert" />
                </button>
            </div>

            {/* Perfil del Administrador conectado */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: P?.accent || "#ea580c" }}>
                        SA
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {displayName}
                        </p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Acceso Total ✦</p>
                    </div>
                </div>
            </div>

            {/* Navegación activa */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                {items.map(({ id, icon: Icon, label }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium text-left transition-all cursor-pointer"
                            style={{
                                backgroundColor: isActive ? "rgba(37,150,190,0.18)" : "transparent",
                                color: isActive ? (P?.accent || "#38bdf8") : "rgba(255,255,255,0.6)",
                                borderLeft: `3px solid ${isActive ? (P?.accent || "#38bdf8") : "transparent"}`,
                            }}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Botón Salir */}
            <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}