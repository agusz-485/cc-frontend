import React from "react";
import { Trash2, FileCheck, ExternalLink } from "lucide-react";
import { P } from "../../shared";
import { ImageUploadInput } from "../ui/ImageUploadInput";

export function SubSectionCertificados({
    certs,
    addCert,
    deleteCert,
    newCertTitle,
    setNewCertTitle,
    newCertIssuer,
    setNewCertIssuer,
    newCertDate,
    setNewCertDate,
    newCertFile,
    setNewCertFile
}) {
    return (
        <div className="bg-white rounded-3xl p-6 border space-y-5 shadow-sm" style={{ borderColor: P.baseNeutral }}>
            <h3 className="font-bold text-base border-b pb-2.5" style={{ color: P.dark }}>
                Certificaciones del Profesional <span className="text-red-500">*</span>
            </h3>

            {/* Certs List */}
            <div className="space-y-3">
                {certs.map(c => {
                    const docUrl = c.fileUrl || c.archivoUrl || c.documentoUrl;
                    return (
                        <div key={c.id} className="flex justify-between items-center p-3.5 rounded-xl border bg-white" style={{ borderColor: P.baseNeutral }}>
                            <div className="min-w-0 flex-1 pr-2">
                                <p className="text-sm font-bold truncate" style={{ color: P.dark }}>{c.title}</p>
                                <p className="text-xs mt-0.5 truncate" style={{ color: P.neutralDark }}>
                                    Expedido por: {c.issuer} · Vence: {c.validUntil || "Vigente"}
                                </p>
                                {docUrl && (
                                    <a
                                        href={docUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-1"
                                    >
                                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        Ver comprobante adjunto <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                            <div className="flex items-center gap-2.5 flex-shrink-0">
                                <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold">Vigente ✓</span>
                                <button
                                    type="button"
                                    onClick={() => deleteCert(c.id)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                                    title="Eliminar certificación"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
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
                </div>

                {/* Subida del Comprobante */}
                <ImageUploadInput
                    value={newCertFile}
                    onChange={(url) => setNewCertFile(url)}
                    folder="certificados"
                    label="Comprobante / Diploma digital (Opcional)"
                    isDocument={true}
                />

                <div className="flex justify-end pt-1">
                    <button
                        type="button"
                        onClick={addCert}
                        disabled={!newCertTitle || !newCertIssuer}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-95 cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: P.primary }}
                    >
                        Agregar Certificación
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubSectionCertificados;
