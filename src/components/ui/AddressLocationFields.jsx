import { P } from "../../shared";
import { PROVINCIAS_ARGENTINA } from "../../shared/locations";

export function AddressLocationFields({
    direccion,
    setDireccion,
    provincia,
    setProvincia,
    ciudad,
    setCiudad,
    cp,
    setCp,
}) {
    return (
        <>
            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                    Dirección de residencia
                </label>
                <input
                    type="text"
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Calle y número"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                    Provincia
                </label>
                <select
                    value={provincia}
                    onChange={e => setProvincia(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none cursor-pointer focus:border-blue-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                >
                    <option value="">Selecciona una provincia</option>
                    {Object.keys(PROVINCIAS_ARGENTINA).map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                    Ciudad / Localidad
                </label>
                <select
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                    disabled={!provincia}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer focus:border-blue-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                >
                    <option value="">Selecciona una ciudad</option>
                    {(PROVINCIAS_ARGENTINA[provincia] || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                    Código postal
                </label>
                <input
                    type="text"
                    value={cp}
                    onChange={e => setCp(e.target.value)}
                    placeholder="Ej. 1425"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                />
            </div>
        </>
    );
}

export default AddressLocationFields;
