import { TrendingUp } from "lucide-react";
import { P, formatARS } from "../../shared";

export function SectionGanancias({ historicalEarnings = [], liquidations = [] }) {
    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold" style={{ color: P.dark }}>Mis Ganancias</h1>

                {/* Chart Box */}
                <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: P.baseNeutral }}>
                    <h3 className="font-bold text-sm mb-4" style={{ color: P.dark }}>Evolución mensual de ingresos</h3>
                    {historicalEarnings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-xl" style={{ borderColor: P.baseNeutral }}>
                            <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">No hay ganancias registradas en el periodo actual</p>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between h-48 pt-4">
                            {historicalEarnings.map(h => {
                                const percent = (h.amount / 160000) * 100;
                                return (
                                    <div key={h.month} className="flex flex-col items-center flex-1">
                                        <span className="text-[10px] font-bold mb-2" style={{ color: P.dark }}>{formatARS(h.amount)}</span>
                                        <div className="w-12 rounded-t-lg transition-all" style={{ height: `${percent}%`, backgroundColor: P.primary }} />
                                        <span className="text-xs mt-2" style={{ color: P.neutralDark }}>{h.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: P.baseNeutral }}>
                    <div className="p-4 border-b font-bold text-sm" style={{ color: P.dark, backgroundColor: P.neutralLight }}>Liquidaciones Recientes</div>
                    <div className="divide-y" style={{ divideColor: P.baseNeutral }}>
                        {liquidations.length === 0 ? (
                            <p className="text-xs italic py-8 text-center text-slate-500">No hay liquidaciones registradas</p>
                        ) : (
                            liquidations.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 text-xs font-semibold">
                                    <div>
                                        <p className="text-sm" style={{ color: P.dark }}>{item.desc}</p>
                                        <p style={{ color: P.neutralDark }}>{item.date} · ID: {item.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold" style={{ color: P.dark }}>{formatARS(item.amount)}</p>
                                        <span className="text-[10px] text-green-600 font-bold">{item.state}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
