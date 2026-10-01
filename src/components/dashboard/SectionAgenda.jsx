import { useState } from "react";
import { CheckCircle, AlertCircle, Ban, Calendar, Clock, Plus } from "lucide-react";
import { P } from "../../shared";
import { AgendaBlockList } from "../cuidador/AgendaBlockList";
import { saveCaregiverSchedule } from "../../services/searchService";

const DAYS_ENUM = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

export function SectionAgenda({ schedule, setSchedule }) {
    const [mode, setMode] = useState("recurrent_day");
    const [selectedDay, setSelectedDay] = useState("DOMINGO");
    const [selectedDate, setSelectedDate] = useState("");
    const [desde, setDesde] = useState("08:00");
    const [hasta, setHasta] = useState("14:00");
    const [motivo, setMotivo] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const normalizedSchedule = {
        blockedWeekDays: Array.isArray(schedule?.blockedWeekDays) ? schedule.blockedWeekDays : [],
        blockedDates: Array.isArray(schedule?.blockedDates) ? schedule.blockedDates : [],
        blockedWeeklySlots: schedule?.blockedWeeklySlots || { LUNES: [], MARTES: [], MIERCOLES: [], JUEVES: [], VIERNES: [], SABADO: [], DOMINGO: [] },
        blockedDateSlots: Array.isArray(schedule?.blockedDateSlots) ? schedule.blockedDateSlots : [],
    };

    const updateScheduleAndStorage = async (newSchedule) => {
        setSchedule(newSchedule);
        const uid = localStorage.getItem("user_id");
        const role = localStorage.getItem("user_role") || "cuidador";
        await saveCaregiverSchedule(uid, newSchedule, role);
    };

    const handleAddBlock = (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (mode === "recurrent_day") {
            if (normalizedSchedule.blockedWeekDays.includes(selectedDay)) {
                setErrorMsg(`El día ${selectedDay} ya se encuentra bloqueado.`);
                return;
            }
            updateScheduleAndStorage({ ...normalizedSchedule, blockedWeekDays: [...normalizedSchedule.blockedWeekDays, selectedDay] });
            setSuccessMsg(`✓ Se bloqueó todos los ${selectedDay} para todo el mes (Guardado en base de datos).`);
        } else if (mode === "specific_date") {
            if (!selectedDate) return setErrorMsg("Debes seleccionar una fecha específica para bloquear.");
            if (normalizedSchedule.blockedDates.includes(selectedDate)) return setErrorMsg(`La fecha ${selectedDate} ya está bloqueada.`);
            updateScheduleAndStorage({ ...normalizedSchedule, blockedDates: [...normalizedSchedule.blockedDates, selectedDate] });
            setSuccessMsg(`✓ Se bloqueó el día ${selectedDate} (Guardado en base de datos).`);
        } else if (mode === "recurrent_slot") {
            if (desde >= hasta) return setErrorMsg("La hora de inicio debe ser anterior a la hora de fin.");
            const existing = normalizedSchedule.blockedWeeklySlots[selectedDay] || [];
            updateScheduleAndStorage({
                ...normalizedSchedule,
                blockedWeeklySlots: { ...normalizedSchedule.blockedWeeklySlots, [selectedDay]: [...existing, { id: Date.now(), desde, hasta, motivo: motivo.trim() }] },
            });
            setSuccessMsg(`✓ Se bloqueó de ${desde} a ${hasta} los ${selectedDay} (Guardado en base de datos).`);
        } else if (mode === "specific_slot") {
            if (!selectedDate) return setErrorMsg("Debes indicar la fecha puntual para el bloqueo horario.");
            if (desde >= hasta) return setErrorMsg("La hora de inicio debe ser anterior a la hora de fin.");
            updateScheduleAndStorage({
                ...normalizedSchedule,
                blockedDateSlots: [...normalizedSchedule.blockedDateSlots, { id: Date.now(), date: selectedDate, desde, hasta, motivo: motivo.trim() }],
            });
            setSuccessMsg(`✓ Se bloqueó de ${desde} a ${hasta} para el día ${selectedDate} (Guardado en base de datos).`);
        }

        setMotivo("");
        setTimeout(() => setSuccessMsg(""), 3500);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 text-left" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Mi Agenda de Disponibilidad
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Por defecto, <strong>todos los días y horarios están disponibles</strong>. Marca aquí los días o franjas en que NO puedas atender.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-4" style={{ borderColor: P.baseNeutral }}>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Ban className="w-4 h-4 text-rose-500" /> Marcar Momento o Día No Disponible
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                        {[
                            { id: "recurrent_day", label: "Día (Todo el mes)", icon: Calendar },
                            { id: "specific_date", label: "Día Específico", icon: Calendar },
                            { id: "recurrent_slot", label: "Horario (Todo el mes)", icon: Clock },
                            { id: "specific_slot", label: "Horario de un Día", icon: Clock },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setMode(id)}
                                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                    mode === id ? "bg-rose-50 text-rose-800 border-rose-200 font-bold" : "bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${mode === id ? "text-rose-600" : "text-slate-400"}`} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleAddBlock} className="pt-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(mode === "recurrent_day" || mode === "recurrent_slot") && (
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Día semanal</label>
                                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-white font-medium" style={{ borderColor: P.baseNeutral }}>
                                        {DAYS_ENUM.map((d) => <option key={d} value={d}>Todos los {d}</option>)}
                                    </select>
                                </div>
                            )}

                            {(mode === "specific_date" || mode === "specific_slot") && (
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha puntual</label>
                                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-white font-medium" style={{ borderColor: P.baseNeutral }} />
                                </div>
                            )}

                            {(mode === "recurrent_slot" || mode === "specific_slot") && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hora Desde</label>
                                        <input type="time" value={desde} onChange={(e) => setDesde(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-white font-medium" style={{ borderColor: P.baseNeutral }} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hora Hasta</label>
                                        <input type="time" value={hasta} onChange={(e) => setHasta(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-white font-medium" style={{ borderColor: P.baseNeutral }} />
                                    </div>
                                </>
                            )}

                            <div className={mode === "recurrent_day" || mode === "specific_date" ? "sm:col-span-2" : "sm:col-span-3"}>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Motivo (Opcional)</label>
                                <input type="text" placeholder="Ej: Feriado, descanso, clases, turno médico..." value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-white" style={{ borderColor: P.baseNeutral }} />
                            </div>
                        </div>

                        {errorMsg && <div className="p-3 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> {errorMsg}</div>}
                        {successMsg && <div className="p-3 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 text-xs flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {successMsg}</div>}

                        <div className="flex justify-end pt-1">
                            <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-sm" style={{ backgroundColor: "#e11d48" }}>
                                <Plus className="w-4 h-4" /> Bloquear Disponibilidad
                            </button>
                        </div>
                    </form>
                </div>

                <AgendaBlockList
                    schedule={normalizedSchedule}
                    onUnblockWeekDay={(day) => updateScheduleAndStorage({ ...normalizedSchedule, blockedWeekDays: normalizedSchedule.blockedWeekDays.filter((d) => d !== day) })}
                    onUnblockDate={(dateStr) => updateScheduleAndStorage({ ...normalizedSchedule, blockedDates: normalizedSchedule.blockedDates.filter((d) => d !== dateStr) })}
                    onDeleteWeeklySlot={(day, id) => updateScheduleAndStorage({ ...normalizedSchedule, blockedWeeklySlots: { ...normalizedSchedule.blockedWeeklySlots, [day]: (normalizedSchedule.blockedWeeklySlots[day] || []).filter((s) => s.id !== id) } })}
                    onDeleteDateSlot={(id) => updateScheduleAndStorage({ ...normalizedSchedule, blockedDateSlots: normalizedSchedule.blockedDateSlots.filter((s) => s.id !== id) })}
                />
            </div>
        </div>
    );
}

export default SectionAgenda;
