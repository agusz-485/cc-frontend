import { useNavigate } from "react-router-dom";
import { UserX, ChevronLeft, ArrowRight, LayoutDashboard } from "lucide-react";
import { P } from "../../shared";

export function ProfileNotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f8fbfd", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/directory")}
          className="flex items-center gap-1.5 mb-8 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: P.primary }}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al directorio
        </button>

        <div
          className="rounded-3xl p-10 text-center bg-white border shadow-sm max-w-lg mx-auto"
          style={{ borderColor: P.baseNeutral }}
        >
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <UserX className="w-10 h-10 text-red-500" />
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Perfil no encontrado
          </h2>

          <p className="text-sm leading-relaxed mb-8" style={{ color: P.neutralDark }}>
            No hemos podido encontrar los datos del profesional solicitado. Es posible que el
            perfil haya sido dado de baja o que el identificador ingresado no sea válido.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/directory")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: P.accent }}
            >
              Explorar Directorio
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-all hover:bg-slate-50 active:scale-95"
              style={{ borderColor: P.baseNeutral, color: P.dark }}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Ir al Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
