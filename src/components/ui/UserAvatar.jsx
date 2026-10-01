import React, { useState } from "react";
import { User, Stethoscope, HeartHandshake } from "lucide-react";
import { P } from "../../shared";

export function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const clean = name.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Componente uniforme para mostrar fotos de perfil reales subidas por los usuarios.
 * Si el usuario no tiene foto o la URL falla, muestra un avatar con iniciales profesional.
 */
export function UserAvatar({
  src,
  name = "Usuario",
  alt,
  size = "md", // "xs" | "sm" | "md" | "lg" | "xl" | "card" | "full"
  shape = "rounded-2xl",
  tipo = "cuidador",
  className = "",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = getInitials(name);
  const isEnfermero = String(tipo || "").toLowerCase().includes("enfermer");

  const sizeClasses = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-28 h-28 text-2xl",
    card: "w-full h-44 text-2xl",
    full: "w-full h-full text-base",
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  const hasValidImage = Boolean(src && typeof src === "string" && src.trim().length > 0 && !imageFailed);

  if (hasValidImage) {
    return (
      <div className={`relative overflow-hidden flex-shrink-0 ${selectedSizeClass} ${shape} ${className}`} style={{ backgroundColor: "#eaf3f5" }}>
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Fallback con Iniciales y Estilo CareConnect
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden font-bold select-none flex-shrink-0 transition-all ${selectedSizeClass} ${shape} ${className}`}
      style={{
        backgroundColor: isEnfermero ? "#e0f2fe" : "#f0fdfa",
        color: isEnfermero ? "#0369a1" : "#0d9488",
        border: `1px solid ${isEnfermero ? "#bae6fd" : "#ccfbf1"}`,
      }}
      title={name}
    >
      {size === "card" ? (
        <div className="flex flex-col items-center justify-center gap-1.5 py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold shadow-sm"
            style={{
              backgroundColor: isEnfermero ? "#0284c7" : P.primary,
              color: "#ffffff",
            }}
          >
            {initials}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-1">
            {isEnfermero ? (
              <>
                <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                <span>Enfermero Matriculado</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                <span>Cuidador Profesional</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default UserAvatar;
