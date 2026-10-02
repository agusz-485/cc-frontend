import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { P } from "../../shared";
import { uploadFile } from "../../services/uploadService";
import { getMediaUrl } from "../../api/client";

export function ImageUploadInput({
  value,
  onChange,
  folder = "general",
  label = "Subir archivo",
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxSizeMB = 5,
  isDocument = false,
  className = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera el tamaño máximo permitido de ${maxSizeMB} MB.`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const result = await uploadFile(file, folder);
      onChange(result.url, file.name);
    } catch (err) {
      setError(err.message || "Error al subir el archivo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("", "");
  };

  const isPdf = typeof value === "string" && value.toLowerCase().endsWith(".pdf");

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: P.neutralDark }}>
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div
          className="relative flex items-center justify-between p-3 rounded-xl border bg-slate-50 text-left transition-all"
          style={{ borderColor: P.baseNeutral }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {isPdf ? (
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-rose-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border flex items-center justify-center bg-slate-100" style={{ borderColor: P.baseNeutral }}>
                <img
                  src={getMediaUrl(value)}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.classList.add("bg-teal-50");
                  }}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {isPdf ? "Documento PDF Adjunto" : "Archivo cargado"}
              </p>
              <a
                href={getMediaUrl(value)}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:underline truncate block"
              >
                Ver archivo completo ↗
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
              style={{ borderColor: P.baseNeutral }}
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
              title="Eliminar archivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed rounded-xl p-3.5 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer disabled:opacity-60"
          style={{ borderColor: P.baseNeutral }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              <span className="text-xs font-semibold text-sky-700">Subiendo archivo al servidor...</span>
            </>
          ) : (
            <>
              {isDocument ? <FileText className="w-4 h-4 text-slate-400" /> : <Upload className="w-4 h-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-700">Seleccionar imagen o PDF</span>
              <span className="text-[10px] text-slate-400">(máx. {maxSizeMB}MB)</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export default ImageUploadInput;
