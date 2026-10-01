import React from "react";
import { LogIn, UserPlus, ShieldAlert } from "lucide-react";
import { P } from "../../shared";

export function BookingAuthPrompt({ isProfessional, onLogin, onRegister, onSwitchAccount }) {
  if (isProfessional) {
    return (
      <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Cuenta Profesional detectada</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Estás conectado con una cuenta de Profesional. Para contratar cuidadores y programar turnos para adultos mayores, debes ingresar con una cuenta de tipo <strong>Familiar</strong>.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onSwitchAccount}
            className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Cerrar sesión e ingresar como Familiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50/50 text-slate-800 space-y-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-sm">
        <LogIn className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-900">
          Inicia sesión para solicitar esta reserva
        </h4>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
          Para garantizar la seguridad de ambas partes y asociar el servicio a tus adultos mayores, debes ingresar con tu cuenta de Familiar.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
        <button
          type="button"
          onClick={onLogin}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: P.primary }}
        >
          <LogIn className="w-4 h-4" />
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={onRegister}
          className="px-5 py-2.5 rounded-xl font-bold text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-slate-500" />
          Crear Cuenta Familiar
        </button>
      </div>
    </div>
  );
}

export default BookingAuthPrompt;
