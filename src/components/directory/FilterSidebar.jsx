import { P, formatARS } from "../../shared";

export function FilterSidebar({
  priceMax,
  setPriceMax,
  minRating,
  setMinRating,
  careTypes,
  setCareTypes,
  careTypeOptions,
  selectedType,
  setSelectedType
}) {
  const toggleCareType = (type) => {
    setCareTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const activeFilterCount = careTypes.length + (minRating > 0 ? 1 : 0) + (priceMax < 100000 ? 1 : 0) + (selectedType !== "todos" ? 1 : 0);

  return (
    <aside className="w-60 flex-shrink-0 hidden lg:block text-left">
      <div className="rounded-2xl p-5 sticky top-36 bg-white border" style={{ borderColor: P.baseNeutral }}>
        <h3 className="font-extrabold text-sm mb-5 text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Filtros</h3>

        {/* Tipo de Profesional */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500">Tipo de profesional</p>
          <div className="flex flex-col gap-2.5">
            {[
              { id: "todos", label: "Todos" },
              { id: "cuidador", label: "Cuidadores" },
              { id: "enfermero", label: "Enfermeros" }
            ].map((t) => (
              <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="professionalType"
                  checked={selectedType === t.id}
                  onChange={() => setSelectedType(t.id)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: P.primary }}
                />
                <span className="text-xs font-semibold text-slate-700">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: P.baseNeutral }} className="mb-5" />

        {/* Rating */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500">Valoración mínima</p>
          <div className="flex flex-col gap-2.5">
            {[0, 4, 4.5, 4.8].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: P.primary }}
                />
                <div className="flex items-center gap-1.5">
                  {r === 0 ? (
                    <span className="text-xs font-semibold text-slate-700">Cualquier valoración</span>
                  ) : (
                    <>
                      <span className="text-xs font-extrabold text-slate-800">{r}+</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">estrellas</span>
                    </>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: P.baseNeutral }} />

        {/* Price range */}
        <div className="my-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Precio máx. por hora</p>
          <p className="text-sm font-extrabold mb-3" style={{ color: P.primary }}>
            {priceMax >= 100000 ? "Sin límite ($100.000+)" : `${formatARS(priceMax)}/h`}
          </p>
          <input
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={priceMax}
            onChange={(e) => setPriceMax(+e.target.value)}
            className="w-full cursor-pointer"
            style={{ accentColor: P.primary }}
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
            <span>$1.000</span>
            <span>$100.000+</span>
          </div>
        </div>

        <hr style={{ borderColor: P.baseNeutral }} />

        {/* Care type */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500">Especialidades</p>
          <div className="flex flex-col gap-2.5">
            {careTypeOptions.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={careTypes.includes(type)}
                  onChange={() => toggleCareType(type)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: P.primary }}
                />
                <span className="text-xs font-semibold text-slate-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={() => { setCareTypes([]); setMinRating(0); setPriceMax(100000); setSelectedType("todos"); }}
            className="w-full mt-5 py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-slate-50 text-slate-500 cursor-pointer"
            style={{ borderColor: P.baseNeutral }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}
