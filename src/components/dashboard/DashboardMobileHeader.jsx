import React from "react";
import { Menu } from "lucide-react";
import { P } from "../../shared";
import logoCareConnect from "../../assets/logo_careconnect.png";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../../context/AuthContext";

export function DashboardMobileHeader({ 
  onOpenMenu, 
  title = "Dashboard", 
  badgeCount = 0, 
  userFoto, 
  userName, 
  role = "familiar",
  navigate 
}) {
  const { user } = useAuth();

  const displayName = userName || user?.nombre || "Usuario";
  const foto = user?.fotoPerfil || user?.foto || userFoto || "";

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs flex-shrink-0">
      {/* Botón Hamburguesa con indicador de notificaciones */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="relative p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-6 h-6" />
          {badgeCount > 0 && (
            <span 
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse"
              style={{ backgroundColor: P.accent }}
            />
          )}
        </button>

        {/* Logo pequeño de CareConnect */}
        <button
          type="button"
          onClick={() => navigate ? navigate("/directory") : null}
          className="flex items-center focus:outline-none cursor-pointer"
          aria-label="Ir al inicio"
        >
          <img
            src={logoCareConnect}
            alt="CareConnect"
            className="h-7 w-auto object-contain"
          />
        </button>
      </div>

      {/* Título de la Sección Activa y Perfil */}
      <div className="flex items-center gap-2">
        <div className="text-right max-w-[120px] sm:max-w-[180px]">
          <span 
            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold truncate tracking-wide uppercase"
            style={{ 
              backgroundColor: "rgba(11, 75, 89, 0.08)", 
              color: P.primary 
            }}
          >
            {title}
          </span>
        </div>

        {/* Mini Avatar de Usuario */}
        <UserAvatar
          src={foto}
          name={displayName}
          tipo={role}
          size="xs"
          shape="rounded-full"
          className="w-8 h-8 border border-slate-200 shadow-2xs flex-shrink-0"
        />
      </div>
    </header>
  );
}

export default DashboardMobileHeader;