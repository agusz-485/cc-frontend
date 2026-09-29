import { P } from "../../shared";
import { ProfileCalendar } from "./ProfileCalendar";

export function ProfileBioTab({ caregiver, selectedDays, toggleDay, onOpenBookingModal }) {
  const quickDetails = [
    {
      label: "Disponibilidad",
      value: caregiver?.verified ? "Disponible para turnos" : "No disponible temporalmente",
    },
    {
      label: "Modalidad",
      value: "Atención Domiciliaria",
    },
    {
      label: "Experiencia comprobada",
      value: `${caregiver?.experience || 1} años de ejercicio`,
    },
    {
      label: "Zona principal de cobertura",
      value:
        caregiver?.coverageZones && caregiver.coverageZones.length > 0
          ? caregiver.coverageZones.join(", ")
          : caregiver?.location || "Argentina",
    },
  ];

  return (
    <div>
      <p className="text-sm leading-loose mb-5" style={{ color: P.dark }}>
        {caregiver?.bio ||
          "Profesional del cuidado dedicado y comprometido con la salud y el bienestar integral de los adultos mayores y sus familias."}
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickDetails.map(({ label, value }) => (
          <div
            key={label}
            className="p-3 rounded-xl"
            style={{ backgroundColor: P.neutralLight }}
          >
            <p className="text-xs font-medium mb-0.5" style={{ color: P.neutralDark }}>
              {label}
            </p>
            <p className="text-sm font-semibold" style={{ color: P.dark }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <ProfileCalendar
        caregiver={caregiver}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        onOpenBookingModal={onOpenBookingModal}
      />
    </div>
  );
}
