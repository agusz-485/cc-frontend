import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { P } from "../shared";
import { getProfessionalById } from "../services/searchService";
import { isCaregiverFavorite, toggleFavoriteCaregiver } from "../services/favoritesService";
import { useAuth } from "../context/AuthContext";
import {
  ProfileHeader,
  ProfileTabsNav,
  ProfileBioTab,
  ProfileCertificationsTab,
  ProfileReviewsTab,
  ProfilePricingWidget,
  ProfileNotFound,
  BookingModal,
} from "../components/profile";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("user_id") || "current";

  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [activeTab, setActiveTab] = useState("bio");

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalPricing, setModalPricing] = useState({
    dailyRate: 0,
    totalBase: 0,
    commission: 0,
    totalFinal: 0,
  });

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

  useEffect(() => {
    if (caregiver && caregiver.id) {
      setIsFavorite(isCaregiverFavorite(caregiver.id, userId));
    }
  }, [caregiver, userId]);

  const handleToggleFavorite = () => {
    if (!caregiver) return;
    const updated = toggleFavoriteCaregiver(caregiver, userId);
    const fav = updated.some((c) => Number(c.id) === Number(caregiver.id));
    setIsFavorite(fav);
  };

  const toggleDay = (dayKey) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });
  };

  const handleOpenBookingModal = (pricingData) => {
    setModalPricing(pricingData);
    setIsBookingModalOpen(true);
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
            <ProfileHeader 
              caregiver={caregiver} 
              isFavorite={isFavorite} 
              onToggleFavorite={handleToggleFavorite} 
            />

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
                    onOpenBookingModal={handleOpenBookingModal}
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

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        caregiver={caregiver}
        selectedDays={selectedDays}
        dailyRate={modalPricing.dailyRate}
        totalBase={modalPricing.totalBase}
        commission={modalPricing.commission}
        totalFinal={modalPricing.totalFinal}
      />
    </div>
  );
}
