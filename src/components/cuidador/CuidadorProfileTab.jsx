import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { P } from "../../shared";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { AddressLocationFields } from "../ui/AddressLocationFields";
import { CuidadorProfileHeader } from "./CuidadorProfileHeader";

export function CuidadorProfileTab({ onProfileUpdate, role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "cuidador").toLowerCase();
    const isEnfermero = activeRole.includes("enfermero");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [dni, setDni] = useState("");
    const [direccion, setDireccion] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [cp, setCp] = useState("");
    const [bioPersonal, setBioPersonal] = useState("");
    const [disponibilidadContacto, setDisponibilidadContacto] = useState("");

    const [saveState, setSaveState] = useState("normal");

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.getProfile();
            const userData = data?.user || data || {};
            const userId = userData.id || user?.id || localStorage.getItem("user_id") || "current";

            let localProfile = {};
            try {
                const stored = localStorage.getItem(`user_profile_${userId}`);
                if (stored) localProfile = JSON.parse(stored);
            } catch {}

            let userDisplayName = userData.nombre || userData.name || localProfile.nombre || localStorage.getItem("user_name") || "";
            if (userData.apellido && !userDisplayName.toLowerCase().includes(userData.apellido.toLowerCase())) {
                userDisplayName = `${userDisplayName} ${userData.apellido}`.trim();
            }

            setNombre(userDisplayName || "");
            setEmail(userData.email || localProfile.email || localStorage.getItem("user_email") || "");
            setTelefono(userData.telefono || userData.phone || localProfile.telefono || localStorage.getItem("user_phone") || "");
            setDni(userData.dni || localProfile.dni || localStorage.getItem("user_dni") || "");
            setDireccion(userData.direccion || userData.address || localProfile.direccion || localStorage.getItem("user_address") || "");
            setProvincia(userData.provincia || userData.province || localProfile.provincia || localStorage.getItem("user_province") || "");
            setCiudad(userData.ciudad || userData.city || localProfile.ciudad || localStorage.getItem("user_city") || "");
            setCp(userData.cp || userData.codigoPostal || localProfile.cp || localStorage.getItem("user_cp") || "");
            setBioPersonal(userData.descripcion || localProfile.bioPersonal || localStorage.getItem("user_bio_personal") || "");
            setDisponibilidadContacto(localProfile.disponibilidadContacto || localStorage.getItem("user_disp_contacto") || "Horario comercial (8:00 a 20:00)");
        } catch (err) {
            console.error("Error al cargar perfil profesional:", err);
            setError("No se pudo cargar la información del perfil desde el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSaveProfile = async () => {
        setSaveState("saving");
        const userId = user?.id || localStorage.getItem("user_id") || "current";

        const payload = {
            nombre,
            email,
            telefono,
            dni,
            direccion,
            provincia,
            ciudad,
            cp,
            codigoPostal: cp,
            bioPersonal,
            disponibilidadContacto,
        };

        try {
            await authService.updateProfile(payload);
        } catch (err) {
            console.warn("No se pudo persistir en /auth/me, guardando localmente:", err);
        }

        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(payload));
        localStorage.setItem("user_name", nombre);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_phone", telefono);
        localStorage.setItem("user_dni", dni);
        localStorage.setItem("user_address", direccion);
        localStorage.setItem("user_province", provincia);
        localStorage.setItem("user_city", ciudad);
        localStorage.setItem("user_cp", cp);
        localStorage.setItem("user_bio_personal", bioPersonal);
        localStorage.setItem("user_disp_contacto", disponibilidadContacto);

        if (onProfileUpdate) {
            onProfileUpdate(nombre);
        }

        setSaveState("saved");
        setTimeout(() => setSaveState("normal"), 2000);
    };

    if (loading) {
        return (
            <div className="rounded-2xl p-12 bg-white border flex flex-col items-center justify-center min-h-[320px]" style={{ borderColor: P.baseNeutral }}>
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: P.primary }} />
                <p className="text-sm font-semibold" style={{ color: P.dark }}>Cargando datos del perfil profesional...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl p-8 bg-white border flex flex-col items-center justify-center text-center min-h-[280px]" style={{ borderColor: P.baseNeutral }}>
                <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
                <p className="font-bold text-slate-800 mb-1">Error al obtener el perfil</p>
                <p className="text-xs text-slate-500 mb-4">{error}</p>
                <button
                    onClick={loadProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: P.primary }}
                >
                    <RefreshCw className="w-4 h-4" /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
            <CuidadorProfileHeader nombre={nombre} email={email} isEnfermero={isEnfermero} />

            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Nombre y Apellido</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-slate-50 text-slate-400 cursor-not-allowed"
                        style={{ borderColor: P.baseNeutral }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Teléfono / WhatsApp de contacto</label>
                    <input
                        type="tel"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        placeholder="Ej. +54 9 11 2345-6789"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>DNI / Documento Nacional</label>
                    <input
                        type="text"
                        value={dni}
                        onChange={e => setDni(e.target.value)}
                        placeholder="Ej. 38123456"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    />
                </div>

                <AddressLocationFields
                    direccion={direccion}
                    setDireccion={setDireccion}
                    provincia={provincia}
                    setProvincia={setProvincia}
                    ciudad={ciudad}
                    setCiudad={setCiudad}
                    cp={cp}
                    setCp={setCp}
                />
            </div>

            <div className="mt-5 pt-5 border-t text-left" style={{ borderColor: P.baseNeutral }}>
                <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                        Horario preferido para coordinación de contacto y llamados
                    </label>
                    <input
                        type="text"
                        value={disponibilidadContacto}
                        onChange={e => setDisponibilidadContacto(e.target.value)}
                        placeholder="Ej. Lunes a Viernes de 8:00 a 19:00 hs"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                        Resumen / Nota de perfil personal
                    </label>
                    <textarea
                        rows={3}
                        value={bioPersonal}
                        onChange={e => setBioPersonal(e.target.value)}
                        placeholder="Breve presentación sobre tu vocación de cuidado o trayectoria..."
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none border focus:border-blue-500"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    />
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t" style={{ borderColor: P.baseNeutral }}>
                <button
                    onClick={handleSaveProfile}
                    disabled={saveState === "saving"}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-85 cursor-pointer shadow-sm hover:opacity-95"
                    style={{
                        backgroundColor: saveState === "saved" ? "#10b981" : (saveState === "saving" ? P.neutralDark : P.primary)
                    }}
                >
                    {saveState === "saving" ? "Guardando..." : (saveState === "saved" ? "¡Datos guardados! ✓" : "Guardar cambios")}
                </button>
            </div>
        </div>
    );
}

export default CuidadorProfileTab;
