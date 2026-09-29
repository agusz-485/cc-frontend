import { useState } from "react";
import { XCircle, CheckCircle, Trash2 } from "lucide-react";
import { P } from "../../shared";

export function SectionAgenda({ schedule, setSchedule }) {
    const daysEnum = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

    const [selectedDay, setSelectedDay] = useState("LUNES");
    const [desde, setDesde] = useState("08:00");
    const [hasta, setHasta] = useState("14:00");
    const [overlapError, setOverlapError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Función auxiliar para convertir "HH:MM" a minutos para facilitar comparaciones
    const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    // Lógica del método UML +seSuperponeCon(FranjaHoraria otra) : boolean
    const checkOverlap = (newDesde, newHasta, existingSlots) => {
        const newStart = toMinutes(newDesde);
        const newEnd = toMinutes(newHasta);

        if (newStart >= newEnd) {
            return { error: true, msg: "La hora de inicio debe ser anterior a la hora de fin." };
        }

        for (const slot of existingSlots) {
            const extStart = toMinutes(slot.desde);
            const extEnd = toMinutes(slot.hasta);

            // Condición de solapamiento: start1 < end2 && start2 < end1
            if (newStart < extEnd && extStart < newEnd) {
                return {
                    error: true,
                    msg: `⚠️ Error de superposición (seSuperponeCon = true): Solapamiento con la franja existente de ${slot.desde} a ${slot.hasta}.`
                };
            }
        }

        return { error: false };
    };

    const handleAddSlot = (e) => {
        e.preventDefault();
        setOverlapError("");
        setSuccessMessage("");

        const existingSlots = schedule[selectedDay] || [];
        const validation = checkOverlap(desde, hasta, existingSlots);

        if (validation.error) {
            setOverlapError(validation.msg);
            return;
        }

        // Agregar la franja horaria de forma exitosa
        const newSlot = {
            id: Date.now(),
            desde,
            hasta
        };

        const updatedSlots = [...existingSlots, newSlot].sort((a, b) => toMinutes(a.desde) - toMinutes(b.desde));

        setSchedule({
            ...schedule,
            [selectedDay]: updatedSlots
        });

        setSuccessMessage(`✓ Franja horaria de ${desde} a ${hasta} añadida correctamente para el día ${selectedDay}.`);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleDeleteSlot = (day, id) => {
        setSchedule({
            ...schedule,
            [day]: schedule[day].filter(slot => slot.id !== id)
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: P.dark }}>Mi Agenda de Disponibilidad</h1>
                    <p className="text-sm mt-0.5" style={{ color: P.neutralDark }}>Administra tus franjas horarias semanales y evita superposiciones de turnos.</p>
                </div>

                {/* Form to add slot */}
                <div className="bg-white rounded-3xl p-5 border shadow-sm" style={{ borderColor: P.baseNeutral }}>
                    <h3 className="font-bold text-sm mb-4" style={{ color: P.dark }}>Añadir Franja Horaria (Clase FranjaHoraria)</h3>
                    <form onSubmit={handleAddSlot} className="flex gap-4 flex-wrap items-end">
                        <div className="flex-1 min-w-40">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Día de la semana</label>
                            <select
                                value={selectedDay}
                                onChange={e => setSelectedDay(e.target.value)}
                                className="w-full px-3 py-2 text-xs border rounded-xl outline-none cursor-pointer bg-white"
                                style={{ borderColor: P.baseNeutral }}
                            >
                                {daysEnum.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hora Desde</label>
                            <input
                                type="time"
                                value={desde}
                                onChange={e => setDesde(e.target.value)}
                                className="px-3 py-2 text-xs border rounded-xl outline-none bg-white"
                                style={{ borderColor: P.baseNeutral }}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hora Hasta</label>
                            <input
                                type="time"
                                value={hasta}
                                onChange={e => setHasta(e.target.value)}
                                className="px-3 py-2 text-xs border rounded-xl outline-none bg-white"
                                style={{ borderColor: P.baseNeutral }}
                            />
                        </div>

                        <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-95" style={{ backgroundColor: P.primary }}>
                            Añadir Franja Horaria
                        </button>
                    </form>

                    {/* Messages */}
                    {overlapError && (
                        <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 text-xs flex items-center gap-2">
                            <XCircle className="w-4.5 h-4.5 text-red-500" /> {overlapError}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 text-xs flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-green-500" /> {successMessage}
                        </div>
                    )}
                </div>

                {/* Days Grid representation of DisponibilidadSemana */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {daysEnum.map(day => {
                        const slots = schedule[day] || [];
                        return (
                            <div key={day} className="bg-white rounded-3xl p-5 border shadow-sm flex flex-col justify-between" style={{ borderColor: P.baseNeutral }}>
                                <div>
                                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                                        <span className="text-xs font-extrabold" style={{ color: P.dark }}>{day}</span>
                                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">{slots.length} franjas</span>
                                    </div>

                                    <div className="space-y-2">
                                        {slots.map(s => (
                                            <div key={s.id} className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border text-xs" style={{ borderColor: P.baseNeutral }}>
                                                <span className="font-semibold" style={{ color: P.dark }}>{s.desde} a {s.hasta}</span>
                                                <button onClick={() => handleDeleteSlot(day, s.id)} className="p-1 rounded-lg text-red-500 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {slots.length === 0 && (
                                            <p className="text-xs italic py-4 text-center" style={{ color: P.neutralDark }}>Sin disponibilidad asignada</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
