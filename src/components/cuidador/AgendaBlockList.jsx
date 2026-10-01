import { Calendar, Clock, Trash2, ShieldAlert, Sparkles } from "lucide-react";
import { P } from "../../shared";

export function AgendaBlockList({ schedule, onUnblockWeekDay, onUnblockDate, onDeleteWeeklySlot, onDeleteDateSlot }) {
    const { blockedWeekDays = [], blockedDates = [], blockedWeeklySlots = {}, blockedDateSlots = [] } = schedule;

    const totalWeeklySlots = Object.values(blockedWeeklySlots).reduce((acc, list) => acc + (list?.length || 0), 0);
    const totalBlocks = blockedWeekDays.length + blockedDates.length + totalWeeklySlots + blockedDateSlots.length;

    if (totalBlocks === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-dashed text-center shadow-sm" style={{ borderColor: P.baseNeutral }}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Disponibilidad Total Activa</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Actualmente no tienes ningún bloqueo de días ni horarios. Todas las familias podrán contratarte en cualquier fecha y turno.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Bloqueos y Excepciones Activas ({totalBlocks})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Días de la semana bloqueados para todo el mes */}
                {blockedWeekDays.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border shadow-sm space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: P.baseNeutral }}>
                            <Calendar className="w-4 h-4 text-rose-500" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Días No Disponibles (Todo el mes)</h4>
                        </div>
                        <div className="space-y-2">
                            {blockedWeekDays.map(day => (
                                <div key={day} className="flex justify-between items-center p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
                                    <span className="font-bold text-rose-900">Todos los {day}</span>
                                    <button onClick={() => onUnblockWeekDay(day)} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer" title="Desbloquear día">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Fechas específicas completas */}
                {blockedDates.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border shadow-sm space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: P.baseNeutral }}>
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Fechas Específicas Bloqueadas</h4>
                        </div>
                        <div className="space-y-2">
                            {blockedDates.map(dateStr => (
                                <div key={dateStr} className="flex justify-between items-center p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs">
                                    <span className="font-bold text-amber-900">{dateStr} (Día Completo)</span>
                                    <button onClick={() => onUnblockDate(dateStr)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 cursor-pointer" title="Desbloquear fecha">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Franjas horarias recurrentes para todo el mes */}
                {totalWeeklySlots > 0 && (
                    <div className="bg-white rounded-3xl p-5 border shadow-sm space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: P.baseNeutral }}>
                            <Clock className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Horarios Bloqueados (Semanales)</h4>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(blockedWeeklySlots).flatMap(([day, slots]) =>
                                (slots || []).map(slot => (
                                    <div key={slot.id} className="flex justify-between items-center p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
                                        <div>
                                            <p className="font-bold text-indigo-950">{day}: {slot.desde} a {slot.hasta}</p>
                                            {slot.motivo && <p className="text-[10px] text-indigo-600">{slot.motivo}</p>}
                                        </div>
                                        <button onClick={() => onDeleteWeeklySlot(day, slot.id)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 4. Franjas horarias específicas por fecha */}
                {blockedDateSlots.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border shadow-sm space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: P.baseNeutral }}>
                            <Clock className="w-4 h-4 text-purple-500" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Horarios Bloqueados en Fechas Puntuales</h4>
                        </div>
                        <div className="space-y-2">
                            {blockedDateSlots.map(slot => (
                                <div key={slot.id} className="flex justify-between items-center p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs">
                                    <div>
                                        <p className="font-bold text-purple-950">{slot.date}: {slot.desde} a {slot.hasta}</p>
                                        {slot.motivo && <p className="text-[10px] text-purple-600">{slot.motivo}</p>}
                                    </div>
                                    <button onClick={() => onDeleteDateSlot(slot.id)} className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgendaBlockList;
