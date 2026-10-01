import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ShieldAlert, Ban } from "lucide-react";
import { P, formatARS } from "../../shared";
import { CalendarAvailabilitySummary } from "./CalendarAvailabilitySummary";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];
const ENUM_DAYS = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

export function ProfileCalendar({ caregiver, selectedDays, toggleDay, onOpenBookingModal }) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [focusedDateInfo, setFocusedDateInfo] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const canGoPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());

  const handlePrevMonth = () => { if (canGoPrev) setViewDate(new Date(year, month - 1, 1)); };
  const handleNextMonth = () => { setViewDate(new Date(year, month + 1, 1)); };

  const schedule = useMemo(() => {
    if (caregiver?.schedule && typeof caregiver.schedule === "object" && typeof caregiver.schedule !== "boolean") return caregiver.schedule;
    try {
      const id = caregiver?.id;
      const stored = localStorage.getItem(`caregiver_schedule_${id}`) || localStorage.getItem(`caregiver_schedule_${Number(id)}`) || localStorage.getItem("caregiver_schedule") || localStorage.getItem(`caregiver_schedule_${localStorage.getItem("user_id")}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  }, [caregiver]);

  const hasBlocks = useMemo(() => {
    if (!schedule) return false;
    const bDays = schedule.blockedWeekDays?.length || 0;
    const bDates = schedule.blockedDates?.length || 0;
    const bWeeklySlots = Object.values(schedule.blockedWeeklySlots || {}).reduce((acc, list) => acc + (list?.length || 0), 0);
    const bDateSlots = schedule.blockedDateSlots?.length || 0;
    return bDays + bDates + bWeeklySlots + bDateSlots > 0;
  }, [schedule]);

  const dailyRateVal = caregiver?.dailyRate || (caregiver?.hourlyRate ? caregiver.hourlyRate * 8 : 24000);
  const totalBase = selectedDays.size * dailyRateVal;
  const commission = totalBase * 0.05;
  const totalFinal = totalBase + commission;

  const getDayAvailability = (day) => {
    const targetDate = new Date(year, month, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isPast = targetDate < todayMidnight;
    const isoString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEnum = ENUM_DAYS[targetDate.getDay()];
    const formattedDate = `${day} de ${MONTH_NAMES[month]} ${year}`;
    const cleanDayEnum = dayEnum.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const isBlockedWeekDay = (schedule?.blockedWeekDays || []).some(
      (b) => String(b).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === cleanDayEnum
    );
    const isBlockedDate = (schedule?.blockedDates || []).some(
      (bd) => String(bd) === isoString || new Date(String(bd) + "T00:00:00").toDateString() === targetDate.toDateString()
    );

    const weeklySlots = Object.entries(schedule?.blockedWeeklySlots || {}).flatMap(([d, slots]) => {
      if (d.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === cleanDayEnum) {
        return Array.isArray(slots) ? slots : [];
      }
      return [];
    });
    const dateSlots = (schedule?.blockedDateSlots || []).filter(
      (s) => String(s.date) === isoString || new Date(String(s.date) + "T00:00:00").toDateString() === targetDate.toDateString()
    );
    const blockedSlots = [...weeklySlots, ...dateSlots];
    const isPartial = blockedSlots.length > 0;
    const isFullBlocked = isBlockedWeekDay || isBlockedDate;

    return {
      isPast,
      isAvailable: !isPast && !isFullBlocked,
      isFullBlocked,
      isPartial,
      isoString,
      dayEnum,
      formattedDate,
      blockedSlots,
    };
  };

  const handleDayClick = (dayInfo) => {
    setFocusedDateInfo(dayInfo);
    if (dayInfo.isAvailable && !dayInfo.isPast) {
      toggleDay(dayInfo.isoString);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t text-left" style={{ borderColor: P.baseNeutral }}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <div>
          <h4 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Calendario de Disponibilidad
          </h4>
          <p className="text-xs text-slate-500">
            Toca cualquier día para consultar los horarios disponibles y seleccionarlo.
          </p>
        </div>

        {hasBlocks ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Agenda con Bloqueos
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Disponibilidad Total
          </span>
        )}
      </div>

      <div className="p-5 rounded-3xl bg-white border shadow-sm" style={{ borderColor: P.baseNeutral }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: P.baseNeutral }}>
          <button onClick={handlePrevMonth} disabled={!canGoPrev} className={`p-2 rounded-xl border transition-colors ${canGoPrev ? "hover:bg-slate-100 cursor-pointer text-slate-700" : "opacity-30 cursor-not-allowed text-slate-300"}`} style={{ borderColor: P.baseNeutral }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {MONTH_NAMES[month]} {year}
          </p>
          <button onClick={handleNextMonth} className="p-2 rounded-xl border hover:bg-slate-100 transition-colors cursor-pointer text-slate-700" style={{ borderColor: P.baseNeutral }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="text-center py-1 text-xs font-bold text-slate-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const info = getDayAvailability(day);
            const isSelected = selectedDays.has(info.isoString) || selectedDays.has(day);

            let bg = "white";
            let color = P.dark;
            let border = `1px solid ${P.baseNeutral}`;
            let cursor = info.isAvailable ? "pointer" : "not-allowed";

            if (info.isFullBlocked && !info.isPast) {
              bg = "#fee2e2";
              color = "#dc2626";
              border = "2px solid #ef4444";
            } else if (info.isFullBlocked && info.isPast) {
              bg = "#fef2f2";
              color = "#f87171";
              border = "1.5px dashed #fca5a5";
            } else if (info.isPast) {
              color = "#cbd5e1";
              bg = "#f8fafc";
              border = "1px solid #f1f5f9";
            } else if (isSelected) {
              bg = P.accent;
              color = "white";
              border = `1.5px solid ${P.accent}`;
            } else if (info.isPartial) {
              bg = "#fefce8";
              color = "#b45309";
              border = "1.5px solid #f59e0b";
            }

            return (
              <button
                key={day}
                onClick={() => handleDayClick(info)}
                className="aspect-square flex flex-col items-center justify-center rounded-xl font-bold transition-all text-xs relative shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: bg, color, border, cursor }}
                title={info.isFullBlocked ? "Día bloqueado" : (info.isPartial ? "Horarios parciales ocupados" : (info.isPast ? "Fecha pasada" : "Disponible"))}
              >
                <span>{day}</span>
                {info.isFullBlocked && <Ban className={`w-3 h-3 absolute bottom-1 ${info.isPast ? "text-rose-300" : "text-rose-600"}`} />}
                {info.isPartial && !isSelected && !info.isFullBlocked && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-200 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap border-t pt-3" style={{ borderColor: P.baseNeutral }}>
          {[
            { bg: P.accent, label: "Seleccionado", border: P.accent },
            { bg: "white", label: "Disponible", border: P.baseNeutral },
            { bg: "#fee2e2", label: "No disponible (bloqueado)", border: "#ef4444" },
            { bg: "#fefce8", label: "Horarios parciales ocupados", border: "#f59e0b" },
          ].map(({ bg, label, border }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: bg, border: `1.5px solid ${border}` }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <CalendarAvailabilitySummary schedule={schedule} focusedDateInfo={focusedDateInfo} />

      {selectedDays.size > 0 && (
        <div className="mt-5 p-5 rounded-3xl bg-white border space-y-3 shadow-sm" style={{ borderColor: P.baseNeutral }}>
          <h4 className="font-bold text-sm text-slate-800">Resumen de Contratación</h4>
          <div className="flex justify-between text-xs text-slate-600">
            <span>{formatARS(dailyRateVal)} × {selectedDays.size} día{selectedDays.size > 1 ? "s" : ""}</span>
            <span className="font-bold text-slate-800">{formatARS(totalBase)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Comisión de servicio y seguro (5%)</span>
            <span className="font-bold text-slate-800">{formatARS(Math.round(commission))}</span>
          </div>
          <hr style={{ borderColor: P.baseNeutral }} />
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-slate-800">Importe Total Estimado</span>
            <span className="font-extrabold text-xl" style={{ color: P.primary }}>{formatARS(Math.round(totalFinal))}</span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => selectedDays.size > 0 && onOpenBookingModal?.({ dailyRate: dailyRateVal, totalBase, commission, totalFinal })}
          disabled={selectedDays.size === 0}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 text-center block shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: selectedDays.size > 0 ? P.accent : "#cbd5e1" }}
        >
          {selectedDays.size === 0 ? "Selecciona días disponibles en el calendario" : "Solicitar Cuidado y Reserva"}
        </button>
      </div>
    </div>
  );
}

export default ProfileCalendar;
