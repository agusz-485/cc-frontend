import { Clock } from "lucide-react";
import { P } from "../../shared";

export const SHIFTS = [
  { id: "Turno Completo (8hs)", label: "Turno Completo (8 horas)", sub: "Jornada habitual diurna" },
  { id: "Medio Turno (4hs)", label: "Medio Turno (4 horas)", sub: "Mañana o Tarde" },
  { id: "Turno Noche (12hs)", label: "Turno Noche (12 horas)", sub: "Cuidado nocturno y guardia" },
  { id: "Cuidado Continuo (24hs)", label: "Cuidado Continuo (24 horas)", sub: "Atención full time" },
];

export function BookingShiftSelector({ shift, setShift }) {
  return (
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
  );
}

export default BookingShiftSelector;
