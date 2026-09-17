import { Shield, CheckCircle, Clock } from "lucide-react";
import { P, formatARS } from "../../shared";

const TRUST_FEATURES = [
  { icon: Shield, text: "Pago 100% seguro y protegido" },
  { icon: CheckCircle, text: "Identidad verificada por CareConnect" },
  { icon: Clock, text: "Confirmación en menos de 1 hora" },
];

export function ProfilePricingWidget({ caregiver }) {
  const dailyRate = caregiver.dailyRate || caregiver.hourlyRate * 8;

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div
        className="rounded-2xl p-5 sticky top-24"
        style={{
          backgroundColor: "white",
          border: `1px solid ${P.baseNeutral}`,
          boxShadow: "0 6px 28px rgba(0,0,0,0.09)",
        }}
      >
        {/* Rate display */}
        <div className="flex gap-3 mb-5">
          <div
            className="flex-1 p-3 rounded-xl text-center"
            style={{ backgroundColor: P.neutralLight }}
          >
            <p className="text-xs mb-0.5" style={{ color: P.neutralDark }}>
              Por hora
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Desde {formatARS(caregiver.hourlyRate)}
            </p>
            <p className="text-xs" style={{ color: P.neutralDark }}>
              ARS
            </p>
          </div>

          <div
            className="flex-1 p-3 rounded-xl text-center"
            style={{ backgroundColor: "#e8f4f8" }}
          >
            <p className="text-xs mb-0.5" style={{ color: P.primary }}>
              Por día
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: P.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Desde {formatARS(dailyRate)}
            </p>
            <p className="text-xs" style={{ color: P.primary }}>
              ARS
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {TRUST_FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: P.primary }} />
              <span className="text-xs" style={{ color: P.neutralDark }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
