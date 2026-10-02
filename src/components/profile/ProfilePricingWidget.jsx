import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Clock, Send, MessageSquarePlus } from "lucide-react";
import { P, formatARS } from "../../shared";
import { SolicitudCuidadoModal } from "./SolicitudCuidadoModal";

const TRUST_FEATURES = [
  { icon: Shield, text: "Pago 100% seguro y protegido" },
  { icon: CheckCircle, text: "Identidad verificada por CareConnect" },
  { icon: Clock, text: "Confirmación en menos de 1 hora" },
];

export function ProfilePricingWidget({ caregiver, onOpenSolicitudModal }) {
  const [isSolicitudModalOpen, setIsSolicitudModalOpen] = useState(false);
  const dailyRate = caregiver.dailyRate || caregiver.hourlyRate * 8;

  const handleOpenModal = () => {
    if (onOpenSolicitudModal) {
      onOpenSolicitudModal();
    } else {
      setIsSolicitudModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-full lg:w-80 flex-shrink-0">
        <div
          className="rounded-2xl p-5 sticky top-24"
          style={{
            backgroundColor: "white",
            border: `1px solid ${P.baseNeutral}`,
            boxShadow: "0 6px 28px rgba(0,0,0,0.09)",
          }}
        >
          {/* Tarifas */}
          <div className="flex gap-3 mb-4">
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

          {/* Botón Enviar Solicitud / Iniciar Consulta */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer mb-4"
            style={{ backgroundColor: P.primary }}
            title="Enviar solicitud de cuidado o consulta a este profesional"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Solicitud de Cuidado</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
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

      {/* Modal de Solicitud de Cuidado */}
      <SolicitudCuidadoModal
        isOpen={isSolicitudModalOpen}
        onClose={() => setIsSolicitudModalOpen(false)}
        caregiver={caregiver}
      />
    </>
  );
}

export default ProfilePricingWidget;
