import { Clock, AlertTriangle } from "lucide-react";
import { P } from "../../shared";

const ENUM_DAYS = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

export const SHIFTS = [
  { id: "Turno Completo (8hs)", label: "Turno Completo (8 horas)", sub: "Jornada habitual diurna (08:00 - 16:00)", start: "08:00", end: "16:00" },
  { id: "Medio Turno (4hs)", label: "Medio Turno (4 horas)", sub: "Mañana o Tarde (08:00 - 12:00)", start: "08:00", end: "12:00" },
  { id: "Turno Noche (12hs)", label: "Turno Noche (12 horas)", sub: "Cuidado nocturno y guardia (20:00 - 08:00)", start: "20:00", end: "08:00" },
  { id: "Cuidado Continuo (24hs)", label: "Cuidado Continuo (24 horas)", sub: "Atención full time (24 hs)", start: "08:00", end: "08:00" },
];

export function BookingShiftSelector({ shift, setShift, caregiver, selectedDays = new Set() }) {
  const schedule = caregiver?.schedule || (() => {
    try {
      return JSON.parse(localStorage.getItem(`caregiver_schedule_${caregiver?.id}`)) || null;
    } catch {
      return null;
    }
  })();

  const checkShiftOverlap = (item) => {
    if (!schedule || selectedDays.size === 0) return null;
    for (const dKey of selectedDays) {
      const d = new Date(String(dKey).includes("T") ? dKey : `${dKey}T00:00:00`);
      if (isNaN(d.getTime())) continue;
      const dayEnum = ENUM_DAYS[d.getDay()];
      const isoStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const weeklySlots = schedule.blockedWeeklySlots?.[dayEnum] || [];
      const dateSlots = (schedule.blockedDateSlots || []).filter((s) => s.date === isoStr);
      const allBlocked = [...weeklySlots, ...dateSlots];

      for (const b of allBlocked) {
        if (item.start < b.hasta && b.desde < item.end) {
          return `Horario ocupado (${b.desde} a ${b.hasta}${b.motivo ? `: ${b.motivo}` : ""})`;
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        Modalidad y Turno
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SHIFTS.map((item) => {
          const overlapWarning = checkShiftOverlap(item);
          return (
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
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                {overlapWarning && (
                  <p className="text-[10px] text-amber-700 font-semibold mt-1.5 flex items-center gap-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" /> {overlapWarning}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingShiftSelector;
