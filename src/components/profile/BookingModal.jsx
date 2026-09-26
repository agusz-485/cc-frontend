import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Calendar,
  User,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  Shield,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
  Heart,
  UserPlus,
} from "lucide-react";
import { P, formatARS } from "../../shared";
import { getAdultosMayores, createAdultoMayor } from "../../services/adultoMayorService";
import { createBooking } from "../../services/bookingService";
import { AdultoMayorFormModal } from "../familiar/AdultoMayorFormModal";

const SHIFTS = [
  { id: "Turno Completo (8hs)", label: "Turno Completo (8 horas)", sub: "Jornada habitual diurna" },
  { id: "Medio Turno (4hs)", label: "Medio Turno (4 horas)", sub: "Mañana o Tarde" },
  { id: "Turno Noche (12hs)", label: "Turno Noche (12 horas)", sub: "Cuidado nocturno y guardia" },
  { id: "Cuidado Continuo (24hs)", label: "Cuidado Continuo (24 horas)", sub: "Atención full time" },
];

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
    const payload = {
      ...newSeniorData,
      familiarId,
    };
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
      serviceType:
        caregiver.tipo === "enfermero"
          ? "Enfermería Domiciliaria"
          : "Cuidado de Adulto Mayor",
      type:
        caregiver.tipo === "enfermero"
          ? "Atención Médica / Enfermería"
          : "Cuidado y Asistencia",
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
        err.response?.data?.message ||
          "Error al registrar la reserva en el servidor. Por favor, verifica los datos e intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate("/dashboard?tab=bookings");
  };

  const selectedSeniorObj = seniors.find(
    (s) => String(s.idAdultoMayor || s.id) === String(selectedSeniorId)
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh]"
          style={{ borderColor: P.baseNeutral }}
        >
          {/* Modal Header */}
          <div
            className="px-6 py-4.5 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}
          >
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {confirmedBooking ? "Confirmación de Contratación" : "Solicitud de Cuidado y Reserva"}
              </h2>
              <p className="text-xs" style={{ color: P.neutralDark }}>
                CareConnect · Garantía de Cuidado Seguro
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            {confirmedBooking ? (
              /* SUCCESS CONFIRMATION STEP */
              <div className="text-center py-4 space-y-5">
                <div
                  className="w-18 h-18 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "#e8f6ee" }}
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>

                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    ¡Solicitud enviada con éxito!
                  </h3>
                  <p className="text-sm mt-1" style={{ color: P.neutralDark }}>
                    Código de reserva: <span className="font-bold text-slate-800">{confirmedBooking.id}</span>
                  </p>
                </div>

                <div
                  className="p-5 rounded-2xl text-left space-y-3"
                  style={{ backgroundColor: P.neutralLight, border: `1px solid ${P.baseNeutral}` }}
                >
                  <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: P.baseNeutral }}>
                    <img
                      src={caregiver.image}
                      alt={caregiver.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm" style={{ color: P.dark }}>
                        {caregiver.name}
                      </p>
                      <p className="text-xs" style={{ color: P.neutralDark }}>
                        {confirmedBooking.serviceType} · {confirmedBooking.shift}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-slate-400">Adulto mayor asignado:</p>
                      <p className="font-bold text-slate-700 mt-0.5">
                        {confirmedBooking.senior?.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Fechas acordadas:</p>
                      <p className="font-bold text-slate-700 mt-0.5">{datesText}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Dirección:</p>
                      <p className="font-bold text-slate-700 mt-0.5 truncate">{confirmedBooking.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Importe total:</p>
                      <p className="font-bold text-emerald-600 text-sm mt-0.5">
                        {formatARS(confirmedBooking.amount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3.5 rounded-xl text-xs bg-amber-50 text-amber-800 border border-amber-200 text-left">
                  <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>
                    El profesional tiene hasta 1 hora para confirmar la agenda. No se debitará ningún monto hasta que la reserva sea aceptada.
                  </span>
                </div>
              </div>
            ) : (
              /* BOOKING FORM STEP */
              <>
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Caregiver mini summary */}
                <div
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ backgroundColor: P.neutralLight, border: `1px solid ${P.baseNeutral}` }}
                >
                  <img
                    src={caregiver.image}
                    alt={caregiver.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {caregiver.tipo === "enfermero" ? "Enfermero Matriculado" : "Cuidador Profesional"}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 truncate mt-0.5">
                      {caregiver.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: P.neutralDark }}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{datesText}</span>
                      <span>({selectedDays.size} día{selectedDays.size > 1 ? "s" : ""})</span>
                    </div>
                  </div>
                </div>

                {/* Patient Selection (Adulto Mayor) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      ¿Para quién es el servicio? (Adulto Mayor)
                    </label>
                    {seniors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowSeniorRegisterModal(true)}
                        className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        style={{ color: P.primary }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Registrar otro adulto mayor
                      </button>
                    )}
                  </div>

                  {loadingSeniors ? (
                    <div className="p-4 rounded-xl border flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      Cargando adultos mayores a cargo...
                    </div>
                  ) : seniors.length === 0 ? (
                    /* INVITATION CARD TO COMPLETE REGISTRATION */
                    <div
                      className="p-6 rounded-2xl border-2 border-dashed text-center space-y-3 bg-amber-50/40"
                      style={{ borderColor: "#fcd34d" }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">
                          Aún no tienes ningún adulto mayor registrado
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                          Para solicitar un servicio de cuidado, primero debes completar el registro de la persona que recibirá la atención (datos personales, DNI, movilidad y condiciones).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSeniorRegisterModal(true)}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-95 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                        style={{ backgroundColor: P.primary }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Completar Registro de Adulto Mayor
                      </button>
                    </div>
                  ) : (
                    /* SENIORS LIST SELECTOR */
                    <div className="space-y-2">
                      <select
                        value={selectedSeniorId}
                        onChange={(e) => setSelectedSeniorId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white outline-none focus:border-sky-500 cursor-pointer shadow-sm"
                        style={{ borderColor: P.baseNeutral, color: P.dark }}
                      >
                        {seniors.map((s) => (
                          <option key={s.idAdultoMayor || s.id} value={String(s.idAdultoMayor || s.id)}>
                            {s.nombre} {s.apellido || ""} — DNI: {s.dni || "S/D"} · Movilidad: {s.movilidad || "Autónomo"}
                          </option>
                        ))}
                      </select>

                      {selectedSeniorObj && (
                        <div
                          className="p-3 rounded-xl border text-xs flex items-center justify-between bg-slate-50"
                          style={{ borderColor: P.baseNeutral }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                              {selectedSeniorObj.nombre[0]}
                              {selectedSeniorObj.apellido ? selectedSeniorObj.apellido[0] : ""}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                {selectedSeniorObj.nombre} {selectedSeniorObj.apellido || ""}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Movilidad: <span className="font-semibold text-slate-700">{selectedSeniorObj.movilidad || "Autónomo"}</span>
                                {selectedSeniorObj.observaciones ? ` · ${selectedSeniorObj.observaciones}` : ""}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                            Seleccionado
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Shift and Schedule */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Modalidad y Turno
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SHIFTS.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setShift(item.id)}
                        className="p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5"
                        style={{
                          borderColor: shift === item.id ? P.primary : P.baseNeutral,
                          backgroundColor: shift === item.id ? "#f0f8fa" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          checked={shift === item.id}
                          onChange={() => setShift(item.id)}
                          className="mt-0.5 cursor-pointer accent-teal-800"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Dirección donde se brindará el servicio
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Av. Santa Fe 1840, 3°B, Palermo, CABA"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white outline-none focus:border-sky-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                  />
                </div>

                {/* Special Instructions */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Indicaciones médicas / Requerimientos especiales
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Toma medicación a las 9hs. Usa andador para desplazarse. Dieta baja en sodio..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white outline-none focus:border-sky-500 resize-none"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                  />
                </div>

                {/* Price Breakdown */}
                <div
                  className="p-4 rounded-2xl border space-y-2.5 bg-slate-50/50"
                  style={{ borderColor: P.baseNeutral }}
                >
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>
                      Tarifa diaria base ({formatARS(dailyRate)} × {selectedDays.size} días)
                    </span>
                    <span className="font-bold text-slate-800">{formatARS(totalBase)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Comisión y seguro de servicio CareConnect (5%)</span>
                    <span className="font-bold text-slate-800">{formatARS(Math.round(commission))}</span>
                  </div>
                  <hr style={{ borderColor: P.baseNeutral }} />
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-800">Total a pagar estimado:</span>
                    <span
                      className="font-bold text-xl"
                      style={{ color: P.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {formatARS(Math.round(totalFinal))}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
            style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}
          >
            {confirmedBooking ? (
              <div className="flex gap-3 w-full justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs border text-slate-600 hover:bg-slate-100 transition-colors"
                  style={{ borderColor: P.baseNeutral }}
                >
                  Cerrar
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: P.primary }}
                >
                  Ver en Mis Reservas
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-500 hidden sm:flex">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Pago protegido · Cancelación flexible</span>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs border text-slate-600 hover:bg-slate-100 transition-colors"
                    style={{ borderColor: P.baseNeutral }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting || selectedDays.size === 0 || !selectedSeniorId}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: P.accent }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Confirmar Contratación
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Adulto Mayor Complete Registration Modal */}
      <AdultoMayorFormModal
        isOpen={showSeniorRegisterModal}
        onClose={() => setShowSeniorRegisterModal(false)}
        onSubmit={handleRegisterSeniorSubmit}
      />
    </>
  );
}
