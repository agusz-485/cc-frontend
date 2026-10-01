import { useState, useEffect } from "react";
import { CheckCircle2, CreditCard, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";

export function BookingSuccessView({ confirmedBooking, caregiver, datesText, onRedirect }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!confirmedBooking) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onRedirect) onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [confirmedBooking, onRedirect]);

  if (!confirmedBooking) return null;

  return (
    <div className="text-center py-2 space-y-4 animate-fadeIn">
      <div
        className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md animate-bounce"
        style={{ backgroundColor: "#e8f6ee" }}
      >
        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Pago Confirmado ✓
        </span>
        <h3
          className="text-xl font-extrabold"
          style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          ¡Pago Exitoso y Reserva Confirmada!
        </h3>
        <p className="text-xs mt-1" style={{ color: P.neutralDark }}>
          Código de operación: <span className="font-bold text-slate-800">{confirmedBooking.id}</span>
        </p>
      </div>

      {/* Tarjeta de Confirmación de Pago y Servicio */}
      <div
        className="p-4 rounded-2xl text-left space-y-3"
        style={{ backgroundColor: P.neutralLight, border: `1px solid ${P.baseNeutral}` }}
      >
        <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: P.baseNeutral }}>
          <UserAvatar
            src={caregiver.image}
            name={caregiver.name}
            tipo={caregiver.tipo}
            size="md"
            shape="rounded-xl"
            className="w-12 h-12"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: P.dark }}>
              {caregiver.name}
            </p>
            <p className="text-xs truncate" style={{ color: P.neutralDark }}>
              {confirmedBooking.serviceType} · {confirmedBooking.shift}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Abonado</span>
            <span className="text-sm font-extrabold text-emerald-600">{formatARS(confirmedBooking.amount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div>
            <p className="font-semibold text-slate-400">Adulto mayor:</p>
            <p className="font-bold text-slate-700 mt-0.5">{confirmedBooking.senior?.nombre}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-400">Fechas acordadas:</p>
            <p className="font-bold text-slate-700 mt-0.5">{datesText}</p>
          </div>
        </div>

        <div className="pt-2 border-t flex items-center justify-between text-xs text-slate-600" style={{ borderColor: P.baseNeutral }}>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            Método: Débito en Cuenta (Simulado)
          </span>
          <span className="text-emerald-700 font-bold">Aprobado ✓</span>
        </div>
      </div>

      {/* Banner de Redirección Automática */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 text-xs text-left">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 animate-spin" />
          <span>Redirigiendo a tu sección de <strong>Reservas</strong> en <strong>{countdown}s</strong>...</span>
        </div>
        {onRedirect && (
          <button
            onClick={onRedirect}
            className="px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: P.primary }}
          >
            Ir ahora <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingSuccessView;
