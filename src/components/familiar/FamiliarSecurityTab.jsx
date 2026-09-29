import { useState } from "react";
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, KeyRound, Smartphone } from "lucide-react";
import { P } from "../../shared";

export function FamiliarSecurityTab() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [passStatus, setPassStatus] = useState({ type: "", message: "" });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setPassStatus({ type: "", message: "" });

        if (!currentPass) {
            setPassStatus({ type: "error", message: "Ingresa tu contraseña actual." });
            return;
        }

        if (newPass.length < 6) {
            setPassStatus({ type: "error", message: "La nueva contraseña debe tener al menos 6 caracteres." });
            return;
        }

        if (newPass !== confirmPass) {
            setPassStatus({ type: "error", message: "Las contraseñas nuevas no coinciden." });
            return;
        }

        setPassStatus({ type: "success", message: "¡Contraseña actualizada correctamente!" });
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");

        setTimeout(() => {
            setPassStatus({ type: "", message: "" });
        }, 4000);
    };

    return (
        <div className="flex flex-col gap-4 text-left">
            {/* Estado de seguridad */}
            <div className="rounded-2xl p-5 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-800">Seguridad de la Cuenta</p>
                            <p className="text-xs text-slate-500">Cuenta de usuario familiar verificada</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Nivel Seguro ✓
                    </span>
                </div>
            </div>

            {/* Formulario de cambio de contraseña */}
            <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center gap-2 mb-4">
                    <KeyRound className="w-4 h-4" style={{ color: P.primary }} />
                    <p className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Actualizar Contraseña
                    </p>
                </div>

                {passStatus.message && (
                    <div
                        className={`mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                            passStatus.type === "success"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                        {passStatus.type === "success" ? (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span>{passStatus.message}</span>
                    </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3.5">
                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                            Contraseña actual
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                            style={{ borderColor: P.baseNeutral, color: P.dark }}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                                style={{ borderColor: P.baseNeutral, color: P.dark }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: P.neutralDark }}>
                                Confirmar nueva contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="Repite la nueva contraseña"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border bg-white focus:border-blue-500"
                                style={{ borderColor: P.baseNeutral, color: P.dark }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="self-start px-6 py-2.5 rounded-xl text-xs font-bold text-white mt-2 hover:opacity-90 active:scale-95 cursor-pointer shadow-sm transition-all"
                        style={{ backgroundColor: P.primary }}
                    >
                        Guardar nueva contraseña
                    </button>
                </form>
            </div>

            {/* Verificación en dos pasos (2FA) */}
            <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm" style={{ color: P.dark }}>
                                Verificación en dos pasos (2FA)
                            </p>
                            <p className="text-xs text-slate-500">
                                Agrega una capa extra de seguridad para proteger tu cuenta
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            is2FAEnabled
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                    >
                        {is2FAEnabled ? "Activada ✓" : "No activada"}
                    </span>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end" style={{ borderColor: P.baseNeutral }}>
                    <button
                        type="button"
                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                            is2FAEnabled ? "bg-slate-700 hover:bg-slate-800" : "hover:opacity-90"
                        }`}
                        style={{ backgroundColor: is2FAEnabled ? "#475569" : P.secondary }}
                    >
                        <Lock className="w-3.5 h-3.5" />
                        {is2FAEnabled ? "Desactivar 2FA" : "Activar 2FA"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FamiliarSecurityTab;
