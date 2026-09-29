import { Plus, X } from "lucide-react";
import { P } from "../../shared";
import { PROVINCIAS_ARGENTINA } from "../../shared/locations";

export function SubSectionZonasCobertura({
    coverageZones,
    addCoverageZone,
    removeCoverageZone,
    selProv,
    setSelProv,
    selCity,
    setSelCity
}) {
    return (
        <div className="bg-white rounded-3xl p-6 border space-y-4 shadow-sm" style={{ borderColor: P.baseNeutral }}>
            <h3 className="font-bold text-base border-b pb-2.5 mb-3.5" style={{ color: P.dark }}>Zonas de Cobertura Domiciliaria</h3>
            
            {/* Selectores y Botón de Agregar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500">Provincia</label>
                    <select
                        value={selProv}
                        onChange={e => {
                            setSelProv(e.target.value);
                            setSelCity("");
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none bg-white transition-all focus:border-slate-400"
                        style={{ borderColor: P.baseNeutral }}
                    >
                        <option value="">Seleccionar Provincia...</option>
                        {Object.keys(PROVINCIAS_ARGENTINA).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500">Ciudad / Localidad</label>
                    <select
                        value={selCity}
                        onChange={e => setSelCity(e.target.value)}
                        disabled={!selProv}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none bg-white transition-all disabled:opacity-50 focus:border-slate-400"
                        style={{ borderColor: P.baseNeutral }}
                    >
                        <option value="">Seleccionar Localidad...</option>
                        {selProv && PROVINCIAS_ARGENTINA[selProv].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={addCoverageZone}
                        disabled={!selProv || !selCity}
                        className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 hover:opacity-95"
                        style={{ backgroundColor: P.secondary }}
                    >
                        <Plus className="w-4 h-4" />
                        Agregar Zona
                    </button>
                </div>
            </div>

            {/* Lista de Zonas Agregadas */}
            <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Zonas Secundarias Agregadas</label>
                {coverageZones.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No se han seleccionado zonas de cobertura secundaria todavía.</p>
                ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {coverageZones.map(zone => (
                            <div
                                key={zone}
                                className="pl-3.5 pr-2.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all"
                                style={{
                                    borderColor: `${P.secondary}60`,
                                    backgroundColor: `${P.secondary}08`,
                                    color: P.dark
                                }}
                            >
                                <span>{zone}</span>
                                <button
                                    type="button"
                                    onClick={() => removeCoverageZone(zone)}
                                    className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-[10px] mt-2.5" style={{ color: P.neutralDark }}>Zonas de cobertura adicionales donde prestarás servicios domiciliarios.</p>
        </div>
    );
}
