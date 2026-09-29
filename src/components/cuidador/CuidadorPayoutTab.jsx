import { useState } from "react";
import { Building2, CheckCircle2, AlertCircle, Wallet, ArrowDownLeft, ShieldCheck } from "lucide-react";
import { P } from "../../shared";
import { useAuth } from "../../context/AuthContext";

export function CuidadorPayoutTab() {
    const { user } = useAuth();
    const userId = user?.id || localStorage.getItem("user_id") || "current";

    const [bankData, setBankData] = useState(() => {
        try {
            const saved = localStorage.getItem(`caregiver_bank_${userId}`);
            if (saved) return JSON.parse(saved);
        } catch {}
        return {
            banco: "Mercado Pago",
            tipoCuenta: "CVU - Billetera Virtual",
            cbuCvu: "",
            alias: "",
            titular: user?.nombre ? `${user.nombre} ${user.apellido || ""}`.trim() : "",
            cuit: "",
        };
    });

    const [isEditingBank, setIsEditingBank] = useState(false);
    const [bankSaveSuccess, setBankSaveSuccess] = useState(false);
    const [bankSaveError, setBankSaveError] = useState("");

    const handleSaveBank = (e) => {
        e.preventDefault();
        setBankSaveError("");

        const cleanCbu = bankData.cbuCvu.replace(/\s+/g, "");
        if (cleanCbu.length > 0 && cleanCbu.length !== 22) {
            setBankSaveError("El CBU/CVU debe tener exactamente 22 dígitos numéricos.");
            return;
        }

        if (!bankData.titular.trim()) {
            setBankSaveError("Ingresa el nombre del titular de la cuenta.");
            return;
        }

        localStorage.setItem(`caregiver_bank_${userId}`, JSON.stringify(bankData));
        setBankSaveSuccess(true);
        setIsEditingBank(false);
        setTimeout(() => setBankSaveSuccess(false), 3000);
    };

    const hasConfiguredBank = !!bankData.cbuCvu || !!bankData.alias;

    return (
        <div className="flex flex-col gap-5 text-left">
            {/* Banner explicativo */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                    <p className="text-sm font-bold text-teal-900">Datos Bancarios para Liquidaciones</p>
                    <p className="text-xs text-teal-700">Configura tu CBU, CVU o Alias bancario donde recibirás las transferencias directas de tus servicios completados.</p>
                </div>
            </div>

            {bankSaveSuccess && (
                <div className="p-4 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> ¡Datos bancarios guardados con éxito!
                </div>
            )}

            {/* Tarjeta de cuenta bancaria */}
            <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Cuenta de Cobro Registrada
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Destino oficial para acreditación de honorarios</p>
                    </div>
                    <button
                        onClick={() => setIsEditingBank(!isEditingBank)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border"
                        style={{ borderColor: P.primary, color: P.primary }}
                    >
                        {isEditingBank ? "Cancelar edición" : (hasConfiguredBank ? "Modificar cuenta" : "+ Configurar cuenta")}
                    </button>
                </div>

                {!isEditingBank && (
                    hasConfiguredBank ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                                    <Wallet className="w-6 h-6 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{bankData.banco} · {bankData.tipoCuenta}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        {bankData.cbuCvu ? `CBU/CVU: ${bankData.cbuCvu}` : `Alias: ${bankData.alias}`}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Titular: <span className="font-semibold text-slate-600">{bankData.titular}</span> {bankData.cuit ? `(CUIT: ${bankData.cuit})` : ""}
                                    </p>
                                </div>
                            </div>
                            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Activa para cobros
                            </span>
                        </div>
                    ) : (
                        <div className="py-8 text-center border border-dashed rounded-xl p-6" style={{ borderColor: P.baseNeutral }}>
                            <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-700">Aún no has registrado una cuenta bancaria</p>
                            <p className="text-xs text-slate-400 mt-1">Completa tus datos de CBU o Alias para recibir los pagos de las familias de forma automática.</p>
                            <button
                                onClick={() => setIsEditingBank(true)}
                                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer hover:opacity-90"
                                style={{ backgroundColor: P.primary }}
                            >
                                Cargar datos bancarios ahora
                            </button>
                        </div>
                    )
                )}

                {isEditingBank && (
                    <form onSubmit={handleSaveBank} className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: P.baseNeutral }}>
                        {bankSaveError && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-700 font-semibold text-xs flex items-center gap-2 border border-red-200">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {bankSaveError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">Banco o Entidad Financiera</label>
                                <select
                                    value={bankData.banco}
                                    onChange={e => setBankData({ ...bankData, banco: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none focus:border-teal-500 cursor-pointer"
                                    style={{ borderColor: P.baseNeutral }}
                                >
                                    <option value="Mercado Pago">Mercado Pago</option>
                                    <option value="Banco Santander">Banco Santander</option>
                                    <option value="BBVA Argentina">BBVA Argentina</option>
                                    <option value="Banco Galicia">Banco Galicia</option>
                                    <option value="Banco Nación">Banco Nación</option>
                                    <option value="Banco Provincia">Banco Provincia</option>
                                    <option value="Brubank">Brubank</option>
                                    <option value="Ualá">Ualá</option>
                                    <option value="Otro Banco / Fintech">Otro Banco / Fintech</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">Tipo de Cuenta</label>
                                <select
                                    value={bankData.tipoCuenta}
                                    onChange={e => setBankData({ ...bankData, tipoCuenta: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none focus:border-teal-500 cursor-pointer"
                                    style={{ borderColor: P.baseNeutral }}
                                >
                                    <option value="CVU - Billetera Virtual">CVU - Billetera Virtual</option>
                                    <option value="Caja de Ahorro en Pesos">Caja de Ahorro en Pesos</option>
                                    <option value="Cuenta Corriente">Cuenta Corriente</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">CBU / CVU (22 dígitos)</label>
                                <input
                                    type="text"
                                    maxLength={22}
                                    value={bankData.cbuCvu}
                                    onChange={e => setBankData({ ...bankData, cbuCvu: e.target.value.replace(/\D/g, "") })}
                                    placeholder="0000003100010000000000"
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none font-mono focus:border-teal-500"
                                    style={{ borderColor: P.baseNeutral }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">Alias CBU / CVU</label>
                                <input
                                    type="text"
                                    value={bankData.alias}
                                    onChange={e => setBankData({ ...bankData, alias: e.target.value.trim() })}
                                    placeholder="ej. enfermero.cuidado.mp"
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none focus:border-teal-500"
                                    style={{ borderColor: P.baseNeutral }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">Nombre completo del Titular</label>
                                <input
                                    type="text"
                                    value={bankData.titular}
                                    onChange={e => setBankData({ ...bankData, titular: e.target.value })}
                                    placeholder="Tal como figura en el banco"
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none focus:border-teal-500"
                                    style={{ borderColor: P.baseNeutral }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-600">CUIT / CUIL del Titular</label>
                                <input
                                    type="text"
                                    value={bankData.cuit}
                                    onChange={e => setBankData({ ...bankData, cuit: e.target.value })}
                                    placeholder="Ej. 20-38123456-7"
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white outline-none focus:border-teal-500"
                                    style={{ borderColor: P.baseNeutral }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsEditingBank(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold border hover:bg-slate-50 cursor-pointer"
                                style={{ borderColor: P.baseNeutral }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 cursor-pointer"
                                style={{ backgroundColor: P.primary }}
                            >
                                Guardar Datos de Cobro
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Resumen de Liquidaciones */}
            <div className="rounded-2xl p-6 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Historial de Transferencias Recibidas
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">Liquidación automática quincenal</span>
                </div>

                <div className="py-8 text-center border border-dashed rounded-xl p-6" style={{ borderColor: P.baseNeutral }}>
                    <ArrowDownLeft className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-700">Sin transferencias en este período</p>
                    <p className="text-xs text-slate-400 mt-1">Los pagos de turnos finalizados se acreditarán en tu cuenta bancaria registrada.</p>
                </div>
            </div>
        </div>
    );
}

export default CuidadorPayoutTab;
