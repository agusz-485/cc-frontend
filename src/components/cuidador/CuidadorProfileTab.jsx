import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { P } from "../../shared";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { AddressLocationFields } from "../ui/AddressLocationFields";
import { CuidadorProfileHeader } from "./CuidadorProfileHeader";
import api from "../../api/client";

export function CuidadorProfileTab({ onProfileUpdate, role }) {
    const { user, updateUser } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "cuidador").toLowerCase();
    const isEnfermero = activeRole.includes("enfermero");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [dni, setDni] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
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

            let userDisplayName = userData.nombre || userData.name || localProfile.nombre || "";
            if (userData.apellido && !userDisplayName.toLowerCase().includes(userData.apellido.toLowerCase())) {
                userDisplayName = `${userDisplayName} ${userData.apellido}`.trim();
            }

            setNombre(userDisplayName || "");
            setEmail(userData.email || localProfile.email || "");
            setTelefono(userData.telefono || userData.phone || localProfile.telefono || "");
            setDni(userData.dni || localProfile.dni || "");
            setFotoPerfil(userData.fotoPerfil || userData.fotoUrl || localProfile.fotoPerfil || "");
            setDireccion(userData.direccion || userData.address || localProfile.direccion || "");
            setProvincia(userData.provincia || userData.province || localProfile.provincia || "");
            setCiudad(userData.ciudad || userData.city || localProfile.ciudad || "");
            setCp(userData.cp || userData.codigoPostal || localProfile.cp || "");
            setBioPersonal(userData.descripcion || localProfile.bioPersonal || "");
            setDisponibilidadContacto(localProfile.disponibilidadContacto || "Horario comercial (8:00 a 20:00)");
        } catch (err) {
            console.warn("No se pudo cargar el perfil desde el servidor, cargando datos de usuario:", err);
            const userId = user?.id || localStorage.getItem("user_id") || "current";
            let localProfile = {};
            try {
                const stored = localStorage.getItem(`user_profile_${userId}`);
                if (stored) localProfile = JSON.parse(stored);
            } catch {}

            let userDisplayName = user?.nombre || user?.name || localProfile.nombre || "";
            if (user?.apellido && !userDisplayName.toLowerCase().includes(user?.apellido?.toLowerCase())) {
                userDisplayName = `${userDisplayName} ${user?.apellido}`.trim();
            }

            setNombre(userDisplayName || "");
            setEmail(user?.email || localProfile.email || "");
            setTelefono(user?.telefono || user?.phone || localProfile.telefono || "");
            setDni(user?.dni || localProfile.dni || "");
            setFotoPerfil(user?.fotoPerfil || user?.fotoUrl || localProfile.fotoPerfil || "");
            setDireccion(user?.direccion || user?.address || localProfile.direccion || "");
            setProvincia(user?.provincia || user?.province || localProfile.provincia || "");
            setCiudad(user?.ciudad || user?.city || localProfile.ciudad || "");
            setCp(user?.cp || user?.codigoPostal || localProfile.cp || "");
            setBioPersonal(user?.descripcion || localProfile.bioPersonal || "");
            setDisponibilidadContacto(localProfile.disponibilidadContacto || "Horario comercial (8:00 a 20:00)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [user?.id]);

    const handleSaveProfile = async () => {
        setSaveState("saving");
        const userId = user?.id || localStorage.getItem("user_id") || "current";

        const payload = {
            nombre,
            apellido: user?.apellido || "",
            telefono,
            dni,
            direccion,
            provincia,
            ciudad,
            cp,
            descripcion: bioPersonal,
            fotoPerfil,
        };

        try {
            await authService.updateProfile(payload);
            if (userId && userId !== "current") {
                const endpoint = isEnfermero ? `/enfermeros/${userId}` : `/cuidadores/${userId}`;
                await api.put(endpoint, {
                    nombre,
                    telefono,
                    descripcion: bioPersonal,
                    fotoPerfil,
                }).catch(() => null);
            }
            if (updateUser) {
                updateUser({ nombre, telefono, fotoPerfil });
            }
        } catch (e) {
            console.warn("Actualización local fallback:", e);
        }

        const storageMap = {
            [`user_profile_${userId}`]: JSON.stringify(payload),
            user_name: nombre, user_email: email, user_phone: telefono, user_dni: dni,
            user_address: direccion, user_province: provincia,
            user_city: ciudad, user_cp: cp, user_bio_personal: bioPersonal,
            user_disp_contacto: disponibilidadContacto,
        };
        Object.entries(storageMap).forEach(([k, v]) => localStorage.setItem(k, v || ""));
        if (onProfileUpdate) onProfileUpdate(nombre);
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
                <button onClick={loadProfile} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90" style={{ backgroundColor: P.primary }}>
                    <RefreshCw className="w-4 h-4" /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
            <CuidadorProfileHeader
                nombre={nombre}
                email={email}
                isEnfermero={isEnfermero}
                fotoPerfil={fotoPerfil}
                onFotoChange={async (url) => {
                    setFotoPerfil(url);
                    if (updateUser) {
                        updateUser({ fotoPerfil: url });
                    }
                    try {
                        const uid = user?.id || localStorage.getItem("user_id");
                        if (uid && uid !== "current") {
                            const endpoint = isEnfermero ? `/enfermeros/${uid}` : `/cuidadores/${uid}`;
                            await api.put(endpoint, { fotoPerfil: url }).catch(() => null);
                        }
                        await authService.updateProfile({ fotoPerfil: url }).catch(() => null);
                    } catch (e) {
                        console.warn("No se pudo guardar la foto de perfil en el backend:", e);
                    }
                }}
            />

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

            <div className="mt-5 pt-5 border-t text-left space-y-4" style={{ borderColor: P.baseNeutral }}>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Horario preferido para coordinación</label>
                    <input type="text" value={disponibilidadContacto} onChange={e => setDisponibilidadContacto(e.target.value)} placeholder="Ej. Lunes a Viernes de 8:00 a 19:00 hs" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500" style={{ borderColor: P.baseNeutral, color: P.dark }} />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>Resumen / Nota de perfil personal</label>
                    <textarea rows={3} value={bioPersonal} onChange={e => setBioPersonal(e.target.value)} placeholder="Breve presentación sobre tu vocación de cuidado o trayectoria..." className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none border focus:border-blue-500" style={{ borderColor: P.baseNeutral, color: P.dark }} />
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t" style={{ borderColor: P.baseNeutral }}>
                <button
                    onClick={handleSaveProfile}
                    disabled={saveState === "saving"}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-85 cursor-pointer shadow-sm hover:opacity-95"
                    style={{ backgroundColor: saveState === "saved" ? "#10b981" : (saveState === "saving" ? P.neutralDark : P.primary) }}
                >
                    {saveState === "saving" ? "Guardando..." : (saveState === "saved" ? "¡Datos guardados! ✓" : "Guardar cambios")}
                </button>
            </div>
        </div>
    );
}

export default CuidadorProfileTab;