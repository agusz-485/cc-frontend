import { Award, CheckCircle, ShieldAlert, FileCheck, ExternalLink } from "lucide-react";
import { P } from "../../shared";

export function ProfileCertificationsTab({ caregiver }) {
  const rawCerts = caregiver?.certifications || [];

  const certifications = rawCerts.map((c) => {
    if (typeof c === "string") {
      return {
        title: c,
        issuer: "Certificación Registrada",
        year: "Vigente",
        docUrl: null,
      };
    }
    return {
      title: c.title || "Certificación Oficial",
      issuer: c.issuer || "Entidad Habilitante",
      year: c.year || c.validUntil || "Vigente",
      docUrl: c.fileUrl || c.archivoUrl || c.documentoUrl || null,
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
      {certifications.map(({ title, issuer, year, docUrl }, index) => (
        <div
          key={`${title}-${index}`}
          className="flex items-start gap-3 p-4 rounded-xl text-left bg-white"
          style={{ border: `1px solid ${P.baseNeutral}` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: "#e8f4f8" }}
          >
            <Award className="w-5 h-5" style={{ color: P.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: P.dark }}>
              {title}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: P.neutralDark }}>
              {issuer} · {year}
            </p>
            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-1.5"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                Ver comprobante adjunto <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#16a34a" }} />
        </div>
      ))}
    </div>
  );
}

export default ProfileCertificationsTab;

