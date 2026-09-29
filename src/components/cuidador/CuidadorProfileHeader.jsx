import React from "react";
import { Edit, Stethoscope, HeartHandshake } from "lucide-react";
import { P } from "../../shared";

export function CuidadorProfileHeader({ nombre, email, isEnfermero }) {
    const avatarInitial = (nombre ? nombre[0] : (email ? email[0] : "P")).toUpperCase();

    return (
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: P.baseNeutral }}>
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-sm"
                style={{ backgroundColor: isEnfermero ? "#0d9488" : P.primary }}
            >
                {avatarInitial}
            </div>
            <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800 text-base truncate">{nombre || "Profesional"}</p>
                    {isEnfermero ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                            Enfermero Matriculado
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                            Cuidador Profesional
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{email || "sin-email@email.com"}</p>
            </div>
            <button
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold hover:opacity-80 cursor-pointer"
                style={{ border: `1px solid ${P.baseNeutral}`, color: P.dark }}
            >
                <Edit className="w-3.5 h-3.5" /> Cambiar foto
            </button>
        </div>
    );
}

export default CuidadorProfileHeader;
