import { Clock } from "lucide-react";
import { P, formatARS } from "../../shared";

export function SectionSolicitudes({ requests = [], setRequests }) {
    const handleAccept = (reqId) => {
        setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "accepted" } : r));
    };
    const handleReject = (reqId) => {
        setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "rejected" } : r));
    };

    const pendingRequests = requests.filter(r => r.status === "pending");

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-2xl font-bold mb-6" style={{ color: P.dark }}>Solicitudes de Servicio</h1>

                {pendingRequests.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 border border-dashed text-center" style={{ borderColor: P.baseNeutral }}>
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="font-bold text-slate-700">No hay solicitudes de servicio pendientes</p>
                        <p className="text-xs text-slate-500 mt-1">Cuando una familia solicite tus servicios, aparecerá aquí.</p>
                    </div>
                ) : (
                    pendingRequests.map(req => (
                        <div key={req.id} className="bg-white rounded-2xl p-5 border space-y-4" style={{ borderColor: P.baseNeutral }}>
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                                        {req.family[0]}{req.family.split(" ")[1]?.[0] || ""}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base" style={{ color: P.dark }}>{req.family}</h3>
                                        <p className="text-xs" style={{ color: P.neutralDark }}>Paciente: {req.patient}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold animate-pulse" style={{ backgroundColor: "#fff7ed", color: P.accent }}>Pendiente</span>
                            </div>

                            <div className="p-4 rounded-xl space-y-2 text-xs" style={{ backgroundColor: P.neutralLight, color: P.dark }}>
                                <p><strong>Fecha:</strong> {req.date}</p>
                                <p><strong>Horario:</strong> {req.hours}</p>
                                {req.notes && <p><strong>Notas:</strong> {req.notes}</p>}
                                <p className="text-sm font-bold mt-2" style={{ color: P.primary }}>Honorarios: {formatARS(req.amount)}</p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={() => handleReject(req.id)} className="flex-1 py-2.5 rounded-xl border font-bold text-xs hover:bg-red-50 text-red-600 focus:outline-none" style={{ borderColor: "#fca5a5" }}>Rechazar</button>
                                <button onClick={() => handleAccept(req.id)} className="flex-1 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-95 focus:outline-none" style={{ backgroundColor: P.primary }}>Aceptar Reserva</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
