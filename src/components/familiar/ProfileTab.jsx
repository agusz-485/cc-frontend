import { useState, useEffect } from "react";
import { Edit, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { P } from "../../shared";
import { PROVINCIAS_ARGENTINA } from "../../shared/locations";
import { authService } from "../../services/authService";

export function ProfileTab({ onProfileUpdate }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [cp, setCp] = useState("");
    const [notas, setNotas] = useState("");

    const [saveState, setSaveState] = useState("normal"); // "normal" | "saving" | "saved"

    // Cargar datos reales desde el endpoint /auth/me al montar el componente
    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.getProfile();
            const userData = data?.user || data || {};
            const userId = userData.id || localStorage.getItem("user_id") || "current";

            let localProfile = {};
            try {
                const storedProfile = localStorage.getItem(`user_profile_${userId}`);
                if (storedProfile) {
                    localProfile = JSON.parse(storedProfile);
                }
            } catch {
                localProfile = {};
            }

            let userDisplayName = userData.nombre || userData.name || localProfile.nombre || localStorage.getItem("user_name") || "";
            if (userData.apellido && !userDisplayName.toLowerCase().includes(userData.apellido.toLowerCase())) {
                userDisplayName = `${userDisplayName} ${userData.apellido}`.trim();
            }
            const fetchedNombre = userDisplayName;
            const fetchedEmail = userData.email || localProfile.email || localStorage.getItem("user_email") || "";
            const fetchedTelefono = userData.telefono || userData.phone || localProfile.telefono || localStorage.getItem("user_phone") || "";
            const fetchedDireccion = userData.direccion || userData.address || localProfile.direccion || localStorage.getItem("user_address") || "";
            const fetchedProvincia = userData.provincia || userData.province || localProfile.provincia || localStorage.getItem("user_province") || "";
            const fetchedCiudad = userData.ciudad || userData.city || localProfile.ciudad || localStorage.getItem("user_city") || "";
            const fetchedCp = userData.cp || userData.codigoPostal || localProfile.cp || localStorage.getItem("user_cp") || "";
            const fetchedNotas = userData.notas || userData.notes || localProfile.notas || localStorage.getItem("user_notes") || "";

            setNombre(fetchedNombre);
            setEmail(fetchedEmail);
            setTelefono(fetchedTelefono);
            setDireccion(fetchedDireccion);
            setProvincia(fetchedProvincia);
            setCiudad(fetchedCiudad);
            setCp(fetchedCp);
            setNotas(fetchedNotas);
        } catch (err) {
            console.error("Error al cargar perfil desde /auth/me:", err);
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
        const userId = localStorage.getItem("user_id") || "current";

        const payload = {
            nombre,
            email,
            telefono,
            direccion,
            provincia,
            ciudad,
            cp,
            codigoPostal: cp,
            notas,
        };

        try {
            await authService.updateProfile(payload);
        } catch (err) {
            console.warn("No se pudo persistir en el endpoint del servidor, actualizando localmente:", err);
        }

        // Guardar persistencia específica para el usuario
        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(payload));
        localStorage.setItem("user_name", nombre);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_phone", telefono);
        localStorage.setItem("user_address", direccion);
        localStorage.setItem("user_province", provincia);
        localStorage.setItem("user_city", ciudad);
        localStorage.setItem("user_cp", cp);
        localStorage.setItem("user_notes", notas);

        if (onProfileUpdate) {
            onProfileUpdate(nombre);
        }

        setSaveState("saved");
        setTimeout(() => {
            setSaveState("normal");
        }, 2000);
    };

    if (loading) {
        return (
            <div className="rounded-2xl p-12 bg-white border flex flex-col items-center justify-center min-h-[320px]" style={{ borderColor: P.baseNeutral }}>
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: P.primary }} />
                <p className="text-sm font-semibold" style={{ color: P.dark }}>Cargando datos del perfil...</p>
                <p className="text-xs mt-1" style={{ color: P.neutralDark }}>Obteniendo información de /auth/me</p>
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

    const avatarInitial = (nombre ? nombre[0] : (email ? email[0] : "U")).toUpperCase();

    return (
        <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: P.baseNeutral }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ backgroundColor: P.secondary }}>
                    {avatarInitial}
                </div>
                <div className="text-left">
                    <p className="font-bold text-slate-800">{nombre || "Usuario"}</p>
                    <p className="text-sm text-slate-500">{email || "sin-email@email.com"}</p>
                </div>
                <button className="ml-auto flex items-center gap-1.5 px-4 py-2 border rounded-xl text-sm font-semibold hover:opacity-80 cursor-pointer" style={{ border: `1px solid ${P.baseNeutral}`, color: P.dark }}>
                    <Edit className="w-3.5 h-3.5" /> Editar foto
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Correo */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Correo electrónico</label>
                    <input type="email" value={email} disabled className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed border" style={{ borderColor: P.baseNeutral, color: "#94a3b8", backgroundColor: "#f8fafc" }} />
                </div>
                {/* Teléfono */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Teléfono</label>
                    <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. +54 9 11 2345-6789" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white border" style={{ borderColor: P.baseNeutral, color: P.dark }} />
                </div>
                {/* Dirección */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Dirección</label>
                    <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle y número" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white border" style={{ borderColor: P.baseNeutral, color: P.dark }} />
                </div>
                {/* Provincia */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Provincia</label>
                    <select
                        value={provincia}
                        onChange={e => {
                            setProvincia(e.target.value);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white border cursor-pointer"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    >
                        <option value="">Selecciona una provincia</option>
                        {Object.keys(PROVINCIAS_ARGENTINA).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                {/* Ciudad */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Ciudad / Barrio</label>
                    <select
                        value={ciudad}
                        onChange={e => setCiudad(e.target.value)}
                        disabled={!provincia}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed border cursor-pointer"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                    >
                        <option value="">Selecciona una ciudad</option>
                        {(PROVINCIAS_ARGENTINA[provincia] || []).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                {/* CP */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Código postal</label>
                    <input type="text" value={cp} onChange={e => setCp(e.target.value)} placeholder="Ej. 1425" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white border" style={{ borderColor: P.baseNeutral, color: P.dark }} />
                </div>
            </div>
            <div className="mt-4 text-left">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Notas adicionales para cuidadores</label>
                <textarea rows={3} value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej. Mi padre tiene 78 años. Camina con bastón. Toma medicación a las 8hs y 20hs..." className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none border" style={{ borderColor: P.baseNeutral, color: P.dark }} />
            </div>
            <div className="flex justify-end mt-5">
                <button
                    onClick={handleSaveProfile}
                    disabled={saveState === "saving"}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-85 cursor-pointer"
                    style={{
                        backgroundColor: saveState === "saved" ? "#10b981" : (saveState === "saving" ? P.neutralDark : P.primary)
                    }}
                >
                    {saveState === "saving" ? "Guardando..." : (saveState === "saved" ? "¡Guardado con éxito! ✓" : "Guardar cambios")}
                </button>
            </div>
        </div>
    );
}
