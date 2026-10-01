import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import { updateProfessionalProfile, decodeScheduleFromDescription, encodeScheduleInDescription } from "../../services/searchService";
import { getCaregiverRequests, updateBookingStatus } from "../../services/bookingService";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { DashboardMobileHeader } from "../../components/dashboard/DashboardMobileHeader";
import { SectionInicioCuidador } from "../../components/dashboard/SectionInicioCuidador";
import { SectionMessages } from "../../components/dashboard/SectionMessages";
import { SectionSolicitudes } from "../../components/dashboard/SectionSolicitudes";
import { SectionPerfilProfesional } from "../../components/dashboard/SectionPerfilProfesional";
import { SectionAgenda } from "../../components/dashboard/SectionAgenda";
import { SectionGanancias } from "../../components/dashboard/SectionGanancias";
import { SectionCertificados } from "../../components/dashboard/SectionCertificados";
import { SectionSettings } from "../../components/dashboard/SectionSettings";

const TAB_TITLES = {
    inicio_cuidador: "Inicio",
    solicitudes: "Solicitudes",
    perfil_profesional: "Perfil Profesional",
    agenda: "Mi Agenda",
    ganancias: "Ganancias",
    certificados: "Certificaciones",
    messages: "Mensajes",
    settings: "Configuración",
};

export function CuidadorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const userId = user?.id || localStorage.getItem("user_id") || "current";

    const getFullName = () => {
        const n = user?.nombre || localStorage.getItem("user_name") || "";
        const a = user?.apellido || localStorage.getItem("user_apellido") || "";
        return (a && !n.toLowerCase().includes(a.toLowerCase())) ? `${n} ${a}`.trim() : (n || "Profesional de Cuidado");
    };

    const queryTab = new URLSearchParams(location.search).get("tab");
    const [activeNav, setActiveNav] = useState(queryTab || "inicio_cuidador");
    const [userName, setUserName] = useState(getFullName());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [caregiverData, setCaregiverData] = useState(() => ({
        professionalType: (user?.rol || user?.role || "cuidador").toLowerCase().includes("enfermero") ? "enfermero" : "cuidador",
        matricula: "", experience: "", price: "", bio: "", mainZone: "",
        coverageZones: [], selectedSpecs: [], certs: [], visible: false,
    }));

    const [schedule, setSchedule] = useState(() => {
        const key = `caregiver_schedule_${userId}`;
        try {
            const saved = localStorage.getItem(key) || localStorage.getItem("caregiver_schedule");
            if (saved) return JSON.parse(saved);
        } catch {}
        return { blockedWeekDays: [], blockedDates: [], blockedWeeklySlots: {}, blockedDateSlots: [] };
    });

    useEffect(() => {
        if (!userId || userId === "current") return;
        let isMounted = true;

        const loadProfileFromDB = async () => {
            try {
                const isEnf = (user?.rol || user?.role || "").toLowerCase().includes("enfermero");
                const endpoint = isEnf ? `/enfermeros/${userId}` : `/cuidadores/${userId}`;
                let res = await api.get(endpoint).catch(() => api.get(isEnf ? `/cuidadores/${userId}` : `/enfermeros/${userId}`).catch(() => null));

                let localProfile = {};
                try {
                    const stored = localStorage.getItem(`caregiver_profile_${userId}`);
                    if (stored) localProfile = JSON.parse(stored);
                } catch {}

                if (!isMounted) return;
                const d = res?.data || {};
                const isN = !!d.matriculaProfesional || isEnf || localProfile.professionalType === "enfermero";
                const { bio: cleanBio, schedule: backendSched } = decodeScheduleFromDescription(d.descripcion);
                if (backendSched) {
                    setSchedule(backendSched);
                    localStorage.setItem(`caregiver_schedule_${userId}`, JSON.stringify(backendSched));
                }

                setCaregiverData({
                    professionalType: isN ? "enfermero" : "cuidador",
                    matricula: d.matriculaProfesional || localProfile.matricula || "",
                    experience: d.aniosExperiencia ? String(d.aniosExperiencia) : (localProfile.experience || ""),
                    price: d.precioHora ? String(d.precioHora) : (localProfile.price || ""),
                    bio: cleanBio || localProfile.bio || "",
                    mainZone: d.zonaPrincipal || localProfile.mainZone || "",
                    coverageZones: d.zonasCobertura || localProfile.coverageZones || [],
                    selectedSpecs: d.especialidades || localProfile.selectedSpecs || [],
                    certs: d.certificaciones || localProfile.certs || [],
                    visible: d.visible !== undefined ? d.visible : (d.disponible !== undefined ? d.disponible : true),
                });
            } catch (error) {
                console.warn("No se pudo cargar el perfil profesional:", error);
            }
        };

        loadProfileFromDB();
        return () => { isMounted = false; };
    }, [userId, user?.rol, user?.role]);

    const [requests, setRequests] = useState(() => {
        try {
            const saved = localStorage.getItem(`caregiver_requests_${userId}`);
            if (saved) return JSON.parse(saved);
        } catch {}
        return [];
    });

    useEffect(() => {
        if (!userId || userId === "current") return;
        const fetchReqs = async () => {
            const list = await getCaregiverRequests(userId);
            if (list.length > 0) setRequests(list);
        };
        fetchReqs();
    }, [userId, activeNav]);

    const handleAcceptRequest = async (reqId) => {
        await updateBookingStatus(reqId, "confirmed").catch(() => null);
        setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "confirmed" } : r));
    };

    const handleRejectRequest = async (reqId) => {
        await updateBookingStatus(reqId, "cancelled").catch(() => null);
        setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "cancelled" } : r));
    };

    const handleSaveCaregiverProfile = async (updatedData) => {
        setCaregiverData(updatedData);
        if (userId && userId !== "current") {
            localStorage.setItem(`caregiver_profile_${userId}`, JSON.stringify(updatedData));
            const isEnf = updatedData.professionalType === "enfermero";
            const updatedDesc = encodeScheduleInDescription(updatedData.bio, schedule);
            const payload = {
                descripcion: updatedDesc,
                aniosExperiencia: updatedData.experience ? Number(updatedData.experience) : 0,
                zonaPrincipal: updatedData.mainZone,
                precioHora: updatedData.price ? Number(updatedData.price) : 0,
                [isEnf ? "visible" : "disponible"]: updatedData.visible !== undefined ? !!updatedData.visible : true,
            };
            await updateProfessionalProfile(userId, updatedData.professionalType, payload).catch(() => null);
        }
    };

    const handleProfileNameChange = (newName) => {
        setUserName(newName);
        localStorage.setItem("user_name", newName);
    };

    const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;
    const currentTitle = TAB_TITLES[activeNav] || "Dashboard";

    return (
        <div className="flex h-screen overflow-hidden relative bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar Responsive (Desktop fijo + Mobile Drawer) */}
            <Sidebar
                active={activeNav}
                setActive={setActiveNav}
                navigate={navigate}
                role="cuidador"
                setRole={() => {}}
                userName={userName}
                badges={pendingRequestsCount > 0 ? { solicitudes: pendingRequestsCount } : {}}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Contenedor Principal */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header Superior Móvil con Menú Desplegable */}
                <DashboardMobileHeader
                    onOpenMenu={() => setIsMobileMenuOpen(true)}
                    title={currentTitle}
                    badgeCount={pendingRequestsCount}
                    userName={userName}
                    role={caregiverData?.professionalType || "cuidador"}
                    navigate={navigate}
                />

                {/* Sección de Contenido Activo */}
                <div className="flex-1 flex overflow-hidden min-w-0">
                    {activeNav === "inicio_cuidador" && (
                        <SectionInicioCuidador
                            setActive={setActiveNav}
                            visible={caregiverData.visible}
                            statistics={{ calificacionPromedio: 5.0, totalResenas: requests.length, cantidadServicios: requests.length, updatedAt: "Hoy" }}
                            requests={requests}
                            liquidations={[]}
                            caregiverData={caregiverData}
                        />
                    )}
                    {activeNav === "solicitudes" && (
                        <SectionSolicitudes
                            requests={requests}
                            setRequests={setRequests}
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                        />
                    )}
                    {activeNav === "perfil_profesional" && (
                        <SectionPerfilProfesional
                            caregiverData={caregiverData}
                            setCaregiverData={setCaregiverData}
                            onSaveProfile={handleSaveCaregiverProfile}
                        />
                    )}
                    {activeNav === "agenda" && <SectionAgenda schedule={schedule} setSchedule={setSchedule} />}
                    {activeNav === "ganancias" && <SectionGanancias historicalEarnings={[]} liquidations={[]} />}
                    {activeNav === "certificados" && <SectionCertificados caregiverData={caregiverData} />}
                    {activeNav === "messages" && <SectionMessages />}
                    {activeNav === "settings" && (
                        <SectionSettings onProfileUpdate={handleProfileNameChange} role={caregiverData?.professionalType || "cuidador"} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CuidadorDashboard;
