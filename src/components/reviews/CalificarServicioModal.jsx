import { useState, useEffect } from "react";
import { X, Star, Loader2, CheckCircle2, AlertCircle, HeartHandshake, Sparkles } from "lucide-react";
import { P } from "../../shared";
import { createOrUpdateReview, getMyReviewForTurno } from "../../services/reviewService";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../../context/AuthContext";

const RATING_LABELS = {
  1: "1 estrella · Muy insatisfecho",
  2: "2 estrellas · Regular",
  3: "3 estrellas · Bueno",
  4: "4 estrellas · Muy bueno",
  5: "5 estrellas · ¡Excelente atención!",
};

export function CalificarServicioModal({ isOpen, onClose, booking, targetType = "cuidador", onReviewSubmitted }) {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("user_id");

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const turnoId = booking?.rawId || booking?.id;
  const targetName = targetType === "cuidador"
    ? (booking?.caregiver?.name || "Profesional de Cuidado")
    : (booking?.family || booking?.familiarNombre || "Familia Contratante");
  const targetPhoto = targetType === "cuidador"
    ? (booking?.caregiver?.image || booking?.caregiver?.fotoPerfil)
    : (booking?.familiarFoto);
  const targetRole = targetType === "cuidador"
    ? (booking?.serviceType || booking?.type || "Servicio de Cuidado")
    : `Paciente: ${booking?.patient || booking?.senior?.nombre || "Adulto Mayor"}`;

  useEffect(() => {
    if (!isOpen || !turnoId) return;

    let isMounted = true;
    const loadExistingReview = async () => {
      setLoadingInitial(true);
      setError("");
      setSuccess(false);
      try {
        const existing = await getMyReviewForTurno(turnoId, userId);
        if (isMounted && existing) {
          setIsEditing(true);
          setRating(existing.puntuacion || 5);
          setComentario(existing.comentario || "");
        } else {
          setIsEditing(false);
          setRating(5);
          setComentario("");
        }
      } catch (err) {
        console.warn("No se pudo cargar reseña previa:", err);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    loadExistingReview();

    return () => {
      isMounted = false;
    };
  }, [isOpen, turnoId, userId]);

  if (!isOpen || !booking) return null;

  const currentDisplayRating = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError("Por favor selecciona una puntuación obligatoria de 1 a 5 estrellas.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const saved = await createOrUpdateReview({
        turnoId,
        puntuacion: rating,
        comentario: comentario.trim(),
        autorId: userId,
      });

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(saved);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error("Error al guardar reseña:", err);
      setError("No se pudo enviar la calificación. Por favor intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loadingInitial ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
            <p className="text-xs font-semibold">Cargando detalles del servicio...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">¡Gracias por tu valoración!</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Tu reseña ayuda a mantener la confianza, transparencia y calidad en la comunidad de CareConnect.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Header / Info del evaluado */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <UserAvatar
                src={targetPhoto}
                name={targetName}
                size="md"
                shape="rounded-2xl"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                  Servicio Finalizado
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-tight mt-1 truncate">
                  Calificar a {targetName}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {targetRole} · {booking.datesText || booking.date || "Fecha acordada"}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Ya has evaluado este servicio. Puedes modificar tu puntuación o comentarios a continuación.</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Selector de Estrellas (Obligatorio) */}
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center text-center">
              <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Puntuación del servicio (Obligatorio)
              </label>

              <div className="flex items-center gap-2 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-115 active:scale-95 cursor-pointer focus:outline-none"
                    title={`${star} estrellas`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= currentDisplayRating
                          ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                          : "text-slate-200 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold text-amber-900 mt-1 min-h-[18px]">
                {RATING_LABELS[currentDisplayRating] || ""}
              </p>
            </div>

            {/* Comentario / Reseña (Opcional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Comentario o experiencia</span>
                <span className="text-[11px] font-normal text-slate-400">(Opcional)</span>
              </label>
              <textarea
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos cómo fue la atención, puntualidad, trato con el paciente o sugerencias... (opcional)"
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none resize-none leading-relaxed transition-colors"
                maxLength={600}
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 px-1">
                <span>Tu opinión será visible para ayudar a la comunidad</span>
                <span>{comentario.length} / 600</span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || !rating}
                className="flex-2 py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: P.primary }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando Reseña...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-white" />
                    <span>{isEditing ? "Actualizar Reseña" : "Publicar Calificación"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CalificarServicioModal;
