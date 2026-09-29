import { useState } from "react";
import { P } from "../../shared";
import { useAuth } from "../../context/AuthContext";

export function CuidadorNotificationsTab() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState({
        solicitudes: true,
        mensajes: true,
        recordatorios: true,
        liquidaciones: true,
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
            label: "Nuevas solicitudes de turnos y contrataciones",
            desc: "Alerta inmediata cuando una familia te envíe una solicitud de servicio o turno.",
        },
        {
            key: "mensajes",
            label: "Mensajes de familias y clientes",
            desc: "Notificación cuando recibas un nuevo mensaje en el chat de CareConnect.",
        },
        {
            key: "recordatorios",
            label: "Recordatorios de turnos programados",
            desc: "Avisos 24 horas y 2 horas antes de cada turno de cuidado asignado.",
        },
        {
            key: "liquidaciones",
            label: "Avisos de cobros y liquidaciones",
            desc: "Notificación automática cuando se procese un depósito de honorarios en tu cuenta bancaria.",
        },
    ];

    const userEmail = user?.email || localStorage.getItem("user_email") || "tu-email@profesional.com";
    const userPhone = user?.telefono || localStorage.getItem("user_phone") || "+54 9 11 0000-0000";

    return (
        <div className="rounded-2xl overflow-hidden bg-white border" style={{ borderColor: P.baseNeutral }}>
            <div className="px-6 py-4 border-b text-left" style={{ borderColor: P.baseNeutral }}>
                <p className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Preferencias de Alertas Profesionales
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

export default CuidadorNotificationsTab;
