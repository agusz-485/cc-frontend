import { FileText } from "lucide-react";
import { P } from "../../shared";

export function SectionCertificados({ caregiverData }) {
    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: P.dark }}>Certificaciones Profesionales</h1>
                        <p className="text-xs mt-0.5" style={{ color: P.neutralDark }}>Tus documentos y estado de habilitación</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {caregiverData.certs.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 border border-dashed text-center" style={{ borderColor: P.baseNeutral }}>
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="font-bold text-slate-700">No hay certificaciones registradas</p>
                            <p className="text-xs text-slate-500 mt-1">Carga tus títulos y certificados en la pestaña de <strong>Perfil Profesional</strong> para validarlos.</p>
                        </div>
                    ) : (
                        caregiverData.certs.map(c => (
                            <div key={c.id} className="bg-white rounded-2xl p-5 border flex justify-between items-center" style={{ borderColor: P.baseNeutral }}>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm" style={{ color: P.dark }}>{c.title}</h3>
                                    <p className="text-xs" style={{ color: P.neutralDark }}>{c.issuer} · Válido hasta: {c.validUntil}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {c.active ? "Verificado ✓" : "En Validación"}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
