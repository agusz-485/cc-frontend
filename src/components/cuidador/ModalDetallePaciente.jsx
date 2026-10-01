import { useState, useEffect } from "react";
import { X, User, Heart, Pill, Calendar, Clock, DollarSign, Phone, FileText, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { P, formatARS } from "../../shared";
import api, { getMediaUrl } from "../../api/client";

export function ModalDetallePaciente({ isOpen, onClose, request, onAccept, onReject }) {
    const [loading, setLoading] = useState(false);
    const [patientDetails, setPatientDetails] = useState(null);

    useEffect(() => {
        if (!isOpen || !request) return;

        const loadPatientInfo = async () => {
            setLoading(true);
            try {
                const seniorId = request.adultoMayorId || request.patientId;
                let seniorData = null;
                if (seniorId) {
                    try {
                        const res = await api.get(`/adultos-mayores/${seniorId}`).catch(() => api.get("/adultos-mayores"));
                        if (Array.isArray(res.data)) {
                            seniorData = res.data.find(s => (s.idAdultoMayor || s.id) === Number(seniorId)) || null;
                        } else if (res.data) {
                            seniorData = res.data;
                        }
                    } catch {}
                }

                const localDetailsMap = JSON.parse(localStorage.getItem("seniors_details") || "{}");
                const localData = seniorId ? localDetailsMap[seniorId] : {};
                const conds = localData?.condiciones || seniorData?.condiciones || [];
                const meds = localData?.medicamentos || seniorData?.medicamentos || [];
                const needs = localData?.necesidades || seniorData?.necesidades || [];

                setPatientDetails({
                    ...seniorData,
                    ...localData,
                    nombre: seniorData?.nombre || request.patient || "Adulto Mayor",
                    apellido: seniorData?.apellido || "",
                    foto: seniorData?.fotoPerfil || seniorData?.foto || localData?.foto || null,
                    edad: seniorData?.edad || localData?.edad || 78,
                    movilidad: seniorData?.movilidad || localData?.movilidad || "Autónomo con asistencia leve",
                    condiciones: conds.length > 0 ? conds : ["Control de signos vitales", "Acompañamiento y estimulación"],
                    medicamentos: meds.length > 0 ? meds : ["Medicación vía oral según horario indicado por la familia"],
                    necesidades: needs.length > 0 ? needs : ["Supervisión diaria", "Asistencia en traslados", "Recordatorio de hidratación"],
                });
            } catch (err) {
                console.warn("Error al cargar ficha del paciente:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPatientInfo();
    }, [isOpen, request]);

    if (!isOpen || !request) return null;

    const isPending = request.status === "pending";
    const isConfirmed = request.status === "confirmed" || request.status === "accepted";

    const formatList = (items) => {
        if (!items || items.length === 0) return ["Sin requerimientos especiales"];
        return items.map(item => (typeof item === "string" ? item : (item.condicion || item.nombreMedicamento || item.necesidad || JSON.stringify(item))));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]" style={{ borderColor: P.baseNeutral }}>
                <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ficha Integral del Paciente</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {isConfirmed ? "Turno Confirmado ✓" : "Solicitud Pendiente de Confirmación"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Identificador de Reserva: {request.bookingId || `RES-${request.id || "001"}`}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
                    {/* Paciente Card */}
                    <div className="p-4 rounded-2xl border bg-slate-50/70 space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-3">
                            {patientDetails?.foto ? (
                                <img
                                    src={getMediaUrl(patientDetails.foto)}
                                    alt={patientDetails.nombre}
                                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                    }}
                                />
                            ) : null}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0 ${patientDetails?.foto ? "hidden" : ""}`} style={{ backgroundColor: P.primary }}>
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-slate-900">{patientDetails?.nombre} {patientDetails?.apellido}</h3>
                                <p className="text-xs text-slate-500">{patientDetails?.edad} años · Movilidad: <span className="font-semibold text-slate-700">{patientDetails?.movilidad}</span></p>
                            </div>
                        </div>

                        <div className="pt-3 border-t space-y-2.5 text-xs" style={{ borderColor: P.baseNeutral }}>
                            <div className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-700">Diagnósticos y Condiciones:</strong>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {formatList(patientDetails?.condiciones).map((c, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 pt-1">
                                <Pill className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-700">Medicamentos y Tratamiento:</strong>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {formatList(patientDetails?.medicamentos).map((m, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-[11px] border border-blue-200">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 pt-1">
                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-slate-700">Asistencia Requerida:</strong>
                                    <p className="text-slate-600 mt-0.5 leading-relaxed">{formatList(patientDetails?.necesidades).join(" · ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del Servicio */}
                    <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Detalles de la Contratación</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><div><span className="text-slate-400 block text-[10px]">Fecha</span><strong className="text-slate-800">{request.date}</strong></div></div>
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><div><span className="text-slate-400 block text-[10px]">Horario</span><strong className="text-slate-800">{request.hours}</strong></div></div>
                            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /><div><span className="text-slate-400 block text-[10px]">Servicio</span><strong className="text-slate-800">{request.serviceType || "Cuidado Integral"}</strong></div></div>
                            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /><div><span className="text-slate-400 block text-[10px]">Honorarios</span><strong className="text-emerald-700 text-sm font-bold">{formatARS(request.amount || 0)}</strong></div></div>
                        </div>
                        {request.notes && (
                            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border" style={{ borderColor: P.baseNeutral }}>
                                <strong>Indicaciones de la Familia:</strong> "{request.notes}"
                            </div>
                        )}
                    </div>

                    {/* Contacto con el Familiar Contratante */}
                    <div className="p-4 rounded-2xl border space-y-2 bg-sky-50/60" style={{ borderColor: "#bae6fd" }}>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-sky-900">Contacto con el Familiar Contratante</h4>
                        <div className="flex items-center gap-3">
                            {request.familiarFoto ? (
                                <img
                                    src={getMediaUrl(request.familiarFoto)}
                                    alt={request.family}
                                    className="w-12 h-12 rounded-2xl object-cover border border-sky-200 flex-shrink-0 shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                    }}
                                />
                            ) : null}
                            <div className={`w-12 h-12 rounded-2xl bg-sky-200 text-sky-800 font-bold flex items-center justify-center text-base flex-shrink-0 ${request.familiarFoto ? "hidden" : ""}`}>
                                {request.family ? request.family[0] : "F"}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700 flex-1">
                                <div>
                                    <span className="text-slate-400 block text-[10px]">Familiar Responsable</span>
                                    <strong className="text-slate-800">{request.family}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px]">Teléfono de Coordinación</span>
                                    <strong className="text-slate-800 flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                                        {request.phone || "+54 9 11 4059-8821"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0" style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-xs border text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" style={{ borderColor: P.baseNeutral }}>
                        Cerrar Ficha
                    </button>
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => { onReject?.(request.id); onClose(); }} className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-600 font-bold text-xs hover:bg-rose-50 cursor-pointer transition-colors">
                                Rechazar
                            </button>
                            <button onClick={() => { onAccept?.(request.id); onClose(); }} className="px-5 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-sm transition-opacity" style={{ backgroundColor: P.primary }}>
                                <CheckCircle className="w-4 h-4" /> Aceptar Reserva
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> Servicio Asignado y Confirmado
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalDetallePaciente;
