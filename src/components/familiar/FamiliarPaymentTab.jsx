import { useState } from "react";
import { Plus, CreditCard, Trash2 } from "lucide-react";
import { P } from "../../shared";
import { useAuth } from "../../context/AuthContext";

export function FamiliarPaymentTab() {
    const { user } = useAuth();
    const userId = user?.id || localStorage.getItem("user_id") || "current";

    const [paymentMethods, setPaymentMethods] = useState(() => {
        try {
            const saved = localStorage.getItem(`familiar_cards_${userId}`);
            if (saved) return JSON.parse(saved);
        } catch {}
        return [];
    });

    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({
        type: "Visa Crédito",
        number: "",
        expiry: "",
        titular: "",
    });

    const handleAddCard = (e) => {
        e.preventDefault();
        if (!newCard.number || newCard.number.length < 15) return;
        const last4 = newCard.number.slice(-4);
        const cardObj = {
            id: Date.now(),
            type: newCard.type,
            last4,
            expiry: newCard.expiry || "12/28",
            titular: newCard.titular || "Titular",
            primary: paymentMethods.length === 0,
        };
        const updated = [...paymentMethods, cardObj];
        setPaymentMethods(updated);
        localStorage.setItem(`familiar_cards_${userId}`, JSON.stringify(updated));
        setIsAddingCard(false);
        setNewCard({ type: "Visa Crédito", number: "", expiry: "", titular: "" });
    };

    const handleRemoveCard = (id) => {
        const updated = paymentMethods.filter(c => c.id !== id);
        setPaymentMethods(updated);
        localStorage.setItem(`familiar_cards_${userId}`, JSON.stringify(updated));
    };

    return (
        <div className="flex flex-col gap-4 text-left">
            <div className="rounded-2xl p-5 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-sm" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Métodos de pago para contratación
                    </p>
                    <button
                        onClick={() => setIsAddingCard(!isAddingCard)}
                        className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 cursor-pointer"
                        style={{ color: P.primary }}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {isAddingCard ? "Cancelar" : "Agregar tarjeta"}
                    </button>
                </div>

                {isAddingCard && (
                    <form onSubmit={handleAddCard} className="mb-5 p-4 rounded-xl border bg-slate-50 space-y-3" style={{ borderColor: P.baseNeutral }}>
                        <p className="text-xs font-bold text-slate-700">Nueva Tarjeta de Crédito / Débito</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tipo de Tarjeta</label>
                                <select
                                    value={newCard.type}
                                    onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white outline-none"
                                >
                                    <option value="Visa Crédito">Visa Crédito</option>
                                    <option value="Mastercard Crédito">Mastercard Crédito</option>
                                    <option value="Visa Débito">Visa Débito</option>
                                    <option value="Mastercard Débito">Mastercard Débito</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Número de Tarjeta</label>
                                <input
                                    type="text"
                                    placeholder="•••• •••• •••• ••••"
                                    value={newCard.number}
                                    onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nombre en la tarjeta</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del titular"
                                    value={newCard.titular}
                                    onChange={e => setNewCard({ ...newCard, titular: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Vencimiento (MM/AA)</label>
                                <input
                                    type="text"
                                    placeholder="12/28"
                                    value={newCard.expiry}
                                    onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddingCard(false)}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                                style={{ backgroundColor: P.primary }}
                            >
                                Guardar Tarjeta
                            </button>
                        </div>
                    </form>
                )}

                {paymentMethods.length === 0 && !isAddingCard ? (
                    <div className="py-6 text-center border border-dashed rounded-xl" style={{ borderColor: P.baseNeutral }}>
                        <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                        <p className="text-xs font-semibold text-slate-600">No hay métodos de pago registrados</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Agrega una tarjeta para agilizar la contratación de cuidadores y enfermeros.</p>
                    </div>
                ) : (
                    paymentMethods.map(({ id, type, last4, expiry, primary }) => (
                        <div key={id || last4} className="flex items-center gap-4 p-4 rounded-xl mb-3 border bg-white" style={{ borderColor: primary ? P.primary : P.baseNeutral, backgroundColor: primary ? "#e8f4f8" : "white" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: P.secondary }}>
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: P.dark }}>{type} •••• {last4}</p>
                                <p className="text-xs" style={{ color: P.neutralDark }}>Vence {expiry}</p>
                            </div>
                            {primary && <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: P.primary, color: "white" }}>Principal</span>}
                            <button onClick={() => handleRemoveCard(id)} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer" style={{ color: P.neutralDark }}>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="rounded-2xl p-5 bg-white border" style={{ borderColor: P.baseNeutral }}>
                <p className="font-bold text-sm mb-4" style={{ color: P.dark }}>Historial de pagos de servicios</p>
                <div className="py-6 text-center border border-dashed rounded-xl" style={{ borderColor: P.baseNeutral }}>
                    <p className="text-xs italic text-slate-500">No hay transacciones registradas en este período</p>
                </div>
            </div>
        </div>
    );
}

export default FamiliarPaymentTab;
