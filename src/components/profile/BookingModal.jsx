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
  const userId = localStorage.getItem("user_id") || "11";
  const userAddress = localStorage.getItem("user_address") || "";

  const [seniors, setSeniors] = useState([]);
  const [loadingSeniors, setLoadingSeniors] = useState(true);
  const [selectedSeniorId, setSelectedSeniorId] = useState("");
  const [showSeniorRegisterModal, setShowSeniorRegisterModal] = useState(false);

  const [shift, setShift] = useState(SHIFTS[0].id);
  const [address, setAddress] = useState(
    userAddress || (caregiver?.location ? `Domicilio en ${caregiver.location}` : "")
  );
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const load = async () => {
      setLoadingSeniors(true);
      setSubmitError("");
      try {
        const list = await getAdultosMayores(userId);
        if (isMounted) {
          setSeniors(list);
          if (list.length > 0) {
            setSelectedSeniorId(String(list[0].idAdultoMayor || list[0].id));
          } else {
            setSelectedSeniorId("");
          }
        }
      } catch (e) {
        console.error("Error al cargar adultos mayores:", e);
        if (isMounted) {
          setSeniors([]);
          setSelectedSeniorId("");
        }
      } finally {
        if (isMounted) setLoadingSeniors(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const sortedDays = Array.from(selectedDays).sort((a, b) => a - b);
  const datesText = `${sortedDays.join(", ")} de Julio 2026`;
  const firstDate = sortedDays.length > 0 ? `0${sortedDays[0]}/07/2026` : "Inmediato";

  const handleRegisterSeniorSubmit = async (newSeniorData) => {
    const familiarId = Number(userId) || 1;
    const payload = { ...newSeniorData, familiarId };
    try {
      const saved = await createAdultoMayor(payload);
      const savedId = String(saved.idAdultoMayor || saved.id);
      setSeniors((prev) => [...prev, saved]);
      setSelectedSeniorId(savedId);
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

    const chosenSenior = seniors.find(
      (s) => String(s.idAdultoMayor || s.id) === String(selectedSeniorId)
    );

    if (!chosenSenior) {
      setSubmitError("Por favor selecciona un adulto mayor válido.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

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
      console.error("Error al crear reserva en backend:", err);
      setSubmitError(
        err.response?.data?.message || "Error al registrar la reserva en el servidor. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh]"
          style={{ borderColor: P.baseNeutral }}
        >
          {/* Header */}
          <div
            className="px-6 py-4.5 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}
          >
            <div>
              <h2 className="text-lg font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {confirmedBooking ? "Confirmación de Contratación" : "Solicitud de Cuidado y Reserva"}
              </h2>
              <p className="text-xs" style={{ color: P.neutralDark }}>CareConnect · Garantía de Cuidado Seguro</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            {confirmedBooking ? (
              <BookingSuccessView confirmedBooking={confirmedBooking} caregiver={caregiver} datesText={datesText} />
            ) : (
              <>
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Resumen del Profesional */}
                <BookingCaregiverCard
                  caregiver={caregiver}
                  datesText={datesText}
                  selectedDaysCount={selectedDays.size}
                />

                {/* Selector de Adulto Mayor */}
                <BookingSeniorSelector
                  seniors={seniors}
                  loadingSeniors={loadingSeniors}
                  selectedSeniorId={selectedSeniorId}
                  setSelectedSeniorId={setSelectedSeniorId}
                  onOpenRegisterModal={() => setShowSeniorRegisterModal(true)}
                />

                {/* Selector de Turno */}
                <BookingShiftSelector shift={shift} setShift={setShift} />

                {/* Dirección e Indicaciones */}
                <BookingServiceDetails
                  address={address}
                  setAddress={setAddress}
                  notes={notes}
                  setNotes={setNotes}
                />

                {/* Desglose de precios */}
                <BookingPriceBreakdown
                  dailyRate={dailyRate}
                  selectedDaysCount={selectedDays.size}
                  totalBase={totalBase}
                  commission={commission}
                  totalFinal={totalFinal}
                />
              </>
            )}
          </div>

          {/* Footer */}
          <BookingModalFooter
            confirmedBooking={confirmedBooking}
            onClose={onClose}
            onViewBookings={() => {
              onClose();
              navigate("/dashboard?tab=bookings");
            }}
            onConfirmBooking={handleConfirmBooking}
            isSubmitting={isSubmitting}
            selectedDaysCount={selectedDays.size}
            selectedSeniorId={selectedSeniorId}
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

