import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoCareConnect from "../../assets/logo_careconnect.png";
import { getMediaUrl } from "../../api/client";
import { P } from "../../shared";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const token = localStorage.getItem("token");
  const isUserLoggedIn = isAuthenticated || Boolean(token);

  const displayName = user?.nombre || localStorage.getItem("user_name") || "Mi Cuenta";
  const userFoto = user?.fotoPerfil || user?.foto || localStorage.getItem("user_foto") || localStorage.getItem("user_foto_perfil");

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Bloque con el Logo Oficial */}
        <Link 
          to="/directory" 
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
          aria-label="Ir al Marketplace de CareConnect"
        >
          <img 
            src={logoCareConnect} 
            alt="CareConnect" 
            className="h-9 sm:h-10 w-auto object-contain" 
          />
        </Link>

        {/* Acciones de Navegación */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isUserLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón Acceso Rápido al Dashboard */}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Panel</span>
              </button>

              {/* Botón Perfil con Texto Configuración */}
              <button
                type="button"
                onClick={() => navigate("/dashboard?tab=settings")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all hover:bg-slate-100 active:scale-95 border cursor-pointer shadow-2xs"
                style={{ 
                  backgroundColor: "#ffffff", 
                  borderColor: P.baseNeutral,
                  color: P.dark 
                }}
                title="Configuración de Perfil y Cuenta"
              >
                {/* Avatar o Icono de Perfil */}
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-100 border border-slate-200">
                  {userFoto ? (
                    <img
                      src={getMediaUrl(userFoto)}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <User className={`w-3.5 h-3.5 text-slate-600 ${userFoto ? "hidden" : ""}`} />
                </div>
                <span>Configuración</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-700 transition-colors px-2 py-1"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="px-4 sm:px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold transition-all hover:opacity-90 active:scale-95 shadow-xs"
                style={{ backgroundColor: P.primary }}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;