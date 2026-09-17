import { Award, CheckCircle } from "lucide-react";
import { P } from "../../shared";

const DEFAULT_CERTIFICATIONS = [
  { title: "Grado en Enfermería", issuer: "Universidad Complutense de Madrid", year: "2013" },
  { title: "Especialidad en Enfermería Geriátrica", issuer: "Hospital Gregorio Marañón", year: "2015" },
  { title: "RCP Avanzado y DEA", issuer: "Cruz Roja Española", year: "2024" },
  { title: "Cuidados Paliativos Domiciliarios", issuer: "Sociedad Española de Geriatría", year: "2021" },
  { title: "Manejo de Enfermedades Neurodegenerativas", issuer: "CEAFA", year: "2022" },
];

export function ProfileCertificationsTab({ caregiver }) {
  const rawCerts = caregiver?.certifications;

  const certifications =
    rawCerts && rawCerts.length > 0
      ? rawCerts.map((c) => {
          if (typeof c === "string") {
            return {
              title: c,
              issuer: "Certificación Profesional Habilitada",
              year: "Vigente",
            };
          }
          return {
            title: c.title || "Certificación Oficial",
            issuer: c.issuer || "Entidad Habilitada",
            year: c.year || "Vigente",
          };
        })
      : DEFAULT_CERTIFICATIONS;

  return (
    <div className="flex flex-col gap-3">
      {certifications.map(({ title, issuer, year }, index) => (
        <div
          key={`${title}-${index}`}
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ border: `1px solid ${P.baseNeutral}` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: "#e8f4f8" }}
          >
            <Award className="w-5 h-5" style={{ color: P.primary }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: P.dark }}>
              {title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: P.neutralDark }}>
              {issuer} · {year}
            </p>
          </div>
          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#16a34a" }} />
        </div>
      ))}
    </div>
  );
}
