import React, { useState, useEffect } from "react";
import { User, Stethoscope, HeartHandshake, Shield } from "lucide-react";
import { P } from "../../shared";
import { getMediaUrl } from "../../api/client";

export function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const clean = name.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Componente uniforme y resiliente para mostrar fotos de perfil reales subidas por los usuarios.
 * Si el usuario no tiene foto o la URL falla/404, muestra inmediatamente un avatar con iniciales profesional.
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
  const resolvedSrc = getMediaUrl(src);

  // Reiniciar estado de error cuando cambia la fuente o el usuario
  useEffect(() => {
    setImageFailed(false);
  }, [src, resolvedSrc]);

  const initials = getInitials(name);
  const tipoStr = String(tipo || "").toLowerCase();
  const isEnfermero = tipoStr.includes("enfermer");
  const isFamiliar = tipoStr.includes("familiar");
  const isAdmin = tipoStr.includes("admin");

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
  const hasValidImage = Boolean(resolvedSrc && resolvedSrc.length > 0 && !imageFailed);

  if (hasValidImage) {
    return (
      <div className={`relative overflow-hidden flex-shrink-0 ${selectedSizeClass} ${shape} ${className}`} style={{ backgroundColor: "#eaf3f5" }}>
        <img
          src={resolvedSrc}
          alt={alt || name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Fallback con Iniciales y Estilo CareConnect Curado
  const getThemeStyles = () => {
    if (isAdmin) {
      return {
        bg: "#0f172a",
        text: "#ffffff",
        badgeBg: "#f8fafc",
        badgeBorder: "#e2e8f0",
        badgeText: "#0f172a"
      };
    }
    if (isEnfermero) {
      return {
        bg: "#0284c7",
        text: "#ffffff",
        badgeBg: "#e0f2fe",
        badgeBorder: "#bae6fd",
        badgeText: "#0369a1"
      };
    }
    if (isFamiliar) {
      return {
        bg: "#6366f1",
        text: "#ffffff",
        badgeBg: "#eef2ff",
        badgeBorder: "#c7d2fe",
        badgeText: "#4338ca"
      };
    }
    return {
      bg: P?.primary || "#00A896",
      text: "#ffffff",
      badgeBg: "#f0fdfa",
      badgeBorder: "#ccfbf1",
      badgeText: "#0d9488"
    };
  };

  const theme = getThemeStyles();

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden font-bold select-none flex-shrink-0 transition-all ${selectedSizeClass} ${shape} ${className}`}
      style={{
        backgroundColor: theme.badgeBg,
        color: theme.badgeText,
        border: `1px solid ${theme.badgeBorder}`,
      }}
      title={name}
    >
      {size === "card" ? (
        <div className="flex flex-col items-center justify-center gap-1.5 py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold shadow-sm"
            style={{
              backgroundColor: theme.bg,
              color: theme.text,
            }}
          >
            {initials}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold mt-1" style={{ color: theme.badgeText }}>
            {isEnfermero ? (
              <>
                <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                <span>Enfermero Matriculado</span>
              </>
            ) : isFamiliar ? (
              <>
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Familiar Contratante</span>
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
        <span className="font-extrabold">{initials}</span>
      )}
    </div>
  );
}

export default UserAvatar;
