import { Check } from "lucide-react";
import { P } from "../../shared";

export function SubSectionChecklistPublicacion({
    professionalType,
    isMatriculaValid,
    isBioValid,
    isExperienceValid,
    isPriceValid,
    isMainZoneValid,
    hasSpecialty,
    hasActiveCert,
    isProfileCompletable,
    caregiverData,
    handlePublish,
    handleUnpublish
}) {
    const checklistItems = [
        ...(professionalType === "enfermero" ? [{ label: "Matrícula Profesional", ok: isMatriculaValid }] : []),
        { label: "Biografía (mínimo 20 caracteres)", ok: isBioValid },
        { label: "Años de Experiencia definidos", ok: isExperienceValid },
        { label: "Tarifa por hora válida", ok: isPriceValid },
        { label: "Zona Principal definida", ok: isMainZoneValid },
        ...(professionalType === "cuidador" ? [
            { label: "Al menos 1 especialidad", ok: hasSpecialty },
            { label: "Al menos 1 certificación", ok: hasActiveCert }
        ] : [])
    ];

    return (
        <div className="bg-white rounded-3xl p-6 border shadow-sm sticky top-24 space-y-5" style={{ borderColor: P.baseNeutral }}>
            <h3 className="font-bold text-base border-b pb-2.5" style={{ color: P.dark }}>Checklist de Publicación</h3>

            <div className="space-y-3.5">
                {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                        <span style={{ color: item.ok ? P.dark : P.neutralDark }}>{item.label}</span>
                        {item.ok ? (
                            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                <Check className="w-3.5 h-3.5" />
                            </span>
                        ) : (
                            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">
                                !
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <hr style={{ borderColor: P.baseNeutral }} />

            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                    <span style={{ color: P.dark }}>Estado de publicación:</span>
                    <span className={caregiverData.visible ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                        {caregiverData.visible ? "PÚBLICO" : "OCULTO"}
                    </span>
                </div>
                <p className="text-[10px]" style={{ color: P.neutralDark }}>
                    Para publicar tu perfil y hacerlo visible para contratación, debes completar primero la matrícula profesional, especialidades, certificaciones y tarifa por hora.
                </p>
            </div>

            {caregiverData.visible ? (
                <button onClick={handleUnpublish} className="w-full py-3 rounded-2xl border text-xs font-bold text-red-600 hover:bg-red-50 border-red-200">
                    Despublicar Perfil
                </button>
            ) : (
                <button
                    onClick={handlePublish}
                    disabled={!isProfileCompletable}
                    className="w-full py-3 rounded-2xl text-white font-bold text-xs transition-opacity hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: P.primary }}
                >
                    Publicar Perfil Ahora
                </button>
            )}
        </div>
    );
}
