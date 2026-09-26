import { ChevronLeft, ChevronRight } from "lucide-react";
import { P, formatARS } from "../../shared";

export function ProfileCalendar({ caregiver, selectedDays, toggleDay, onOpenBookingModal }) {
  // Julio 2026: 31 días, inicia miércoles (Mon-first offset = 2)
  const daysInMonth = 31;
  const firstDayOffset = 2;
  const blockedDays = new Set([4, 5, 11, 12, 15, 16, 18, 19, 25, 26]);
  const isPast = (day) => day <= 2;
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  const dailyRateVal = caregiver?.dailyRate || (caregiver?.hourlyRate ? caregiver.hourlyRate * 8 : 24000);
  const totalBase = selectedDays.size * dailyRateVal;
  const commission = totalBase * 0.05;
  const totalFinal = totalBase + commission;

  const handleHireClick = () => {
    if (selectedDays.size === 0) return;
    if (onOpenBookingModal) {
      onOpenBookingModal({
        dailyRate: dailyRateVal,
        totalBase,
        commission,
        totalFinal,
      });
    }
  };

  return (
    <div className="mt-8 pt-6 border-t" style={{ borderColor: P.baseNeutral }}>
      <h4
        className="font-bold text-sm mb-4"
        style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Calendario de Disponibilidad (Selecciona los días a contratar)
      </h4>

      {/* Calendario de disponibilidad */}
      <div
        className="p-5 rounded-2xl"
        style={{ backgroundColor: P.neutralLight, border: `1px solid ${P.baseNeutral}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: P.neutralDark }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p
            className="text-sm font-bold"
            style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Julio 2026
          </p>
          <button
            className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: P.neutralDark }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center py-1 text-xs font-bold"
              style={{ color: P.neutralDark }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const past = isPast(day);
            const blocked = blockedDays.has(day);
            const selected = selectedDays.has(day);
            let bg = "white";
            let color = P.dark;
            let opacity = 1;
            let border = `1px solid ${P.baseNeutral}`;

            if (past) {
              color = P.baseNeutral;
              opacity = 0.5;
              bg = "transparent";
              border = "none";
            } else if (blocked) {
              bg = "#fef0f0";
              color = "#fca5a5";
              border = "1px solid #fca5a5";
            } else if (selected) {
              bg = P.accent;
              color = "white";
              border = "none";
            }

            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                disabled={past || blocked}
                className="aspect-square flex items-center justify-center rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-xs shadow-sm"
                style={{
                  backgroundColor: bg,
                  color,
                  opacity,
                  border,
                  cursor: past || blocked ? "not-allowed" : "pointer",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div
          className="flex gap-4 mt-4 flex-wrap border-t pt-3"
          style={{ borderColor: P.baseNeutral }}
        >
          {[
            { bg: P.accent, label: "Seleccionado", border: "none" },
            { bg: "#fef0f0", label: "Ocupado", border: "#fca5a5" },
            { bg: "white", label: "Disponible", border: P.baseNeutral },
          ].map(({ bg, label, border }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-md"
                style={{
                  backgroundColor: bg,
                  border: border !== "none" ? `1px solid ${border}` : "none",
                }}
              />
              <span className="text-xs font-semibold" style={{ color: P.neutralDark }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price calculator & Hire Button */}
      {selectedDays.size > 0 && (
        <div
          className="mt-6 p-5 rounded-2xl bg-white border space-y-4 shadow-sm"
          style={{ borderColor: P.baseNeutral }}
        >
          <h4
            className="font-bold text-sm"
            style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Resumen del Servicio
          </h4>
          <div className="flex justify-between text-sm">
            <span style={{ color: P.neutralDark }}>
              {formatARS(dailyRateVal)} ×{" "}
              {selectedDays.size} día{selectedDays.size > 1 ? "s" : ""}
            </span>
            <span className="font-bold" style={{ color: P.dark }}>
              {formatARS(totalBase)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: P.neutralDark }}>Comisión de servicio (5%)</span>
            <span className="font-bold" style={{ color: P.dark }}>
              {formatARS(Math.round(commission))}
            </span>
          </div>
          <hr style={{ borderColor: P.baseNeutral }} />
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm" style={{ color: P.dark }}>
              Importe Total Estimado
            </span>
            <span
              className="font-bold text-xl"
              style={{ color: P.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {formatARS(Math.round(totalFinal))}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={handleHireClick}
          disabled={selectedDays.size === 0}
          className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-95 text-center block cursor-pointer"
          style={{
            backgroundColor: selectedDays.size > 0 ? P.accent : P.baseNeutral,
            cursor: selectedDays.size === 0 ? "not-allowed" : "pointer",
            boxShadow: selectedDays.size > 0 ? `0 4px 16px ${P.accent}55` : "none",
          }}
        >
          {selectedDays.size === 0
            ? "Selecciona días en el calendario para contratar"
            : "Contratar Servicio"}
        </button>
        {selectedDays.size > 0 && (
          <p className="text-xs text-center mt-2" style={{ color: P.neutralDark }}>
            Sin cobros hasta confirmar · Cancelación gratuita 24h antes
          </p>
        )}
      </div>
    </div>
  );
}
