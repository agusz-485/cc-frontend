import React from "react";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import { P } from "../../shared";

export function BookingModalFooter({
  confirmedBooking,
  onClose,
  onViewBookings,
  onConfirmBooking,
  isSubmitting,
  selectedDaysCount,
  selectedSeniorId,
}) {
  return (
    <div
      className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
      style={{ borderColor: P.baseNeutral, backgroundColor: "#f8fbfd" }}
    >
      {confirmedBooking ? (
        <div className="flex gap-3 w-full justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs border text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            style={{ borderColor: P.baseNeutral }}
          >
            Cerrar
          </button>
          <button
            onClick={onViewBookings}
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
              className="px-5 py-2.5 rounded-xl font-semibold text-xs border text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              style={{ borderColor: P.baseNeutral }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmBooking}
              disabled={isSubmitting || selectedDaysCount === 0 || !selectedSeniorId}
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
  );
}

export default BookingModalFooter;
