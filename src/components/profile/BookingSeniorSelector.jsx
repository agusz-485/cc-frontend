import { User, Plus, Loader2, Heart, UserPlus } from "lucide-react";
import { P } from "../../shared";

export function BookingSeniorSelector({
  seniors = [],
  loadingSeniors,
  selectedSeniorId,
  setSelectedSeniorId,
  onOpenRegisterModal,
}) {
  const selectedSeniorObj = seniors.find(
    (s) => String(s.idAdultoMayor || s.id) === String(selectedSeniorId)
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          ¿Para quién es el servicio? (Adulto Mayor)
        </label>
        {seniors.length > 0 && (
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
            style={{ color: P.primary }}
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar otro adulto mayor
          </button>
        )}
      </div>

      {loadingSeniors ? (
        <div className="p-4 rounded-xl border flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          Cargando adultos mayores a cargo...
        </div>
      ) : seniors.length === 0 ? (
        <div
          className="p-6 rounded-2xl border-2 border-dashed text-center space-y-3 bg-amber-50/40"
          style={{ borderColor: "#fcd34d" }}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              Aún no tienes ningún adulto mayor registrado
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Para solicitar un servicio de cuidado, primero debes completar el registro de la persona que recibirá la atención (datos personales, DNI, movilidad y condiciones).
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-95 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: P.primary }}
          >
            <UserPlus className="w-4 h-4" />
            Completar Registro de Adulto Mayor
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <select
            value={selectedSeniorId}
            onChange={(e) => setSelectedSeniorId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white outline-none focus:border-sky-500 cursor-pointer shadow-sm"
            style={{ borderColor: P.baseNeutral, color: P.dark }}
          >
            {seniors.map((s) => (
              <option key={s.idAdultoMayor || s.id} value={String(s.idAdultoMayor || s.id)}>
                {s.nombre} {s.apellido || ""} — DNI: {s.dni || "S/D"} · Movilidad: {s.movilidad || "Autónomo"}
              </option>
            ))}
          </select>

          {selectedSeniorObj && (
            <div
              className="p-3 rounded-xl border text-xs flex items-center justify-between bg-slate-50"
              style={{ borderColor: P.baseNeutral }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                  {selectedSeniorObj.nombre[0]}
                  {selectedSeniorObj.apellido ? selectedSeniorObj.apellido[0] : ""}
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {selectedSeniorObj.nombre} {selectedSeniorObj.apellido || ""}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Movilidad: <span className="font-semibold text-slate-700">{selectedSeniorObj.movilidad || "Autónomo"}</span>
                    {selectedSeniorObj.observaciones ? ` · ${selectedSeniorObj.observaciones}` : ""}
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                Seleccionado
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingSeniorSelector;
