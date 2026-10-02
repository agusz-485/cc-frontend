import React, { useEffect } from "react";
import { 
    LayoutDashboard, 
    MessageSquare, 
    Calendar, 
    Users, 
    FileText, 
    Settings, 
    Shield, 
    LogOut, 
    Heart, 
    Bell, 
    DollarSign, 
    Award, 
    X,
    User as UserIcon 
} from "lucide-react";
import { P } from "../../shared";
import logoCareConnect from "../../assets/logo_careconnect.png";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ 
    active, 
    setActive, 
    navigate, 
    role, 
    setRole, 
    userName, 
    userFoto,
    badges = {},
    isOpen = false,
    onClose = () => {} 
}) {
    const { user, logout } = useAuth();

    // Cerrar drawer al presionar la tecla Escape
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

    const getSidebarItems = () => {
        if (role === "cuidador") {
            return [
                { id: "inicio_cuidador", icon: LayoutDashboard, label: "Inicio" },
                { id: "messages", icon: MessageSquare, label: "Mensajes" },
                { id: "solicitudes", icon: Bell, label: "Solicitudes" },
                { id: "perfil_profesional", icon: UserIcon, label: "Perfil Profesional" },
                { id: "agenda", icon: Calendar, label: "Mi Agenda" },
                { id: "ganancias", icon: DollarSign, label: "Ganancias" },
                { id: "certificados", icon: Award, label: "Certificaciones" },
                { id: "settings", icon: Settings, label: "Configuración" },
            ];
        }
        if (role === "administrador") {
            return [
                { id: "inicio_admin", icon: LayoutDashboard, label: "Métricas" },
                { id: "moderacion", icon: Shield, label: "Verificaciones" },
                { id: "gestion_usuarios", icon: Users, label: "Usuarios" },
            ];
        }
        return [
            { id: "inicio", icon: LayoutDashboard, label: "Inicio" },
            { id: "messages", icon: MessageSquare, label: "Mensajes" },
            { id: "bookings", icon: Calendar, label: "Reservas" },
            { id: "adultos_a_cargo", icon: Heart, label: "Adultos a Cargo" },
            { id: "caregivers", icon: UserIcon, label: "Mis Cuidadores" },
            { id: "documents", icon: FileText, label: "Documentos" },
            { id: "settings", icon: Settings, label: "Configuración" },
        ];
    };

    const items = getSidebarItems();
    const badge = badges || {};

    const getProfileInfo = () => {
        const name = userName || user?.nombre || localStorage.getItem("user_name");
        const storedEmail = user?.email || localStorage.getItem("user_email");
        const foto = userFoto || user?.fotoPerfil || user?.foto || localStorage.getItem("user_foto") || localStorage.getItem("user_foto_perfil");
        if (role === "cuidador") return { name: name || "Profesional de Cuidado", desc: storedEmail || "Cuidador / Enfermero", foto };
        if (role === "administrador") return { name: name || "Administrador", desc: storedEmail || "Panel de Administración", foto };
        return { name: name || "Usuario", desc: storedEmail || "Cuenta Familiar", foto };
    };

    const profile = getProfileInfo();

    const handleItemClick = (id) => {
        setActive(id);
        if (onClose) onClose();
    };

    const handleLogout = () => {
        if (logout) logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_foto");
        localStorage.removeItem("user_foto_perfil");
        if (onClose) onClose();
        navigate("/");
    };

    // Contenido común del Sidebar (navegación, perfil, logout)
    const renderSidebarContent = (isMobile = false) => (
        <>
            {/* Header del Sidebar */}
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

                {/* Botón cerrar en vista móvil */}
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

            {/* Perfil del Usuario Activo */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3">
                    <UserAvatar
                        src={profile.foto}
                        name={profile.name}
                        tipo={role}
                        size="sm"
                        shape="rounded-full"
                        className="w-10 h-10 border border-white/20 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {profile.name}
                        </p>
                        <p className="text-xs truncate text-white/50">{profile.desc}</p>
                    </div>
                </div>
            </div>

            {/* Navegación por Pestañas */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                {items.map(({ id, icon: Icon, label }) => {
                    const isActive = active === id;
                    return (
                        <button 
                            key={id} 
                            type="button"
                            onClick={() => handleItemClick(id)} 
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all cursor-pointer" 
                            style={{
                                backgroundColor: isActive ? "rgba(37,150,190,0.2)" : "transparent",
                                color: isActive ? P.accent : "rgba(255,255,255,0.7)",
                                borderLeft: `3px solid ${isActive ? P.accent : "transparent"}`,
                            }}
                        >
                            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                            <span className="flex-1 font-medium">{label}</span>
                            {badge[id] && (
                                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: P.accent, color: "white" }}>
                                    {badge[id]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Pie con Cierre de Sesión */}
            <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <button 
                    type="button"
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors text-white/60 hover:text-white cursor-pointer"
                >
                    <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* 1. SIDEBAR DESKTOP */}
            <aside 
                className="hidden md:flex w-56 flex-shrink-0 flex-col h-screen sticky top-0" 
                style={{ backgroundColor: P.dark }}
            >
                {renderSidebarContent(false)}
            </aside>

            {/* 2. MENU DESPLEGABLE / DRAWER MÓVIL */}
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
                    style={{ backgroundColor: P.dark }}
                    aria-modal="true"
                    role="dialog"
                >
                    {renderSidebarContent(true)}
                </aside>
            </div>
        </>
    );
}

export default Sidebar;
