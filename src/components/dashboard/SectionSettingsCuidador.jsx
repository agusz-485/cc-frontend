import { useState } from "react";
import { User, Wallet, Bell, Shield } from "lucide-react";
import { P } from "../../shared";
import {
    CuidadorProfileTab,
    CuidadorPayoutTab,
    CuidadorNotificationsTab,
    CuidadorSecurityTab
} from "../cuidador";
import { useAuth } from "../../context/AuthContext";

export function SectionSettingsCuidador({ onProfileUpdate, role = "cuidador" }) {
    const { user } = useAuth();
    const isEnfermero = (role || user?.rol || user?.role || "").toLowerCase().includes("enfermero");

    const [tab, setTab] = useState("profile");

    const tabsConfig = [
        { id: "profile", label: "Perfil Personal", icon: User },
        { id: "payment", label: "Datos de Cobro", icon: Wallet },
        { id: "notifications", label: "Notificaciones", icon: Bell },
        { id: "security", label: "Seguridad", icon: Shield },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 text-left">
                    <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {isEnfermero ? "Configuración de Enfermero" : "Configuración de Cuidador"}
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: P.neutralDark }}>
                        Administrá tus datos personales de contacto, cuenta bancaria para cobros y preferencias
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-2xl mb-6 bg-white border shadow-sm" style={{ borderColor: P.baseNeutral }}>
                    {tabsConfig.map(({ id, label, icon: Icon }) => {
                        const isActive = tab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                style={{
                                    backgroundColor: isActive ? P.primary : "transparent",
                                    color: isActive ? "white" : P.neutralDark,
                                    boxShadow: isActive ? `0 2px 8px ${P.primary}33` : "none",
                                }}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="truncate">{label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                {tab === "profile" && <CuidadorProfileTab onProfileUpdate={onProfileUpdate} role={role} />}
                {tab === "payment" && <CuidadorPayoutTab />}
                {tab === "notifications" && <CuidadorNotificationsTab />}
                {tab === "security" && <CuidadorSecurityTab />}
            </div>
        </div>
    );
}

export default SectionSettingsCuidador;
