import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { P } from "../shared";
import { getProfessionalById } from "../services/searchService";
import {
  ProfileHeader,
  ProfileTabsNav,
  ProfileBioTab,
  ProfileCertificationsTab,
  ProfileReviewsTab,
  ProfilePricingWidget,
  ProfileNotFound,
} from "../components/profile";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [activeTab, setActiveTab] = useState("bio");

  useEffect(() => {
    let isMounted = true;
    const fetchCaregiver = async () => {
      setLoading(true);
      try {
        const data = await getProfessionalById(id);
        if (isMounted) {
          setCaregiver(data);
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        if (isMounted) {
          setCaregiver(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCaregiver();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const blockedDays = useMemo(() => new Set([4, 5, 11, 12, 15, 16, 18, 19, 25, 26]), []);
  const isPast = (day) => day <= 2;

  const toggleDay = (day) => {
    if (blockedDays.has(day) || isPast(day)) return;
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  // Estado de carga
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ backgroundColor: "#f8fbfd", minHeight: "100vh" }}
      >
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: P.primary }} />
        <p className="text-sm font-semibold" style={{ color: P.neutralDark }}>
          Cargando datos del perfil...
        </p>
      </div>
    );
  }

  // Estado de perfil no encontrado
  if (!caregiver) {
    return <ProfileNotFound />;
  }

  return (
    <div style={{ backgroundColor: "#f8fbfd", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate("/directory")}
          className="flex items-center gap-1.5 mb-6 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: P.primary }}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al directorio
        </button>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* Main profile content */}
          <div className="flex-1 min-w-0 w-full">
            <ProfileHeader caregiver={caregiver} />

            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "white", border: `1px solid ${P.baseNeutral}` }}
            >
              <ProfileTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-6">
                {activeTab === "bio" && (
                  <ProfileBioTab
                    caregiver={caregiver}
                    selectedDays={selectedDays}
                    toggleDay={toggleDay}
                  />
                )}

                {activeTab === "certifications" && (
                  <ProfileCertificationsTab caregiver={caregiver} />
                )}

                {activeTab === "reviews" && <ProfileReviewsTab />}
              </div>
            </div>
          </div>

          {/* Sticky pricing widget */}
          <ProfilePricingWidget caregiver={caregiver} />
        </div>
      </div>
    </div>
  );
}
