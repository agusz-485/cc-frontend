import React from "react";
import { Calendar } from "lucide-react";
import { P } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";

export function BookingCaregiverCard({ caregiver, datesText, selectedDaysCount }) {
  if (!caregiver) return null;

  return (
    <div
      className="p-4 rounded-2xl flex items-center gap-4"
      style={{ backgroundColor: P.neutralLight, border: `1px solid ${P.baseNeutral}` }}
    >
      <UserAvatar
        src={caregiver.image}
        name={caregiver.name}
        tipo={caregiver.tipo}
        size="md"
        shape="rounded-2xl"
        className="w-14 h-14"
      />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
          {caregiver.tipo === "enfermero" ? "Enfermero Matriculado" : "Cuidador Profesional"}
        </span>
        <h3 className="font-bold text-base text-slate-800 truncate mt-0.5">{caregiver.name}</h3>
        <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: P.neutralDark }}>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{datesText}</span>
          <span>({selectedDaysCount} día{selectedDaysCount > 1 ? "s" : ""})</span>
        </div>
      </div>
    </div>
  );
}

export default BookingCaregiverCard;
