const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const formatDatesText = (dates) => {
  if (!dates || dates.length === 0) return "Fecha acordada";
  const parsed = dates.map((dStr) => {
    const str = String(dStr);
    const date = new Date(str.includes("T") ? str : `${str}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  }).filter(Boolean);

  if (parsed.length === 0) return `${dates.join(", ")}`;
  if (parsed.length === 1) return `${parsed[0].getDate()} de ${MONTH_NAMES[parsed[0].getMonth()]} ${parsed[0].getFullYear()}`;
  const sameMonth = parsed.every((p) => p.getMonth() === parsed[0].getMonth() && p.getFullYear() === parsed[0].getFullYear());
  if (sameMonth) return `${parsed.map((p) => p.getDate()).join(", ")} de ${MONTH_NAMES[parsed[0].getMonth()]} ${parsed[0].getFullYear()}`;
  return parsed.map((p) => `${p.getDate()} de ${MONTH_NAMES[p.getMonth()]}`).join(", ");
};

export const getShiftTimes = (shift) => {
  const s = String(shift || "");
  if (s.includes("4hs")) return { horaInicio: "08:00:00", horaFin: "12:00:00", duracionMinutos: 240 };
  if (s.includes("12hs")) return { horaInicio: "20:00:00", horaFin: "08:00:00", duracionMinutos: 720 };
  if (s.includes("24hs")) return { horaInicio: "08:00:00", horaFin: "08:00:00", duracionMinutos: 1440 };
  return { horaInicio: "08:00:00", horaFin: "16:00:00", duracionMinutos: 480 };
};
