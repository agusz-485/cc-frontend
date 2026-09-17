import { LayoutDashboard, MessageSquare, Calendar, Users, FileText, Settings, Shield, LogOut, Heart, Bell, DollarSign, Award } from "lucide-react";
import { P } from "../../shared";
import logoCareConnect from "../../assets/logo_careconnect.png";

export function Sidebar({ active, setActive, navigate, role, setRole, userName }) {
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

    // Lazy icons to prevent import bloat or missing imports
    const UserIcon = Users;

    const items = getSidebarItems();
    const badge = role === "familiar" ? {} : role === "cuidador" ? { solicitudes: 1 } : {};

    const getProfileInfo = () => {
        const name = userName || localStorage.getItem("user_name");
        const storedEmail = localStorage.getItem("user_email");
        if (role === "cuidador") return { name: name || "María González", desc: storedEmail || "Cuidador / Enfermero" };
        if (role === "administrador") return { name: name || "Admin Principal", desc: storedEmail || "Administrador" };
        return { name: name || "Familia García", desc: storedEmail || "Cuenta Familiar" };
    };

    const profile = getProfileInfo();

    return (<aside className="w-56 flex-shrink-0 flex flex-col" style={{ backgroundColor: P.dark }}>
        <div className="px-5 py-5.5 flex items-center justify-center border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <button type="button" onClick={() => navigate("/directory")} className="hover:scale-[1.02] transition-transform duration-200 focus:outline-none animate-none cursor-pointer" aria-label="Ir al Marketplace de CareConnect">
                <img src={logoCareConnect} alt="CareConnect" className="h-9 w-auto object-contain brightness-0 invert" />
            </button>
        </div>

        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: role === "administrador" ? P.accent : P.secondary }}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white truncate max-w-32" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{profile.desc}</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {items.map(({ id, icon: Icon, label }) => (<button key={id} onClick={() => setActive(id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium text-left transition-all" style={{
                backgroundColor: active === id ? "rgba(37,150,190,0.18)" : "transparent",
                color: active === id ? P.accent : "rgba(255,255,255,0.6)",
                borderLeft: `3px solid ${active === id ? P.accent : "transparent"}`,
            }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {badge[id] && (<span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: P.accent, color: "white" }}>
                    {badge[id]}
                </span>)}
            </button>))}
        </nav>



        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_role");
                localStorage.removeItem("user_email");
                localStorage.removeItem("user_name");
                navigate("/");
            }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}>
                <LogOut className="w-4 h-4" />
                Cerrar sesión
            </button>
        </div>
    </aside>);
}
