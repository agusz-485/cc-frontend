import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { P } from "../../shared";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { SectionInicio } from "../../components/dashboard/SectionInicio";
import { SectionMessages } from "../../components/dashboard/SectionMessages";
import { SectionBookings } from "../../components/dashboard/SectionBookings";
import { SectionAdultosACargo } from "../../components/dashboard/SectionAdultosACargo";
import { SectionCaregivers } from "../../components/dashboard/SectionCaregivers";
import { SectionDocuments } from "../../components/dashboard/SectionDocuments";
import { SectionSettings } from "../../components/dashboard/SectionSettings";
import { getAdultosMayores, updateAdultoMayorLocalDetails } from "../../services/adultoMayorService";
import { getBookings, updateBookingStatus } from "../../services/bookingService";
import { getFavoriteCaregivers, toggleFavoriteCaregiver } from "../../services/favoritesService";
import { useAuth } from "../../context/AuthContext";

// Local state placeholders for non-active mock sections
const DOCUMENTS = [];
const ACTIVITY = [];

export function FamiliarDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("user_id") || "11";

  const getFullName = () => {
    const rawNombre = user?.nombre || localStorage.getItem("user_name") || "";
    const rawApellido = user?.apellido || localStorage.getItem("user_apellido") || "";
    if (rawApellido && !rawNombre.toLowerCase().includes(rawApellido.toLowerCase())) {
      return `${rawNombre} ${rawApellido}`.trim();
    }
    return rawNombre || "Usuario";
  };

  // Leer tab inicial de la URL (ej. ?tab=bookings)
  const queryTab = new URLSearchParams(location.search).get("tab");
  const [activeNav, setActiveNav] = useState(queryTab || "inicio");
  const [userName, setUserName] = useState(getFullName());
  const [seniors, setSeniors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [savedCaregivers, setSavedCaregivers] = useState([]);

  useEffect(() => {
    if (queryTab) {
      setActiveNav(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    const fullName = getFullName();
    if (fullName) setUserName(fullName);
  }, [user]);

  // Cargar pacientes (Adultos Mayores) del familiar autenticado
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const data = await getAdultosMayores(userId);
        setSeniors(data);
      } catch (e) {
        console.error("Error al cargar adultos mayores:", e);
      }
    };

    loadData();
  }, [userId]);

  // Cargar reservas del familiar
  useEffect(() => {
    if (!userId) return;

    const loadBookingsData = async () => {
      try {
        const list = await getBookings(userId);
        setBookings(list);
      } catch (e) {
        console.error("Error al cargar reservas:", e);
      }
    };

    loadBookingsData();
  }, [userId]);

  // Cargar cuidadores guardados en favoritos
  useEffect(() => {
    if (userId) {
      setSavedCaregivers(getFavoriteCaregivers(userId));
    }
  }, [userId]);

  const handleRemoveFavorite = (caregiver) => {
    const updated = toggleFavoriteCaregiver(caregiver, userId);
    setSavedCaregivers(updated);
  };

  const updateSeniorsState = (updatedList) => {
    setSeniors(updatedList);
    updatedList.forEach((s) => {
      const id = s.idAdultoMayor || s.id;
      updateAdultoMayorLocalDetails(id, {
        condiciones: s.condiciones || [],
        medicamentos: s.medicamentos || [],
        necesidades: s.necesidades || [],
      });
    });
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    const updated = await updateBookingStatus(bookingId, newStatus, userId);
    setBookings(updated);
  };

  const handleProfileNameChange = (newName) => {
    setUserName(newName);
    localStorage.setItem("user_name", newName);
  };

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        active={activeNav}
        setActive={setActiveNav}
        navigate={navigate}
        role="familiar"
        setRole={() => {}}
        userName={userName}
      />

      <div className="flex-1 flex overflow-hidden">
        {activeNav === "inicio" && (
          <SectionInicio
            setActive={setActiveNav}
            navigate={navigate}
            bookings={bookings}
            savedCaregivers={savedCaregivers}
            activity={ACTIVITY}
            userName={userName}
          />
        )}
        {activeNav === "messages" && <SectionMessages />}
        {activeNav === "bookings" && (
          <SectionBookings
            navigate={navigate}
            bookings={bookings}
            onStatusChange={handleBookingStatusChange}
          />
        )}
        {activeNav === "adultos_a_cargo" && (
          <SectionAdultosACargo
            seniors={seniors}
            setSeniors={updateSeniorsState}
          />
        )}
        {activeNav === "caregivers" && (
          <SectionCaregivers
            navigate={navigate}
            savedCaregivers={savedCaregivers}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )}
        {activeNav === "documents" && <SectionDocuments documents={DOCUMENTS} />}
        {activeNav === "settings" && (
          <SectionSettings onProfileUpdate={handleProfileNameChange} />
        )}
      </div>
    </div>
  );
}

export default FamiliarDashboard;
