import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import { useAuth } from "../../context/AuthContext";

// Mock collections local state for Familiar dashboard
const ALL_BOOKINGS = [];
const SAVED_CAREGIVERS = [];
const DOCUMENTS = [];
const ACTIVITY = [];

export function FamiliarDashboard() {
  const navigate = useNavigate();
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

  const [activeNav, setActiveNav] = useState("inicio");
  const [userName, setUserName] = useState(getFullName());
  const [seniors, setSeniors] = useState([]);

  useEffect(() => {
    const fullName = getFullName();
    if (fullName) setUserName(fullName);
  }, [user]);

  // Cargar pacientes (Adultos Mayores) del familiar autenticado desde el servicio Axios
  useEffect(() => {
    if (!userId) return;
    
    const loadData = async () => {
      const data = await getAdultosMayores(userId);
      setSeniors(data);
    };
    
    loadData();
  }, [userId]);

  const updateSeniorsState = (updatedList) => {
    setSeniors(updatedList);
    updatedList.forEach(s => {
      const id = s.idAdultoMayor || s.id;
      updateAdultoMayorLocalDetails(id, {
        condiciones: s.condiciones || [],
        medicamentos: s.medicamentos || [],
        necesidades: s.necesidades || []
      });
    });
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
            bookings={ALL_BOOKINGS} 
            savedCaregivers={SAVED_CAREGIVERS} 
            activity={ACTIVITY} 
            userName={userName}
          />
        )}
        {activeNav === "messages" && <SectionMessages />}
        {activeNav === "bookings" && (
          <SectionBookings 
            navigate={navigate} 
            bookings={ALL_BOOKINGS} 
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
            savedCaregivers={SAVED_CAREGIVERS} 
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
