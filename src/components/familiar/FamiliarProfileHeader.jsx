import { useState, useRef } from "react";
import { Edit, User, Loader2, Camera } from "lucide-react";
import { P } from "../../shared";
import { uploadFile } from "../../services/uploadService";

export function FamiliarProfileHeader({ nombre, email, fotoPerfil, onFotoChange }) {
    const avatarInitial = (nombre ? nombre[0] : (email ? email[0] : "F")).toUpperCase();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen no debe superar los 5 MB.");
            return;
        }

        setUploading(true);
        try {
            const res = await uploadFile(file, "perfiles");
            if (onFotoChange) {
                onFotoChange(res.url);
            }
        } catch (err) {
            alert(err.message || "Error al subir la imagen de perfil.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: P.baseNeutral }}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {fotoPerfil ? (
                    <img
                        src={fotoPerfil}
                        alt={nombre || "Foto de perfil"}
                        className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-sm border"
                        style={{ borderColor: P.baseNeutral }}
                    />
                ) : (
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: P.secondary }}
                    >
                        {avatarInitial}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                </div>
            </div>

            <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800 text-base truncate">{nombre || "Familiar"}</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        Familiar / Contratante
                    </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{email || "sin-email@email.com"}</p>
            </div>

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                style={{ border: `1px solid ${P.baseNeutral}`, color: P.dark }}
            >
                {uploading ? (
                    <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...
                    </>
                ) : (
                    <>
                        <Edit className="w-3.5 h-3.5" /> Cambiar foto
                    </>
                )}
            </button>
        </div>
    );
}

export default FamiliarProfileHeader;
