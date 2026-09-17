import { Calendar, DollarSign, Users, Star, Clock, ArrowUpRight, ChevronRight } from "lucide-react";
import { P, formatARS } from "../../shared";

export function SectionInicio({ setActive, navigate, bookings = [], savedCaregivers = [], activity = [], userName }) {
    const activeBookingsCount = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length;
    const totalSpent = bookings.filter(b => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + b.amount, 0);
    const savedCount = savedCaregivers.length;

    const stats = [
        { icon: Calendar, label: "Reservas activas", value: activeBookingsCount.toString(), sub: activeBookingsCount > 0 ? "Próxima reserva programada" : "Sin reservas activas", color: P.primary },
        { icon: DollarSign, label: "Gasto este mes", value: totalSpent > 0 ? formatARS(totalSpent) : "$0", sub: totalSpent > 0 ? "Gasto total acumulado" : "Sin gastos este mes", color: "#16a34a" },
        { icon: Users, label: "Cuidadores guardados", value: savedCount.toString(), sub: savedCount > 0 ? `${savedCount} cuidadores en tus favoritos` : "Sin cuidadores guardados", color: P.secondary },
        { icon: Star, label: "Reseñas dejadas", value: "0", sub: "Sin opiniones registradas", color: P.accent },
    ];

    return (<div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Buenos días{userName ? `, ${userName}` : ""} 👋
                </h1>
                <p className="text-sm mt-1" style={{ color: P.neutralDark }}>
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {bookings.filter(b => b.status === "pending").map(b => (
                <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white">Reserva pendiente de confirmación</p>
                        <p className="text-xs text-white/70">{b.id} · {b.caregiver.name} · {b.dateStart} · {b.type}</p>
                    </div>
                    <button onClick={() => setActive("bookings")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90" style={{ backgroundColor: P.accent, color: "white" }}>
                        Confirmar <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            ))}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(({ icon: Icon, label, value, sub, color }) => (<div key={label} className="rounded-2xl p-4" style={{ backgroundColor: "white", border: `1px solid ${P.baseNeutral}` }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                            <Icon className="w-4.5 h-4.5" style={{ color }} />
                        </div>
                        <ArrowUpRight className="w-4.5 h-4.5" style={{ color: P.neutralDark }} />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: P.dark }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: P.neutralDark }}>{sub}</p>
                </div>))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: `1px solid ${P.baseNeutral}` }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Próximas reservas</h3>
                        <button onClick={() => setActive("bookings")} className="text-xs font-semibold hover:opacity-70" style={{ color: P.primary }}>Ver todas</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {bookings.filter(b => b.status === "confirmed" || b.status === "pending").map(b => (<div key={b.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: P.neutralLight }}>
                            <img src={b.caregiver.image} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt={b.caregiver.name} style={{ backgroundColor: P.baseNeutral }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: P.dark }}>{b.caregiver.name}</p>
                                <p className="text-xs" style={{ color: P.neutralDark }}>{b.dateStart}{b.dateStart !== b.dateEnd ? ` → ${b.dateEnd}` : ""}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ backgroundColor: b.status === "confirmed" ? "#e8f6ee" : "#fef0e6", color: b.status === "confirmed" ? "#16a34a" : P.accent }}>
                                {b.status === "confirmed" ? "Confirmada" : "Pendiente"}
                            </span>
                        </div>))}
                    </div>
                </div>

                <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: `1px solid ${P.baseNeutral}` }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Actividad reciente</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        {activity.slice(0, 4).map(({ icon: Icon, color, text, time }) => (<div key={text} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                                <Icon className="w-4.5 h-4.5" style={{ color }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: P.dark }}>{text}</p>
                                <p className="text-xs" style={{ color: P.neutralDark }}>{time}</p>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
