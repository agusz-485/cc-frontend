import { P } from "../../shared";
import { ProfileCalendar } from "./ProfileCalendar";

export function ProfileBioTab({ caregiver, selectedDays, toggleDay, onOpenBookingModal }) {
  const quickDetails = [
    {
      label: "Disponibilidad",
      value: caregiver?.id === 999 ? "Según agenda definida" : "Lunes a Sábado",
    },
    {
      label: "Modalidad",
      value: "Domicilio y Residencia",
    },
    {
      label: "Activa desde",
      value: caregiver?.id === 999 ? "Reciente" : "Enero 2012",
    },
    {
      label: "Zona de cobertura",
      value:
        caregiver?.id === 999
          ? caregiver.coverageZones && caregiver.coverageZones.length > 0
            ? caregiver.coverageZones.join(", ")
            : caregiver.location
          : caregiver?.location || "Buenos Aires, Argentina",
    },
  ];

  return (
    <div>
      <p className="text-sm leading-loose mb-5" style={{ color: P.dark }}>
        {caregiver?.bio ||
          "Profesional del cuidado dedicado y comprometido con la salud y el bienestar integral de los adultos mayores y sus familias."}
      </p>

      {caregiver?.id !== 999 && (
        <p className="text-sm leading-loose" style={{ color: P.dark }}>
          Mi metodología se basa en la comunicación constante con las familias y el
          respeto absoluto a la dignidad y autonomía de cada persona. Formada en técnicas
          de estimulación cognitiva y manejo de conductas difíciles en pacientes con demencia.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
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
