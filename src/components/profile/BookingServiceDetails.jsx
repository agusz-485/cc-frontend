import React from "react";
import { MapPin, FileText } from "lucide-react";
import { P } from "../../shared";

export function BookingServiceDetails({ address, setAddress, notes, setNotes }) {
  return (
    <>
      {/* Dirección */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          Dirección donde se brindará el servicio
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej. Av. Santa Fe 1840, 3°B, Palermo, CABA"
          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white outline-none focus:border-sky-500"
          style={{ borderColor: P.baseNeutral, color: P.dark }}
        />
      </div>

      {/* Indicaciones médicas */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          Indicaciones médicas / Requerimientos especiales
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej. Toma medicación a las 9hs. Usa andador..."
          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white outline-none focus:border-sky-500 resize-none"
          style={{ borderColor: P.baseNeutral, color: P.dark }}
        />
      </div>
    </>
  );
}

export default BookingServiceDetails;
