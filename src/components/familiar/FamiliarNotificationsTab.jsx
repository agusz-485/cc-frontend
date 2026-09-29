import { useState } from "react";
import { P } from "../../shared";
import { useAuth } from "../../context/AuthContext";

export function FamiliarNotificationsTab() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState({
        solicitudes: true,
        mensajes: true,
        recordatorios: true,
        marketing: false,
        email: true,
        whatsapp: true,
        sms: false,
    });

    const toggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

    const Toggle = ({ on, onClick }) => (
        <button
            onClick={onClick}
            type="button"
            className="w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            style={{ backgroundColor: on ? P.primary : P.baseNeutral }}
        >
            <div
                className="w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
            />
        </button>
    );

    const alerts = [
        {
            key: "solicitudes",
            label: "Confirmaciones y actualizaciones de turnos",
            desc: "Cuando un cuidador o enfermero acepte o actualice tu solicitud de servicio.",
        },
        {
            key: "mensajes",
            label: "Mensajes de cuidadores y enfermeros",
            desc: "Cuando el profesional a cargo te envíe un mensaje o reporte en el chat.",
        },
        {
            key: "recordatorios",
            label: "Recordatorios de inicio de servicio",
            desc: "Avisos 24 horas antes de la llegada del cuidador o enfermero al domicilio.",
        },
        {
            key: "marketing",
            label: "Novedades y cuidadores destacados",
            desc: "Recomendaciones de nuevos profesionales verificados en tu zona de cobertura.",
        },
    ];

    const userEmail = user?.email || localStorage.getItem("user_email") || "tu-email@correo.com";
    const userPhone = user?.telefono || localStorage.getItem("user_phone") || "+54 9 11 0000-0000";

    return (
        <div className="rounded-2xl overflow-hidden bg-white border" style={{ borderColor: P.baseNeutral }}>
            <div className="px-6 py-4 border-b text-left" style={{ borderColor: P.baseNeutral }}>
                <p className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alertas de Actividad Familiar
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Configura qué avisos deseas recibir en tiempo real</p>
            </div>

            {alerts.map(({ key, label, desc }, i, arr) => (
                <div
                    key={key}
                    className="flex items-center justify-between px-6 py-4 border-b text-left"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${P.baseNeutral}` : "none" }}
                >
                    <div className="mr-4">
                        <p className="text-sm font-semibold" style={{ color: P.dark }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: P.neutralDark }}>{desc}</p>
                    </div>
                    <Toggle on={notifs[key]} onClick={() => toggle(key)} />
                </div>
            ))}

            <div className="px-6 py-4 border-t text-left" style={{ borderColor: P.baseNeutral }}>
                <p className="font-bold text-sm mb-1" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Canales de notificación
                </p>
                <p className="text-xs text-slate-500 mb-3">Direcciones de contacto registradas en tu cuenta</p>

                {[
                    { key: "email", label: "Correo electrónico", desc: userEmail },
                    { key: "whatsapp", label: "WhatsApp / Mensajería", desc: userPhone },
                    { key: "sms", label: "SMS tradicional", desc: userPhone },
                ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: P.baseNeutral }}>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: P.dark }}>{label}</p>
                            <p className="text-xs font-mono" style={{ color: P.neutralDark }}>{desc}</p>
                        </div>
                        <Toggle on={notifs[key]} onClick={() => toggle(key)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FamiliarNotificationsTab;
