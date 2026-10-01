import { Eye } from "lucide-react";
import { P } from "../../shared";

export function AdultoMayorCard({ senior, onViewClinicalHistory }) {
  const calcularEdad = (dobString) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between" style={{ borderColor: P.baseNeutral }}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {senior.foto || senior.fotoPerfil ? (
              <img
                src={senior.foto || senior.fotoPerfil}
                alt={senior.nombre}
                className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                {senior.nombre?.[0] || "A"}{senior.apellido?.[0] || ""}
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base" style={{ color: P.dark }}>{senior.nombre} {senior.apellido}</h3>
              <p className="text-xs text-slate-400">DNI: {senior.dni}</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{
            backgroundColor: senior.activo ? "#e8f6ee" : "#fde8e8",
            color: senior.activo ? "#16a34a" : "#dc2626"
          }}>
            {senior.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border" style={{ borderColor: P.baseNeutral }}>
            <p className="text-[10px] uppercase font-bold text-slate-400">Edad</p>
            <p className="font-bold text-sm mt-0.5" style={{ color: P.dark }}>{calcularEdad(senior.fechaNacimiento)} años</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border" style={{ borderColor: P.baseNeutral }}>
            <p className="text-[10px] uppercase font-bold text-slate-400">Movilidad</p>
            <p className="font-bold text-sm mt-0.5 truncate" style={{ color: P.dark }}>{senior.movilidad}</p>
          </div>
        </div>

        {senior.observaciones && (
          <p className="text-xs bg-slate-50 p-3 rounded-xl border text-slate-600 line-clamp-2" style={{ borderColor: P.baseNeutral }}>
            <strong>Obs:</strong> {senior.observaciones}
          </p>
        )}
      </div>

      <button onClick={() => onViewClinicalHistory(senior)} className="w-full mt-4 py-2 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors hover:bg-slate-50" style={{ borderColor: P.baseNeutral, color: P.dark }}>
        <Eye className="w-4 h-4" /> Ver Historial Clínico
      </button>
    </div>
  );
}
