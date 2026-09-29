import { CheckCircle2, Clock } from "lucide-react";
import { P, formatARS } from "../../shared";

export function BookingSuccessView({ confirmedBooking, caregiver, datesText }) {
  if (!confirmedBooking) return null;

  return (
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
  );
}

export default BookingSuccessView;
