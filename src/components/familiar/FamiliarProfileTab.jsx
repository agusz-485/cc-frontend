import { useState, useEffect } from "react";
import { Edit, Loader2, AlertCircle, RefreshCw, User } from "lucide-react";
import { P } from "../../shared";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { AddressLocationFields } from "../ui/AddressLocationFields";

export function FamiliarProfileTab({ onProfileUpdate }) {
    const { user } = useAuth();
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
    const [notasFamilia, setNotasFamilia] = useState("");

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
            setNotasFamilia(userData.notas || userData.notes || localProfile.notasFamilia || localStorage.getItem("user_notes") || "");
        } catch (err) {
            console.error("Error al cargar perfil de familiar:", err);
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
            notas: notasFamilia,
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
        localStorage.setItem("user_notes", notasFamilia);

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
                <p className="text-sm font-semibold" style={{ color: P.dark }}>Cargando datos del perfil...</p>
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

    const avatarInitial = (nombre ? nombre[0] : (email ? email[0] : "F")).toUpperCase();

    return (
        <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
            {/* Header del perfil */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: P.baseNeutral }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ backgroundColor: P.secondary }}>
                    {avatarInitial}
                </div>
                <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-800 text-base truncate">{nombre || "Familiar"}</p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            Familiar / Contratante
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{email || "sin-email@email.com"}</p>
                </div>
                <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold hover:opacity-80 cursor-pointer" style={{ border: `1px solid ${P.baseNeutral}`, color: P.dark }}>
                    <Edit className="w-3.5 h-3.5" /> Cambiar foto
                </button>
            </div>

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
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Teléfono de contacto</label>
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
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>DNI</label>
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

            {/* Notas del hogar para cuidadores */}
            <div className="mt-5 pt-5 border-t text-left" style={{ borderColor: P.baseNeutral }}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                    Notas adicionales del hogar o requerimientos para cuidadores
                </label>
                <textarea
                    rows={3}
                    value={notasFamilia}
                    onChange={e => setNotasFamilia(e.target.value)}
                    placeholder="Ej. Mi madre tiene 78 años. Preferimos cuidadores con experiencia en rehabilitación..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none border focus:border-blue-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                />
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

export default FamiliarProfileTab;
