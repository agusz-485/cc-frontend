import { P, formatARS } from "../../shared";

export function BookingPriceBreakdown({ dailyRate, selectedDaysCount, totalBase, commission, totalFinal }) {
  return (
    <div
      className="p-4 rounded-2xl border space-y-2.5 bg-slate-50/50"
      style={{ borderColor: P.baseNeutral }}
    >
      <div className="flex justify-between text-xs text-slate-600">
        <span>
          Tarifa diaria base ({formatARS(dailyRate)} × {selectedDaysCount} días)
        </span>
        <span className="font-bold text-slate-800">{formatARS(totalBase)}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Comisión y seguro de servicio CareConnect (5%)</span>
        <span className="font-bold text-slate-800">{formatARS(Math.round(commission))}</span>
      </div>
      <hr style={{ borderColor: P.baseNeutral }} />
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-slate-800">Total a pagar estimado:</span>
        <span
          className="font-bold text-xl"
          style={{ color: P.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {formatARS(Math.round(totalFinal))}
        </span>
      </div>
    </div>
  );
}

export default BookingPriceBreakdown;
