import { useState } from "react";
import { Calendar, User, ArrowRight, CheckCircle, Ban, Star } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";
import { CalificarServicioModal } from "../reviews/CalificarServicioModal";

export function SectionBookings({ navigate, bookings = [], onStatusChange }) {
  const [reviewBooking, setReviewBooking] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Historial de Reservas y Contrataciones
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestiona los servicios de cuidado contratados para tus adultos mayores y califica la atención recibida
            </p>
          </div>
          <button
            onClick={() => navigate("/directory")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: P.primary }}
          >
            Buscar Nuevos Cuidadores
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {bookings.length === 0 ? (
          <div
            className="bg-white rounded-3xl border p-12 text-center max-w-md mx-auto shadow-sm"
            style={{ borderColor: P.baseNeutral }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-slate-300 bg-slate-50"
            >
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-800">No tienes reservas registradas</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Explora nuestro directorio de cuidadores y enfermeros matriculados para coordinar la atención de tus seres queridos.
            </p>
            <button
              onClick={() => navigate("/directory")}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer inline-flex items-center gap-2"
              style={{ backgroundColor: P.accent }}
            >
              Explorar Directorio
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className="bg-white rounded-3xl border overflow-hidden shadow-sm"
            style={{ borderColor: P.baseNeutral }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="border-b text-xs font-bold uppercase tracking-wider"
                    style={{
                      borderColor: P.baseNeutral,
                      color: P.neutralDark,
                      backgroundColor: P.neutralLight,
                    }}
                  >
                    <th className="p-4">ID</th>
                    <th className="p-4">Profesional</th>
                    <th className="p-4">Paciente (Adulto Mayor)</th>
                    <th className="p-4">Servicio / Turno</th>
                    <th className="p-4">Fechas</th>
                    <th className="p-4">Monto</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm" style={{ borderColor: P.baseNeutral }}>
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-xs" style={{ color: P.dark }}>
                        {b.id}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={b.caregiver?.image}
                            name={b.caregiver?.name || "Profesional"}
                            size="sm"
                            shape="rounded-full"
                            className="w-9 h-9"
                          />
                          <div>
                            <p className="font-semibold text-xs text-slate-800">
                              {b.caregiver?.name || "Profesional"}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {b.caregiver?.location || "Buenos Aires"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-slate-800">
                              {b.senior?.nombre || "Adulto Mayor"}
                            </span>
                            {b.senior?.parentesco && (
                              <span className="text-[10px] text-slate-500 block">
                                ({b.senior.parentesco} - {b.senior.edad || 75} años)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <p className="font-semibold text-slate-700">{b.type || b.serviceType || "Cuidado"}</p>
                        <p className="text-[10px] text-slate-400">{b.shift || "Turno Completo"}</p>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">
                        {b.datesText || b.dateStart || "Fechas acordadas"}
                      </td>
                      <td className="p-4 font-bold text-xs text-slate-800">
                        {formatARS(b.amount || 0)}
                      </td>
                      <td className="p-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1"
                          style={{
                            backgroundColor:
                              b.status === "confirmed"
                                ? "#e8f6ee"
                                : b.status === "completed"
                                ? "#f0fdf4"
                                : b.status === "pending"
                                ? "#fef0e6"
                                : "#fde8e8",
                            color:
                              b.status === "confirmed"
                                ? "#16a34a"
                                : b.status === "completed"
                                ? "#15803d"
                                : b.status === "pending"
                                ? P.accent
                                : "#dc2626",
                          }}
                        >
                          {b.status === "confirmed"
                            ? "Confirmada ✓"
                            : b.status === "completed"
                            ? "Finalizada ✓"
                            : b.status === "pending"
                            ? "Esperando al Cuidador"
                            : "Cancelada"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {(b.status === "pending" || b.status === "confirmed") && onStatusChange && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
                                  onStatusChange(b.id, "cancelled");
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Cancelar solicitud"
                            >
                              <Ban className="w-3.5 h-3.5" /> Cancelar
                            </button>
                          )}
                          {b.status === "confirmed" && onStatusChange && (
                            <button
                              type="button"
                              onClick={() => onStatusChange(b.id, "completed")}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-lg border text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              style={{ borderColor: P.baseNeutral }}
                            >
                              Finalizar Turno
                            </button>
                          )}
                          {b.status === "completed" && (() => {
                            const rawId = b.rawId || b.id;
                            const isReviewed = Boolean(
                              localStorage.getItem(`careconnect_review_turno_${rawId}_${localStorage.getItem("user_id")}`) ||
                              localStorage.getItem(`careconnect_review_turno_${String(rawId).replace("RES-", "")}_${localStorage.getItem("user_id")}`)
                            );

                            return (
                              <button
                                type="button"
                                onClick={() => setReviewBooking(b)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer ${
                                  isReviewed
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                                }`}
                                title={isReviewed ? "Ver o modificar tu reseña enviada" : "Calificar servicio y dejar una reseña"}
                              >
                                <Star className={`w-3.5 h-3.5 ${isReviewed ? "text-emerald-600 fill-emerald-600" : "text-amber-500 fill-amber-500"}`} />
                                <span>{isReviewed ? "Reseña Enviada ✓" : "Dejar Reseña"}</span>
                              </button>
                            );
                          })()}
                          {b.status === "cancelled" && (
                            <span className="text-xs text-rose-400 font-medium">Cancelada</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal interactivo para dejar estrellas y reseña */}
      <CalificarServicioModal
        isOpen={Boolean(reviewBooking)}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
        targetType="cuidador"
        onReviewSubmitted={() => {
          // Trigger re-render to update review state
          setReviewBooking(null);
        }}
      />
    </div>
  );
}

export default SectionBookings;
