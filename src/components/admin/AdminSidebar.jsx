import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Shield, Users, AlertTriangle, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoCareConnect from "../../assets/logo_careconnect.png";
import { P } from "../shared";

export default function AdminSidebar({ 
    activeTab = "inicio_admin", 
    setActiveTab, 
    isOpen = false, 
    onClose = () => {} 
}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Cerrar al presionar Escape en móvil
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const items = [
        { id: "inicio_admin", icon: LayoutDashboard, label: "Métricas" },
        { id: "moderacion", icon: Shield, label: "Verificaciones" },
        { id: "gestion_usuarios", icon: Users, label: "Usuarios" },
        { id: "reportes", icon: AlertTriangle, label: "Reportes" },
    ];

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
        navigate("/login");
    };

    const handleItemClick = (id) => {
        setActiveTab(id);
        if (onClose) onClose();
    };

    const displayName = user?.nombre?.toLowerCase() === "super" 
        ? "Super Admin" 
        : (user?.nombre || "Administrador");

    const renderSidebarContent = (isMobile = false) => (
        <>
            {/* Logo */}
            <div className="px-5 py-4.5 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <button 
                    type="button" 
                    onClick={() => {
                        if (isMobile && onClose) onClose();
                        navigate("/directory");
                    }} 
                    className="hover:scale-[1.02] transition-transform duration-200 focus:outline-none cursor-pointer" 
                    aria-label="Ir al Marketplace de CareConnect"
                >
                    <img src={logoCareConnect} alt="CareConnect" className="h-8.5 w-auto object-contain brightness-0 invert" />
                </button>

                {isMobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Perfil del Administrador conectado */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: P?.accent || "#ea580c" }}>
                        SA
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {displayName}
                        </p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Acceso Total ✦</p>
                    </div>
                </div>
            </div>

            {/* Navegación activa */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                {items.map(({ id, icon: Icon, label }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleItemClick(id)}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all cursor-pointer"
                            style={{
                                backgroundColor: isActive ? "rgba(37,150,190,0.2)" : "transparent",
                                color: isActive ? (P?.accent || "#38bdf8") : "rgba(255,255,255,0.7)",
                                borderLeft: `3px solid ${isActive ? (P?.accent || "#38bdf8") : "transparent"}`,
                            }}
                        >
                            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
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
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                >
                    <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside 
                className="hidden md:flex w-56 flex-shrink-0 flex-col h-screen sticky top-0" 
                style={{ backgroundColor: P?.dark || "#0f172a" }}
            >
                {renderSidebarContent(false)}
            </aside>

            {/* Mobile Drawer */}
            <div className="md:hidden">
                <div 
                    className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
                        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={onClose}
                    aria-hidden="true"
                />
                <aside 
                    className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
                    }`}
                    style={{ backgroundColor: P?.dark || "#0f172a" }}
                    aria-modal="true"
                    role="dialog"
                >
                    {renderSidebarContent(true)}
                </aside>
            </div>
        </>
    );
}