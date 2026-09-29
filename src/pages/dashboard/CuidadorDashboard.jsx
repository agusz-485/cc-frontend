import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import { updateProfessionalProfile } from "../../services/searchService";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { SectionInicioCuidador } from "../../components/dashboard/SectionInicioCuidador";
import { SectionMessages } from "../../components/dashboard/SectionMessages";
import { SectionSolicitudes } from "../../components/dashboard/SectionSolicitudes";
import { SectionPerfilProfesional } from "../../components/dashboard/SectionPerfilProfesional";
import { SectionAgenda } from "../../components/dashboard/SectionAgenda";
import { SectionGanancias } from "../../components/dashboard/SectionGanancias";
import { SectionCertificados } from "../../components/dashboard/SectionCertificados";
import { SectionSettings } from "../../components/dashboard/SectionSettings";

const EMPTY_SCHEDULE = {
    LUNES: [],
    MARTES: [],
    MIERCOLES: [],
    JUEVES: [],
    VIERNES: [],
    SABADO: [],
    DOMINGO: [],
};

export function CuidadorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const userId = user?.id || localStorage.getItem("user_id") || "current";

    const getFullName = () => {
        const rawNombre = user?.nombre || localStorage.getItem("user_name") || "";
        const rawApellido = user?.apellido || localStorage.getItem("user_apellido") || "";
        if (rawApellido && !rawNombre.toLowerCase().includes(rawApellido.toLowerCase())) {
            return `${rawNombre} ${rawApellido}`.trim();
        }
        return rawNombre || "Profesional de Cuidado";
    };

    const queryTab = new URLSearchParams(location.search).get("tab");
    const [activeNav, setActiveNav] = useState(queryTab || "inicio_cuidador");
    const [userName, setUserName] = useState(getFullName());

    // Estado del Perfil Profesional del Cuidador
    const [caregiverData, setCaregiverData] = useState(() => {
        return {
            professionalType: (user?.rol || user?.role || "cuidador").toLowerCase().includes("enfermero") ? "enfermero" : "cuidador",
            matricula: "",
            experience: "",
            price: "",
            bio: "",
            mainZone: "",
            coverageZones: [],
            selectedSpecs: [],
            certs: [],
            visible: false,
        };
    });

    // Cargar perfil real desde la base de datos MySQL (Backend Spring Boot) y sincronizar datos locales
    useEffect(() => {
        if (!userId || userId === "current") return;

        let isMounted = true;
        const loadProfileFromDB = async () => {
            try {
                const isEnfermero = (user?.rol || user?.role || "").toLowerCase().includes("enfermero");
                const endpoint = isEnfermero ? `/enfermeros/${userId}` : `/cuidadores/${userId}`;
                let res;
                try {
                    res = await api.get(endpoint);
                } catch {
                    const altEndpoint = isEnfermero ? `/cuidadores/${userId}` : `/enfermeros/${userId}`;
                    res = await api.get(altEndpoint).catch(() => null);
                }

                let localProfile = {};
                try {
                    const stored = localStorage.getItem(`caregiver_profile_${userId}`);
                    if (stored) localProfile = JSON.parse(stored);
                } catch {}

                if (isMounted) {
                    const d = res?.data || {};
                    const isN = !!d.matriculaProfesional || isEnfermero || localProfile.professionalType === "enfermero";
                    
                    const mergedCerts = (d.certificaciones && d.certificaciones.length > 0)
                        ? d.certificaciones
                        : (localProfile.certs || []);

                    const mergedZones = (d.zonasCobertura && d.zonasCobertura.length > 0)
                        ? d.zonasCobertura
                        : (localProfile.coverageZones && localProfile.coverageZones.length > 0
                            ? localProfile.coverageZones
                            : (d.zonaPrincipal || localProfile.mainZone ? [d.zonaPrincipal || localProfile.mainZone] : []));

                    const mergedSpecs = (d.especialidades && d.especialidades.length > 0)
                        ? d.especialidades
                        : (localProfile.selectedSpecs || []);

                    setCaregiverData({
                        professionalType: isN ? "enfermero" : "cuidador",
                        matricula: d.matriculaProfesional || localProfile.matricula || "",
                        experience: d.aniosExperiencia ? String(d.aniosExperiencia) : (localProfile.experience || ""),
                        price: d.precioHora ? String(d.precioHora) : (localProfile.price || ""),
                        bio: d.descripcion || localProfile.bio || "",
                        mainZone: d.zonaPrincipal || localProfile.mainZone || "",
                        coverageZones: mergedZones,
                        selectedSpecs: mergedSpecs,
                        certs: mergedCerts,
                        visible: d.visible !== undefined ? d.visible : (d.disponible !== undefined ? d.disponible : (localProfile.visible ?? true)),
                    });
                }
            } catch (error) {
                console.warn("No se pudo cargar el perfil profesional:", error);
            }
        };

        loadProfileFromDB();
        return () => { isMounted = false; };
    }, [userId, user?.rol, user?.role]);

    // Estado de la Agenda Horaria
    const [schedule, setSchedule] = useState(() => {
        const key = `caregiver_schedule_${userId}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved) return JSON.parse(saved);
        } catch {}
        return EMPTY_SCHEDULE;
    });

    // Solicitudes de servicio
    const [requests, setRequests] = useState(() => {
        const key = `caregiver_requests_${userId}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved) return JSON.parse(saved);
        } catch {}
        return [];
    });

    // Liquidaciones y Ganancias
    const [liquidations] = useState([]);
    const [historicalEarnings] = useState([]);

    // Estadísticas
    const [statistics] = useState({
        calificacionPromedio: 0,
        totalResenas: 0,
        cantidadServicios: 0,
        updatedAt: "Sin registros de actividad",
    });

    // Sincronizar tab de URL
    useEffect(() => {
        if (queryTab) setActiveNav(queryTab);
    }, [queryTab]);

    // Guardar cambios en el backend (MySQL) y en almacenamiento local
    const handleSaveCaregiverProfile = async (updatedData) => {
        setCaregiverData(updatedData);

        if (userId && userId !== "current") {
            localStorage.setItem(`caregiver_profile_${userId}`, JSON.stringify(updatedData));
            localStorage.setItem(`caregiver_certs_${userId}`, JSON.stringify(updatedData.certs || []));
            localStorage.setItem(`caregiver_zones_${userId}`, JSON.stringify(updatedData.coverageZones || []));

            const isEnfermero = updatedData.professionalType === "enfermero";
            const payload = {
                descripcion: updatedData.bio,
                aniosExperiencia: updatedData.experience ? Number(updatedData.experience) : 0,
                zonaPrincipal: updatedData.mainZone,
                precioHora: updatedData.price ? Number(updatedData.price) : 0,
                [isEnfermero ? "visible" : "disponible"]: updatedData.visible !== undefined ? !!updatedData.visible : true,
            };

            try {
                await updateProfessionalProfile(userId, updatedData.professionalType, payload);
            } catch (err) {
                console.warn("Fallo guardado en endpoint principal, intentando alternativo:", err);
                const altRole = isEnfermero ? "cuidador" : "enfermero";
                await updateProfessionalProfile(userId, altRole, payload).catch(() => null);
            }
        }
    };

    // Persistir cambios en la agenda
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`caregiver_schedule_${userId}`, JSON.stringify(schedule));
        }
    }, [schedule, userId]);

    // Persistir solicitudes
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`caregiver_requests_${userId}`, JSON.stringify(requests));
        }
    }, [requests, userId]);

    const handleProfileNameChange = (newName) => {
        setUserName(newName);
        localStorage.setItem("user_name", newName);
    };

    const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

    return (
        <div className="flex h-screen overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar
                active={activeNav}
                setActive={setActiveNav}
                navigate={navigate}
                role="cuidador"
                setRole={() => {}}
                userName={userName}
                badges={pendingRequestsCount > 0 ? { solicitudes: pendingRequestsCount } : {}}
            />

            <div className="flex-1 flex overflow-hidden">
                {activeNav === "inicio_cuidador" && (
                    <SectionInicioCuidador
                        setActive={setActiveNav}
                        visible={caregiverData.visible}
                        statistics={statistics}
                        requests={requests}
                        liquidations={liquidations}
                        caregiverData={caregiverData}
                    />
                )}
                {activeNav === "solicitudes" && (
                    <SectionSolicitudes
                        requests={requests}
                        setRequests={setRequests}
                    />
                )}
                {activeNav === "perfil_profesional" && (
                    <SectionPerfilProfesional
                        caregiverData={caregiverData}
                        setCaregiverData={setCaregiverData}
                        onSaveProfile={handleSaveCaregiverProfile}
                    />
                )}
                {activeNav === "agenda" && (
                    <SectionAgenda
                        schedule={schedule}
                        setSchedule={setSchedule}
                    />
                )}
                {activeNav === "ganancias" && (
                    <SectionGanancias
                        historicalEarnings={historicalEarnings}
                        liquidations={liquidations}
                    />
                )}
                {activeNav === "certificados" && (
                    <SectionCertificados
                        caregiverData={caregiverData}
                    />
                )}
                {activeNav === "messages" && <SectionMessages />}
                {activeNav === "settings" && (
                    <SectionSettings onProfileUpdate={handleProfileNameChange} role={caregiverData?.professionalType || "cuidador"} />
                )}
            </div>
        </div>
    );
}

export default CuidadorDashboard;
