import { useState } from "react";
import { Clock, CheckCircle, FileText, UserCheck, Heart, Star, CheckCircle2 } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";
import { ModalDetallePaciente } from "../cuidador/ModalDetallePaciente";
import { CalificarServicioModal } from "../reviews/CalificarServicioModal";

export function SectionSolicitudes({ requests = [], setRequests, onAccept, onReject, onStatusChange }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewRequest, setReviewRequest] = useState(null);
    const [tab, setTab] = useState("pending");

    const handleAccept = (reqId) => {
        if (onAccept) onAccept(reqId);
        else setRequests?.(prev => prev.map(r => r.id === reqId ? { ...r, status: "confirmed" } : r));
    };

    const handleReject = (reqId) => {
        if (onReject) onReject(reqId);
        else setRequests?.(prev => prev.map(r => r.id === reqId ? { ...r, status: "cancelled" } : r));
    };

    const handleFinalize = (reqId) => {
        if (onStatusChange) onStatusChange(reqId, "completed");
        else setRequests?.(prev => prev.map(r => r.id === reqId ? { ...r, status: "completed" } : r));
    };

    const pendingRequests = requests.filter(r => r.status === "pending");
    const confirmedRequests = requests.filter(r => r.status === "confirmed" || r.status === "accepted");
    const completedRequests = requests.filter(r => r.status === "completed" || r.status === "finalizado");
    const allRequests = requests;

    const displayedRequests = tab === "pending"
        ? pendingRequests
        : tab === "confirmed"
        ? confirmedRequests
        : tab === "completed"
        ? completedRequests
        : allRequests;

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-4xl mx-auto space-y-5 text-left">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Solicitudes de Servicio y Turnos
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Revisa las solicitudes médicas, confirma turnos y califica a las familias al finalizar el cuidado.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border text-xs font-semibold overflow-x-auto max-w-full" style={{ borderColor: P.baseNeutral }}>
                        <button
                            type="button"
                            onClick={() => setTab("pending")}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${tab === "pending" ? "bg-white text-slate-800 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            Pendientes
                            {pendingRequests.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("confirmed")}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${tab === "confirmed" ? "bg-white text-slate-800 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            Confirmadas
                            {confirmedRequests.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                                    {confirmedRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("completed")}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${tab === "completed" ? "bg-white text-slate-800 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            Finalizadas
                            {completedRequests.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
                                    {completedRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("all")}
                            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${tab === "all" ? "bg-white text-slate-800 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            Todas ({allRequests.length})
                        </button>
                    </div>
                </div>

                {/* List of Requests */}
                {displayedRequests.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 border border-dashed text-center" style={{ borderColor: P.baseNeutral }}>
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="font-bold text-slate-700">
                            {tab === "pending"
                                ? "No tienes solicitudes pendientes de confirmación"
                                : tab === "confirmed"
                                ? "No tienes servicios en curso en este momento"
                                : tab === "completed"
                                ? "No tienes turnos finalizados aún"
                                : "Sin historial de solicitudes"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {tab === "pending"
                                ? "Cuando una familia reserve tus servicios, podrás revisar su ficha clínica aquí."
                                : "Los turnos confirmados y completados quedarán organizados en esta sección."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {displayedRequests.map(req => {
                            const isPending = req.status === "pending";
                            const isConfirmed = req.status === "confirmed" || req.status === "accepted";
                            const isCompleted = req.status === "completed" || req.status === "finalizado";

                            return (
                                <div key={req.id} className="bg-white rounded-3xl p-5 border shadow-sm space-y-4 hover:border-slate-300 transition-colors" style={{ borderColor: P.baseNeutral }}>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b" style={{ borderColor: P.baseNeutral }}>
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                src={req.familiarFoto}
                                                name={req.family || "Familiar"}
                                                tipo="familiar"
                                                size="md"
                                                shape="rounded-2xl"
                                                className="w-12 h-12 border border-sky-100 flex-shrink-0 shadow-sm"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-base text-slate-900">{req.family}</h3>
                                                    <span className="text-xs text-slate-400 font-normal">· {req.bookingId || `RES-${req.id}`}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                    Paciente: <strong className="text-slate-800">{req.patient}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {isPending && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> Pendiente de Aceptación
                                                </span>
                                            )}
                                            {isConfirmed && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Turno Confirmado ✓
                                                </span>
                                            )}
                                            {isCompleted && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Turno Finalizado ✓
                                                </span>
                                            )}
                                            {!isPending && !isConfirmed && !isCompleted && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="p-4 rounded-2xl space-y-2 text-xs" style={{ backgroundColor: "#f8fbfd", borderColor: P.baseNeutral }}>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <p><span className="text-slate-400 block text-[11px]">Fecha del servicio</span> <strong className="text-slate-800">{req.date}</strong></p>
                                            <p><span className="text-slate-400 block text-[11px]">Horario y Duración</span> <strong className="text-slate-800">{req.hours}</strong></p>
                                            <p><span className="text-slate-400 block text-[11px]">Tipo de Cuidado</span> <strong className="text-slate-800">{req.serviceType || "Cuidado Integral"}</strong></p>
                                        </div>
                                        {req.notes && (
                                            <div className="pt-2 border-t mt-2 text-slate-600" style={{ borderColor: P.baseNeutral }}>
                                                <strong>Notas de la familia:</strong> "{req.notes}"
                                            </div>
                                        )}
                                        <div className="pt-2 border-t flex justify-between items-center" style={{ borderColor: P.baseNeutral }}>
                                            <span className="text-slate-500 font-medium">Honorarios correspondientes al turno:</span>
                                            <span className="text-base font-extrabold text-emerald-700">{formatARS(req.amount || 0)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRequest(req)}
                                            className="px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 font-bold text-xs hover:bg-sky-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Ver Ficha Completa del Paciente
                                        </button>

                                        {isPending && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(req.id)}
                                                    className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors cursor-pointer"
                                                >
                                                    Rechazar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAccept(req.id)}
                                                    className="px-5 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                                    style={{ backgroundColor: P.primary }}
                                                >
                                                    <UserCheck className="w-4 h-4" /> Aceptar Reserva
                                                </button>
                                            </div>
                                        )}

                                        {isConfirmed && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleFinalize(req.id)}
                                                    className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                                                >
                                                    Finalizar Turno
                                                </button>
                                            </div>
                                        )}

                                        {isCompleted && (() => {
                                            const rawId = req.id;
                                            const isReviewed = Boolean(
                                                localStorage.getItem(`careconnect_review_turno_${rawId}_${localStorage.getItem("user_id")}`) ||
                                                localStorage.getItem(`careconnect_review_turno_${String(rawId).replace("RES-", "")}_${localStorage.getItem("user_id")}`)
                                            );

                                            return (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setReviewRequest(req)}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer ${
                                                            isReviewed
                                                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                                                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                                                        }`}
                                                    >
                                                        <Star className={`w-4 h-4 ${isReviewed ? "text-emerald-600 fill-emerald-600" : "text-amber-500 fill-amber-500"}`} />
                                                        <span>{isReviewed ? "Calificación Enviada ✓" : "Calificar Familiar"}</span>
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Detalle Paciente */}
            {selectedRequest && (
                <ModalDetallePaciente
                    isOpen={!!selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    request={selectedRequest}
                    onAccept={(id) => {
                        handleAccept(id);
                        setSelectedRequest(null);
                    }}
                    onReject={(id) => {
                        handleReject(id);
                        setSelectedRequest(null);
                    }}
                />
            )}

            {/* Modal para Calificar Familiar */}
            <CalificarServicioModal
                isOpen={Boolean(reviewRequest)}
                onClose={() => setReviewRequest(null)}
                booking={reviewRequest}
                targetType="familiar"
            />
        </div>
    );
}

export default SectionSolicitudes;
