import { Calendar, DollarSign, Users, Star, Clock, ArrowUpRight, ChevronRight, Activity } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";

export function SectionInicio({ setActive, navigate, bookings = [], savedCaregivers = [], activity = [], userName }) {
    const activeBookingsCount = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length;
    const totalSpent = bookings.filter(b => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + (b.amount || 0), 0);
    const savedCount = savedCaregivers.length;

    const stats = [
        { icon: Calendar, label: "Reservas activas", value: activeBookingsCount.toString(), sub: activeBookingsCount > 0 ? "Próxima reserva programada" : "Sin reservas activas", color: P.primary },
        { icon: DollarSign, label: "Gasto acumulado", value: totalSpent > 0 ? formatARS(totalSpent) : "$0", sub: totalSpent > 0 ? "Inversión en cuidados" : "Sin gastos registrados", color: "#16a34a" },
        { icon: Users, label: "Cuidadores guardados", value: savedCount.toString(), sub: savedCount > 0 ? `${savedCount} en favoritos` : "Explora el directorio", color: P.secondary },
        { icon: Star, label: "Reseñas dejadas", value: "0", sub: "Sin opiniones registradas", color: P.accent },
    ];

    const pendingBooking = bookings.find(b => b.status === "pending");

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Buenos días{userName ? `, ${userName}` : ""} 👋
                    </h1>
                    <p className="text-sm mt-1" style={{ color: P.neutralDark }}>
                        {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Banner de Reserva Pendiente */}
                {pendingBooking && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 shadow-sm flex-wrap sm:flex-nowrap" style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">Solicitud de Reserva Pendiente</p>
                            <p className="text-xs text-white/80 truncate">
                                {pendingBooking.id} · {pendingBooking.caregiver?.name} · {pendingBooking.datesText || pendingBooking.dateStart}
                                {pendingBooking.senior?.nombre ? ` (Para ${pendingBooking.senior.nombre})` : ""}
                            </p>
                        </div>
                        <button 
                            onClick={() => setActive("bookings")} 
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 ml-auto cursor-pointer" 
                            style={{ backgroundColor: P.accent, color: "white" }}
                        >
                            Ver Reservas <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Métricas / Estadísticas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map(({ icon: Icon, label, value, sub, color }) => (
                        <div key={label} className="rounded-2xl p-4 bg-white border shadow-sm" style={{ borderColor: P.baseNeutral }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                                </div>
                                <ArrowUpRight className="w-4.5 h-4.5 text-slate-400" />
                            </div>
                            <p className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
                            <p className="text-xs font-medium mt-0.5 text-slate-700">{label}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: P.neutralDark }}>{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Secciones Próximas Reservas & Actividad */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                    <div className="rounded-2xl p-5 bg-white border shadow-sm" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Próximas reservas</h3>
                            <button onClick={() => setActive("bookings")} className="text-xs font-semibold hover:opacity-70 cursor-pointer" style={{ color: P.primary }}>Ver todas</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {bookings.filter(b => b.status === "confirmed" || b.status === "pending").length === 0 ? (
                                <div className="py-8 text-center text-slate-400">
                                    <p className="text-xs font-medium">No tienes reservas activas en este momento.</p>
                                    <button onClick={() => navigate("/directory")} className="mt-2 text-xs font-bold underline" style={{ color: P.primary }}>Explorar Directorio</button>
                                </div>
                            ) : (
                                bookings.filter(b => b.status === "confirmed" || b.status === "pending").slice(0, 3).map(b => (
                                    <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: P.neutralLight }}>
                                        <UserAvatar
                                            src={b.caregiver?.image}
                                            name={b.caregiver?.name || "Profesional"}
                                            size="sm"
                                            shape="rounded-full"
                                            className="w-9 h-9"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate text-slate-800">{b.caregiver?.name}</p>
                                            <p className="text-xs" style={{ color: P.neutralDark }}>
                                                {b.datesText || b.dateStart}
                                                {b.senior?.nombre ? ` · ${b.senior.nombre}` : ""}
                                            </p>
                                        </div>
                                        <span 
                                            className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" 
                                            style={{ 
                                                backgroundColor: b.status === "confirmed" ? "#e8f6ee" : "#fef0e6", 
                                                color: b.status === "confirmed" ? "#16a34a" : P.accent 
                                            }}
                                        >
                                            {b.status === "confirmed" ? "Confirmada" : "Pendiente"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl p-5 bg-white border shadow-sm" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Actividad reciente</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {activity.length === 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-sky-50 text-sky-700">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-semibold text-slate-800">Sistema de reservas activo</p>
                                            <p className="text-[11px] text-slate-400">Podrás solicitar y coordinar turnos con cuidadores y enfermeros matriculados.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-50 text-emerald-700">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-semibold text-slate-800">Seguimiento de adultos mayores</p>
                                            <p className="text-[11px] text-slate-400">Gestiona medicamentos, patologías y notas de cuidado en la sección Adultos a Cargo.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                activity.slice(0, 4).map(({ icon: Icon, color, text, time }) => (
                                    <div key={text} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                                            <Icon className="w-4.5 h-4.5" style={{ color }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium" style={{ color: P.dark }}>{text}</p>
                                            <p className="text-xs" style={{ color: P.neutralDark }}>{time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
