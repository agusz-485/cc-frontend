import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertCircle } from "lucide-react";
import { P } from "../../shared";
import { getAdultosMayores, createAdultoMayor } from "../../services/adultoMayorService";
import { createBooking } from "../../services/bookingService";
import { AdultoMayorFormModal } from "../familiar/AdultoMayorFormModal";
import { BookingSuccessView } from "./BookingSuccessView";
import { BookingSeniorSelector } from "./BookingSeniorSelector";
import { BookingShiftSelector, SHIFTS } from "./BookingShiftSelector";
import { BookingPriceBreakdown } from "./BookingPriceBreakdown";
import { BookingCaregiverCard } from "./BookingCaregiverCard";
import { BookingServiceDetails } from "./BookingServiceDetails";
import { BookingModalFooter } from "./BookingModalFooter";
import { BookingAuthPrompt } from "./BookingAuthPrompt";
import { formatDatesText, getShiftTimes } from "./bookingUtils";

export function BookingModal({
  isOpen,
  onClose,
  caregiver,
  selectedDays = new Set(),
  dailyRate,
  totalBase,
  commission,
  totalFinal,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user_role") || "FAMILIAR";
  const isAuthenticated = !!token;
  const isProfessional = isAuthenticated && (userRole === "CUIDADOR" || userRole === "ENFERMERO");
  const userId = localStorage.getItem("user_id") || "1";
  const userAddress = localStorage.getItem("user_address") || "";

  const [seniors, setSeniors] = useState([]);
  const [loadingSeniors, setLoadingSeniors] = useState(true);
  const [selectedSeniorId, setSelectedSeniorId] = useState("");
  const [showSeniorRegisterModal, setShowSeniorRegisterModal] = useState(false);
  const [shift, setShift] = useState(SHIFTS[0].id);
  const [address, setAddress] = useState(userAddress || (caregiver?.location ? `Domicilio en ${caregiver.location}` : ""));
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || isProfessional) {
      setLoadingSeniors(false);
      return;
    }
    let isMounted = true;
    const load = async () => {
      setLoadingSeniors(true);
      setSubmitError("");
      try {
        const list = await getAdultosMayores(userId);
        if (isMounted) {
          setSeniors(list);
          setSelectedSeniorId(list.length > 0 ? String(list[0].idAdultoMayor || list[0].id) : "");
        }
      } catch (e) {
        if (isMounted) {
          setSeniors([]);
          setSelectedSeniorId("");
        }
      } finally {
        if (isMounted) setLoadingSeniors(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [isOpen, userId, isAuthenticated, isProfessional]);

  if (!isOpen) return null;

  const sortedDays = Array.from(selectedDays).sort((a, b) => new Date(a) - new Date(b));
  const datesText = formatDatesText(sortedDays);
  const firstDate = sortedDays.length > 0 ? String(sortedDays[0]) : new Date().toISOString().split("T")[0];

  const handleRegisterSeniorSubmit = async (newSeniorData) => {
    const familiarId = Number(userId) || 1;
    try {
      const saved = await createAdultoMayor({ ...newSeniorData, familiarId });
      setSeniors((prev) => [...prev, saved]);
      setSelectedSeniorId(String(saved.idAdultoMayor || saved.id));
      setShowSeniorRegisterModal(false);
    } catch (e) {
      console.error("Error al registrar adulto mayor:", e);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeniorId) {
      setSubmitError("Debes registrar y seleccionar un adulto mayor para solicitar el servicio.");
      return;
    }
    const chosenSenior = seniors.find((s) => String(s.idAdultoMayor || s.id) === String(selectedSeniorId));
    if (!chosenSenior) {
      setSubmitError("Por favor selecciona un adulto mayor válido.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const { horaInicio, horaFin, duracionMinutos } = getShiftTimes(shift);

    const bookingPayload = {
      caregiver: {
        id: caregiver.id,
        name: caregiver.name,
        image: caregiver.image,
        location: caregiver.location,
        rating: caregiver.rating,
        tipo: caregiver.tipo || "cuidador",
      },
      caregiverId: caregiver.id,
      senior: {
        id: chosenSenior.idAdultoMayor || chosenSenior.id,
        nombre: `${chosenSenior.nombre} ${chosenSenior.apellido || ""}`.trim(),
        parentesco: chosenSenior.parentesco || "Familiar",
        edad: chosenSenior.edad || 75,
      },
      seniorId: chosenSenior.idAdultoMayor || chosenSenior.id,
      serviceType: caregiver.tipo === "enfermero" ? "Enfermería Domiciliaria" : "Cuidado de Adulto Mayor",
      type: caregiver.tipo === "enfermero" ? "Atención Médica / Enfermería" : "Cuidado y Asistencia",
      shift,
      horaInicio,
      horaFin,
      duracionMinutos,
      fecha: firstDate.includes("T") ? firstDate.split("T")[0] : firstDate,
      dates: sortedDays.map(String),
      datesText,
      dateStart: firstDate,
      amount: Math.round(totalFinal),
      address: address || "Domicilio acordado",
      notes: notes.trim(),
    };

    try {
      const result = await createBooking(bookingPayload, userId);
      setConfirmedBooking(result);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setSubmitError("Tu sesión ha expirado o no estás autenticado. Inicia sesión como Familiar.");
      } else if (status === 403) {
        setSubmitError("Acceso denegado (403): Solo cuentas con rol Familiar pueden contratar cuidadores.");
      } else {
        setSubmitError(err.response?.data?.message || "Error al registrar la reserva en el servidor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => { onClose(); navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`); };
  const handleRegisterRedirect = () => { onClose(); navigate("/register"); };
  const handleSwitchAccount = () => {
    ["token", "user_session", "user_role", "user_id"].forEach((k) => localStorage.removeItem(k));
    onClose();
    navigate("/login");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh]" style={{ borderColor: P.baseNeutral }}>
          <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}>
            <div>
              <h2 className="text-lg font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {confirmedBooking ? "Confirmación de Pago y Reserva" : "Solicitud de Cuidado y Reserva"}
              </h2>
              <p className="text-xs" style={{ color: P.neutralDark }}>CareConnect · Garantía de Cuidado Seguro</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
            {confirmedBooking ? (
              <BookingSuccessView
                confirmedBooking={confirmedBooking}
                caregiver={caregiver}
                datesText={datesText}
                onRedirect={() => { onClose(); navigate("/dashboard?tab=bookings"); }}
              />
            ) : (
              <>
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{submitError}</span>
                  </div>
                )}
                <BookingCaregiverCard caregiver={caregiver} datesText={datesText} selectedDaysCount={selectedDays.size} />
                {!isAuthenticated || isProfessional ? (
                  <BookingAuthPrompt
                    isProfessional={isProfessional}
                    onLogin={handleLoginRedirect}
                    onRegister={handleRegisterRedirect}
                    onSwitchAccount={handleSwitchAccount}
                  />
                ) : (
                  <>
                    <BookingSeniorSelector seniors={seniors} loadingSeniors={loadingSeniors} selectedSeniorId={selectedSeniorId} setSelectedSeniorId={setSelectedSeniorId} onOpenRegisterModal={() => setShowSeniorRegisterModal(true)} />
                    <BookingShiftSelector shift={shift} setShift={setShift} caregiver={caregiver} selectedDays={selectedDays} />
                    <BookingServiceDetails address={address} setAddress={setAddress} notes={notes} setNotes={setNotes} />
                  </>
                )}
                <BookingPriceBreakdown dailyRate={dailyRate} selectedDaysCount={selectedDays.size} totalBase={totalBase} commission={commission} totalFinal={totalFinal} />
              </>
            )}
          </div>

          <BookingModalFooter
            confirmedBooking={confirmedBooking}
            onClose={onClose}
            onViewBookings={() => { onClose(); navigate("/dashboard?tab=bookings"); }}
            onConfirmBooking={handleConfirmBooking}
            isSubmitting={isSubmitting}
            selectedDaysCount={selectedDays.size}
            selectedSeniorId={selectedSeniorId}
            isAuthenticated={isAuthenticated}
            isProfessional={isProfessional}
            onLoginRedirect={handleLoginRedirect}
          />
        </div>
      </div>

      <AdultoMayorFormModal
        isOpen={showSeniorRegisterModal}
        onClose={() => setShowSeniorRegisterModal(false)}
        onSubmit={handleRegisterSeniorSubmit}
      />
    </>
  );
}

export default BookingModal;
