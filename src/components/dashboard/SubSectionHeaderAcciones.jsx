import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { P } from "../../shared";

export function SubSectionHeaderAcciones({
    caregiverData,
    isProfileCompletable,
    saving,
    saveSuccess,
    saveError,
    handlePublish,
    handleUnpublish,
    handleSave,
}) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Mi Perfil Profesional
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: P.neutralDark }}>
                        Completa y actualiza tus datos directamente en la plataforma.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {caregiverData?.visible ? (
                        <button
                            onClick={handleUnpublish}
                            disabled={saving}
                            className="px-4 py-2 border rounded-xl text-xs font-bold text-red-600 border-red-200 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Despublicar Perfil
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            disabled={!isProfileCompletable || saving}
                            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                            style={{ backgroundColor: P.primary }}
                        >
                            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Publicar Perfil
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        style={{ backgroundColor: P.secondary }}
                    >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {saveSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 text-sm flex items-center gap-2 text-left">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" /> ¡Perfil actualizado exitosamente en la base de datos!
                </div>
            )}

            {saveError && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 text-sm flex items-center gap-2 text-left">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {saveError}
                </div>
            )}
        </div>
    );
}

export default SubSectionHeaderAcciones;
