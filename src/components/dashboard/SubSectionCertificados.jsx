import { Trash2 } from "lucide-react";
import { P } from "../../shared";

export function SubSectionCertificados({
    certs,
    addCert,
    deleteCert,
    newCertTitle,
    setNewCertTitle,
    newCertIssuer,
    setNewCertIssuer,
    newCertDate,
    setNewCertDate
}) {
    return (
        <div className="bg-white rounded-3xl p-6 border space-y-5 shadow-sm" style={{ borderColor: P.baseNeutral }}>
            <h3 className="font-bold text-base border-b pb-2.5" style={{ color: P.dark }}>Certificaciones del Profesional <span className="text-red-500">*</span></h3>

            {/* Certs List */}
            <div className="space-y-3">
                {certs.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3.5 rounded-xl border" style={{ borderColor: P.baseNeutral }}>
                        <div>
                            <p className="text-sm font-bold" style={{ color: P.dark }}>{c.title}</p>
                            <p className="text-xs" style={{ color: P.neutralDark }}>Expedido por: {c.issuer} · Vence: {c.validUntil}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold">Vigente ✓</span>
                            <button onClick={() => deleteCert(c.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {certs.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-red-300 text-center text-xs text-red-500">
                        No has cargado certificaciones válidas. Al menos una certificación activa es obligatoria.
                    </div>
                )}
            </div>

            {/* Add Certificate form */}
            <div className="p-4 rounded-2xl bg-neutral-50 border space-y-3.5" style={{ borderColor: P.baseNeutral }}>
                <p className="text-xs font-bold" style={{ color: P.dark }}>Añadir Nueva Certificación</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={newCertTitle}
                        onChange={e => setNewCertTitle(e.target.value)}
                        placeholder="Título (Ej. RCP Avanzado)"
                        className="px-3 py-2 text-xs border rounded-xl outline-none bg-white"
                        style={{ borderColor: P.baseNeutral }}
                    />
                    <input
                        type="text"
                        value={newCertIssuer}
                        onChange={e => setNewCertIssuer(e.target.value)}
                        placeholder="Ente Emisor (Ej. Cruz Roja)"
                        className="px-3 py-2 text-xs border rounded-xl outline-none bg-white"
                        style={{ borderColor: P.baseNeutral }}
                    />
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    <div className="flex-1 min-w-32 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vence:</span>
                        <input
                            type="date"
                            value={newCertDate}
                            onChange={e => setNewCertDate(e.target.value)}
                            className="px-3 py-1.5 text-xs border rounded-xl outline-none bg-white flex-1"
                            style={{ borderColor: P.baseNeutral }}
                        />
                    </div>
                    <button onClick={addCert} className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-95" style={{ backgroundColor: P.primary }}>
                        Agregar Certificación
                    </button>
                </div>
            </div>
        </div>
    );
}
