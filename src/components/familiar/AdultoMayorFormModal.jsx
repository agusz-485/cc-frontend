import { useState } from "react";
import { X } from "lucide-react";
import { P } from "../../shared";

export function AdultoMayorFormModal({ isOpen, onClose, onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("1944-05-12");
  const [movilidad, setMovilidad] = useState("Autónomo");
  const [observaciones, setObservaciones] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !dni) return;

    onSubmit({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      movilidad,
      observaciones,
      activo: true
    });

    setNombre("");
    setApellido("");
    setDni("");
    setFechaNacimiento("1944-05-12");
    setMovilidad("Autónomo");
    setObservaciones("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 border shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200" style={{ borderColor: P.baseNeutral }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-lg border-b pb-2.5 mb-5 text-left" style={{ color: P.dark }}>Registrar Adulto Mayor</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>Nombre</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Carlos" className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>Apellido</label>
              <input type="text" required value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Pérez" className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>DNI</label>
              <input type="text" required value={dni} onChange={e => setDni(e.target.value)} placeholder="12.345.678" className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>Fecha de Nacimiento</label>
              <input type="date" required value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none cursor-pointer bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>Movilidad</label>
            <select value={movilidad} onChange={e => setMovilidad(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none cursor-pointer bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }}>
              <option value="Autónomo">Autónomo / Sin dificultad</option>
              <option value="Bastón">Uso de Bastón</option>
              <option value="Andador">Uso de Andador</option>
              <option value="Silla de Ruedas">Silla de Ruedas</option>
              <option value="Postrado">Postrado / Movilidad Nula</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>Observaciones clínicas generales</label>
            <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Alergias, cuidados alimentarios particulares, recomendaciones físicas..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none resize-none bg-white focus:border-slate-400" style={{ borderColor: P.baseNeutral }} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border text-xs rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors" style={{ borderColor: P.baseNeutral }}>Cancelar</button>
            <button type="submit" className="px-5 py-2.5 text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity" style={{ backgroundColor: P.primary }}>Guardar Registro</button>
          </div>
        </form>
      </div>
    </div>
  );
}
