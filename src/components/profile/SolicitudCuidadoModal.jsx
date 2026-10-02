import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, User, Calendar, Clock, AlertCircle, Loader2, Sparkles, HeartHandshake } from "lucide-react";
import { P, formatARS } from "../../shared";
import { getAdultosMayores } from "../../services/adultoMayorService";
import { startOrGetConversation, sendMessage } from "../../services/chatService";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../../context/AuthContext";

export function SolicitudCuidadoModal({ isOpen, onClose, caregiver }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const userRole = (user?.rol || user?.role || localStorage.getItem("user_role") || "FAMILIAR").toUpperCase();

  const isAuthenticated = Boolean(token && userId);
  const isProfessional = isAuthenticated && (userRole === "CUIDADOR" || userRole === "ENFERMERO");

  const [seniors, setSeniors] = useState([]);
  const [loadingSeniors, setLoadingSeniors] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState("");
  const [frecuencia, setFrecuencia] = useState("Turno Diario / Regular");
  const [fechaTentativa, setFechaTentativa] = useState("");
  const [mensaje, setMensaje] = useState(
    `Hola ${caregiver?.name || ""}, me gustaría solicitar información y consultar tu disponibilidad para el cuidado de mi familiar. ¿Podrías indicarme tus horarios disponibles?`
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !isAuthenticated || isProfessional) return;

    let isMounted = true;
    const loadSeniors = async () => {
      setLoadingSeniors(true);
      setError("");
      try {
        const list = await getAdultosMayores(userId);
        if (isMounted) {
          setSeniors(list || []);
          if (list && list.length > 0) {
            setSelectedSeniorId(String(list[0].idAdultoMayor || list[0].id));
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar los adultos mayores:", err);
      } finally {
        if (isMounted) setLoadingSeniors(false);
      }
    };

    loadSeniors();

    return () => {
      isMounted = false;
    };
  }, [isOpen, isAuthenticated, isProfessional, userId]);

  if (!isOpen || !caregiver) return null;

  // 1. Caso: Usuario no autenticado
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-4 text-teal-700">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Inicia sesión para enviar tu solicitud
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Para contactar a <strong>{caregiver.name}</strong> y enviar una solicitud de cuidado personalizada necesitas acceder con tu cuenta de Familiar.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/login?redirect=/profile/${caregiver.id}`)}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm text-center shadow-sm hover:opacity-95 transition-opacity"
              style={{ backgroundColor: P.primary }}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 text-center transition-colors"
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Caso: Es un profesional navegando
  if (isProfessional) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 text-amber-700">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Cuenta Profesional</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Has iniciado sesión como profesional. Las solicitudes de cuidado están reservadas para usuarios familiares que buscan contratar servicios.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // 3. Caso: Familiar autenticado enviando solicitud
  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      setError("Por favor escribe un mensaje para la solicitud.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const selectedSenior = seniors.find((s) => String(s.idAdultoMayor || s.id) === String(selectedSeniorId));
      const seniorName = selectedSenior ? `${selectedSenior.nombre} ${selectedSenior.apellido || ""}`.trim() : "Familiar";

      // Formatear mensaje como Solicitud de Cuidado
      const fullRequestText = `📋 [SOLICITUD DE CUIDADO]\n` +
        `👤 Paciente a cargo: ${seniorName}\n` +
        `🗓️ Frecuencia: ${frecuencia}\n` +
        (fechaTentativa ? `📅 Fecha estimada: ${fechaTentativa}\n` : "") +
        `💬 Mensaje: ${mensaje.trim()}`;

      // Iniciar o recuperar la conversación en el backend
      const conv = await startOrGetConversation({
        otherUserId: Number(caregiver.id),
        otherUserName: caregiver.name || "Profesional de Cuidado",
        otherUserFoto: caregiver.image || caregiver.fotoPerfil || null,
        otherUserPhone: caregiver.phone || "",
        otherUserRole: caregiver.role || "Cuidador Profesional",
        userId,
      });

      // Enviar el mensaje inicial de solicitud
      if (conv && conv.id) {
        await sendMessage({
          conversationId: conv.id,
          recipientId: Number(caregiver.id),
          text: fullRequestText,
          userId,
        });
      }

      onClose();

      // Redirigir al panel de mensajes
      navigate(
        `/dashboard?tab=messages&with=${caregiver.id}&name=${encodeURIComponent(
          caregiver.name || "Profesional"
        )}&foto=${encodeURIComponent(caregiver.image || caregiver.fotoPerfil || "")}`
      );
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setError("No se pudo enviar la solicitud. Por favor intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <UserAvatar
            src={caregiver.image || caregiver.fotoPerfil}
            name={caregiver.name}
            size="md"
            shape="rounded-2xl"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                Solicitud Directa
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              Contactar a {caregiver.name}
            </h3>
            <p className="text-xs text-slate-500">
              {caregiver.role || "Profesional de Cuidado"} • {formatARS(caregiver.hourlyRate)}/hr
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSendRequest} className="space-y-4">
          {/* Selector de Adulto Mayor a cargo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-700" />
                Adulto Mayor para el cuidado
              </span>
              {loadingSeniors && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
            </label>
            {seniors.length > 0 ? (
              <select
                value={selectedSeniorId}
                onChange={(e) => setSelectedSeniorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none"
              >
                {seniors.map((s) => (
                  <option key={s.idAdultoMayor || s.id} value={s.idAdultoMayor || s.id}>
                    {s.nombre} {s.apellido || ""} {s.edad ? `(${s.edad} años)` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                Consulta general de cuidado familiar.
              </p>
            )}
          </div>

          {/* Frecuencia estimada y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                Frecuencia estimada
              </label>
              <select
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none"
              >
                <option value="Turno Diario / Regular">Turno Diario / Regular</option>
                <option value="Cuidado por Horas">Cuidado por Horas</option>
                <option value="Fines de Semana">Fines de Semana</option>
                <option value="Turno Nocturno">Turno Nocturno</option>
                <option value="A convenir">A convenir con profesional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                Fecha tentativa (opcional)
              </label>
              <input
                type="date"
                value={fechaTentativa}
                onChange={(e) => setFechaTentativa(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Mensaje de la solicitud */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mensaje y requerimientos especiales
            </label>
            <textarea
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Detalla qué tipo de atención o requerimientos necesita tu familiar..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending || !mensaje.trim()}
              className="flex-2 py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
              style={{ backgroundColor: P.primary }}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Solicitud...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitud de Cuidado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SolicitudCuidadoModal;
