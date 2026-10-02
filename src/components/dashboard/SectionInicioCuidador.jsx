import { useState } from "react";
import { Calendar, DollarSign, Clock, Star, CheckCircle, AlertCircle, ArrowUpRight, FileText } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";
import { ModalDetallePaciente } from "../cuidador/ModalDetallePaciente";

export function SectionInicioCuidador({
    setActive,
    visible = false,
    statistics = {
        calificacionPromedio: 0,
        totalResenas: 0,
        cantidadServicios: 0,
        updatedAt: "Sin registros"
    },
    requests = [],
    liquidations = [],
    caregiverData = { certs: [], visible: false }
}) {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const totalWeeklyTurns = requests.filter(r => r.status === "confirmed" || r.status === "accepted").length;
    const totalEarnings = liquidations.reduce((acc, curr) => acc + curr.amount, 0);

    const safeStats = {
        calificacionPromedio: statistics?.calificacionPromedio ?? 0,
        totalResenas: statistics?.totalResenas ?? 0,
        cantidadServicios: statistics?.cantidadServicios ?? 0,
        updatedAt: statistics?.updatedAt || "Sin registros"
    };

    const stats = [
        { icon: Calendar, label: "Turnos de la semana", value: totalWeeklyTurns > 0 ? `${totalWeeklyTurns}` : "0", sub: totalWeeklyTurns > 0 ? "Próximo servicio programado" : "Sin turnos programados", color: P.primary },
        { icon: DollarSign, label: "Ganancias del mes", value: totalEarnings > 0 ? formatARS(totalEarnings) : "$0", sub: totalEarnings > 0 ? "Recaudado en el periodo" : "Sin ingresos en el periodo", color: "#16a34a" },
        { icon: Clock, label: "Horas acumuladas", value: safeStats.cantidadServicios > 0 ? `${safeStats.cantidadServicios * 6} hs` : "No disponible", sub: safeStats.cantidadServicios > 0 ? `En ${safeStats.cantidadServicios} servicios` : "Sin servicios completados", color: P.secondary },
        { icon: Star, label: "Valoración media", value: safeStats.calificacionPromedio > 0 ? `${safeStats.calificacionPromedio.toFixed(1)} ★` : "No disponible", sub: safeStats.totalResenas > 0 ? `${safeStats.totalResenas} reseñas recibidas` : "Sin reseñas recibidas", color: P.accent },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-6 text-left" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        ¡Hola! 👋
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: P.neutralDark }}>Resumen de tu actividad profesional</p>
                </div>

                {/* Visibility Status Alert */}
                {visible ? (
                    <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 border" style={{ backgroundColor: "#e8f6ee", borderColor: "#bbf7d0" }}>
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-green-800">✓ Perfil Público y Visible (visible = true)</p>
                            <p className="text-xs text-green-700">Tu perfil cumple con todas las validaciones UML requeridas y es visible para las familias en el Marketplace.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-800">⚠️ Perfil Oculto en el Directorio (visible = false)</p>
                            <p className="text-xs text-red-700">Obligatorio: Completa tus datos en la pestaña <strong>Perfil Profesional</strong> para publicar tu perfil.</p>
                        </div>
                        <button onClick={() => setActive("perfil_profesional")} className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 bg-red-600 cursor-pointer">
                            Completar Perfil
                        </button>
                    </div>
                )}

                {/* Estadisticas Card */}
                <div className="bg-white rounded-3xl p-5 border mb-6" style={{ borderColor: P.baseNeutral }}>
                    <h3 className="font-bold text-sm mb-4" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Estadísticas Consolidadas (Clase Estadistica)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-neutral-50 border" style={{ borderColor: P.baseNeutral }}>
                            <p className="text-3xl font-extrabold text-blue-600">{safeStats.calificacionPromedio.toFixed(2)} ★</p>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Calificación Promedio</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border" style={{ borderColor: P.baseNeutral }}>
                            <p className="text-3xl font-extrabold text-indigo-600">{safeStats.totalResenas}</p>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Total Reseñas</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border" style={{ borderColor: P.baseNeutral }}>
                            <p className="text-3xl font-extrabold text-emerald-600">{safeStats.cantidadServicios}</p>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Servicios Brindados</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border" style={{ borderColor: P.baseNeutral }}>
                            <p className="text-xs font-bold text-slate-700 truncate">{safeStats.updatedAt}</p>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2.5">Último Recálculo</p>
                        </div>
                    </div>
                </div>

                {/* Request Banner */}
                {requests.filter(r => r.status === "pending").map(req => (
                    <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl mb-6 border" style={{ backgroundColor: "#fffbeb", borderColor: "#fef08a" }}>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold" style={{ color: P.dark }}>Solicitud de Turno Entrante</p>
                            <p className="text-xs" style={{ color: P.neutralDark }}>{req.family} (Paciente: {req.patient}) · {req.hours} · Honorarios: {formatARS(req.amount)}</p>
                        </div>
                        <button onClick={() => setSelectedRequest(req)} className="px-3.5 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 cursor-pointer">
                            Ver Ficha Paciente
                        </button>
                        <button onClick={() => setActive("solicitudes")} className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 cursor-pointer" style={{ backgroundColor: P.accent }}>
                            Gestionar
                        </button>
                    </div>
                ))}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map(({ icon: Icon, label, value, sub, color }) => (
                        <div key={label} className="rounded-2xl p-4 bg-white border" style={{ borderColor: P.baseNeutral }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                                </div>
                                <ArrowUpRight className="w-4.5 h-4.5 text-slate-400" />
                            </div>
                            <p className="text-2xl font-bold" style={{ color: P.dark }}>{value}</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: P.dark }}>{label}</p>
                            <p className="text-xs mt-0.5" style={{ color: P.neutralDark }}>{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Grid: Próximos Servicios and Certificados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Próximos Servicios */}
                    <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm" style={{ color: P.dark }}>Próximos servicios agendados</h3>
                            <span className="text-[11px] text-slate-400">Toca para ver ficha clínica</span>
                        </div>
                        <div className="space-y-3">
                            {requests.filter(r => r.status === "confirmed" || r.status === "accepted").length === 0 ? (
                                <p className="text-xs italic py-4 text-center text-slate-500">No hay servicios programados</p>
                            ) : (
                                requests.filter(r => r.status === "confirmed" || r.status === "accepted").map(req => (
                                    <div
                                        key={req.id}
                                        onClick={() => setSelectedRequest(req)}
                                        className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                                        style={{ backgroundColor: P.neutralLight }}
                                    >
                                        <UserAvatar
                                            src={req.familiarFoto}
                                            name={req.family || "Familiar"}
                                            tipo="familiar"
                                            size="sm"
                                            shape="rounded-xl"
                                            className="w-10 h-10 border border-sky-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate group-hover:text-sky-700 transition-colors" style={{ color: P.dark }}>
                                                {req.patient} · <span className="text-xs font-normal text-slate-500">Familiar: {req.family}</span>
                                            </p>
                                            <p className="text-xs text-slate-500">{req.date} · {req.hours}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Confirmado ✓
                                            </span>
                                            <FileText className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Certificaciones */}
                    <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: P.baseNeutral }}>
                        <h3 className="font-bold text-sm mb-4" style={{ color: P.dark }}>Estado de Certificaciones</h3>
                        <div className="space-y-3">
                            {(caregiverData?.certs || []).length === 0 ? (
                                <p className="text-xs italic py-4 text-center text-slate-500">No hay certificaciones registradas</p>
                            ) : (
                                caregiverData.certs.map(c => (
                                    <div key={c.id} className="flex justify-between items-center p-3 rounded-xl border" style={{ borderColor: P.baseNeutral }}>
                                        <span className="text-xs font-semibold truncate flex-1 mr-2" style={{ color: P.dark }}>{c.title}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {c.active ? "Verificado ✓" : "Pendiente"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detalle Paciente */}
            {selectedRequest && (
                <ModalDetallePaciente
                    isOpen={!!selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    request={selectedRequest}
                />
            )}
        </div>
    );
}

export default SectionInicioCuidador;
