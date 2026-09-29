import { Award, CheckCircle, ShieldAlert } from "lucide-react";
import { P } from "../../shared";

export function ProfileCertificationsTab({ caregiver }) {
  const rawCerts = caregiver?.certifications || [];

  const certifications = rawCerts.map((c) => {
    if (typeof c === "string") {
      return {
        title: c,
        issuer: "Certificación Registrada",
        year: "Vigente",
      };
    }
    return {
      title: c.title || "Certificación Oficial",
      issuer: c.issuer || "Entidad Habilitante",
      year: c.year || "Vigente",
    };
  });

  if (certifications.length === 0) {
    return (
      <div
        className="p-8 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center"
        style={{ borderColor: P.baseNeutral }}
      >
        <ShieldAlert className="w-10 h-10 mb-2 text-slate-300" />
        <p className="font-bold text-sm text-slate-700">Sin certificaciones adicionales</p>
        <p className="text-xs text-slate-400 mt-1">
          {caregiver?.tipo === "enfermero"
            ? "El profesional cuenta con su matrícula profesional validada."
            : "Este profesional aún no ha registrado certificados o diplomas complementarios."}
        </p>
      </div>
    );
  }

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
