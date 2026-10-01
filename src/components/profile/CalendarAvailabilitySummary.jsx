import { Calendar, Clock, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import { P } from "../../shared";

export function CalendarAvailabilitySummary({ schedule, focusedDateInfo }) {
    const blockedWeekDays = Array.isArray(schedule?.blockedWeekDays) ? schedule.blockedWeekDays : [];
    const blockedDates = Array.isArray(schedule?.blockedDates) ? schedule.blockedDates : [];
    const blockedWeeklySlots = schedule?.blockedWeeklySlots || {};
    const blockedDateSlots = Array.isArray(schedule?.blockedDateSlots) ? schedule.blockedDateSlots : [];

    const totalWeeklySlots = Object.values(blockedWeeklySlots).reduce((acc, list) => acc + (list?.length || 0), 0);
    const totalBlocks = blockedWeekDays.length + blockedDates.length + totalWeeklySlots + blockedDateSlots.length;

    return (
        <div className="space-y-3 mt-4">
            {/* Focused Date Details */}
            {focusedDateInfo ? (
                <div className={`p-4 rounded-2xl border text-xs transition-all space-y-2 ${
                    focusedDateInfo.isFullBlocked ? 'bg-rose-50/80 border-rose-200 text-rose-950' : (focusedDateInfo.isPartial ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700')
                }`}>
                    <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            {focusedDateInfo.formattedDate || focusedDateInfo.isoString} ({focusedDateInfo.dayEnum})
                        </span>
                        {focusedDateInfo.isFullBlocked ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 flex items-center gap-1">
                                <Ban className="w-3 h-3" /> Día no disponible (bloqueado)
                            </span>
                        ) : focusedDateInfo.isPartial ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Horarios parciales ocupados
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> 100% Disponible
                            </span>
                        )}
                    </div>

                    {/* Blocked Hours Detail for this date */}
                    {focusedDateInfo.blockedSlots?.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                            <p className="text-[11px] font-bold text-amber-900">Franjas horarias no disponibles en este día:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {focusedDateInfo.blockedSlots.map((s, idx) => (
                                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-amber-200/80 text-amber-950 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-amber-800" />
                                        {s.desde} a {s.hasta} {s.motivo ? `(${s.motivo})` : ""}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[10px] text-amber-800">Puedes contratar cualquier turno fuera de esas horas ocupadas.</p>
                        </div>
                    ) : (
                        <p className="text-[11px]">
                            {focusedDateInfo.isFullBlocked
                                ? "El profesional ha marcado este día como no disponible para turnos."
                                : "Todos los turnos y horarios de esta jornada están libres y disponibles para contratar."}
                        </p>
                    )}
                </div>
            ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border text-xs text-slate-500 text-center" style={{ borderColor: P.baseNeutral }}>
                    💡 Toca cualquier día del calendario para inspeccionar sus horarios y disponibilidad.
                </div>
            )}

            {/* General Overview of Blocked Rules */}
            {totalBlocks > 0 && (
                <div className="p-4 rounded-2xl border text-xs bg-white space-y-2.5" style={{ borderColor: P.baseNeutral }}>
                    <div className="flex justify-between items-center">
                        <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Reglas de Indisponibilidad del Profesional ({totalBlocks})
                        </h5>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {blockedWeekDays.map(d => (
                            <span key={d} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1">
                                <Ban className="w-3 h-3 text-rose-500" /> Todos los {d}
                            </span>
                        ))}
                        {blockedDates.map(d => (
                            <span key={d} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-rose-500" /> {d} (Día completo)
                            </span>
                        ))}
                        {Object.entries(blockedWeeklySlots).flatMap(([day, slots]) =>
                            (slots || []).map(s => (
                                <span key={s.id || s.desde} className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" /> {day}: {s.desde}-{s.hasta} {s.motivo ? `(${s.motivo})` : ""}
                                </span>
                            ))
                        )}
                        {blockedDateSlots.map(s => (
                            <span key={s.id || s.desde} className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-semibold text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-purple-600" /> {s.date}: {s.desde}-{s.hasta} {s.motivo ? `(${s.motivo})` : ""}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarAvailabilitySummary;
