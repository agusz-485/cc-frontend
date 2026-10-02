import { useState, useEffect } from "react";
import { MessageSquare, Star, User, Loader2 } from "lucide-react";
import { P, StarRating } from "../../shared";
import { getReviewsByCaregiver } from "../../services/reviewService";

export function ProfileReviewsTab({ reviews: initialReviews = [], caregiverId }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (caregiverId) {
      setLoading(true);
      getReviewsByCaregiver(caregiverId)
        .then((fetched) => {
          if (isMounted) {
            if (fetched && fetched.length > 0) {
              setReviews(fetched);
            } else if (initialReviews && initialReviews.length > 0) {
              setReviews(initialReviews);
            } else {
              setReviews([]);
            }
          }
        })
        .catch(() => {
          if (isMounted && initialReviews && initialReviews.length > 0) {
            setReviews(initialReviews);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews);
    }
    return () => {
      isMounted = false;
    };
  }, [caregiverId, initialReviews]);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mb-2" style={{ color: P.primary }} />
        <p className="text-xs text-slate-400 font-medium">Cargando reseñas...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div
        className="p-8 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center bg-slate-50/50"
        style={{ borderColor: P.baseNeutral }}
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="font-bold text-sm text-slate-700">Aún no hay reseñas verificadas</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Las opiniones y calificaciones de las familias aparecerán aquí luego de completar y abonar los servicios a través de la plataforma.
        </p>
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Review summary header */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-slate-800">{averageRating}</div>
          <div>
            <div className="flex items-center gap-1">
              <StarRating rating={Number(averageRating)} size="md" />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Basado en {reviews.length} {reviews.length === 1 ? "opinión" : "opiniones"} de clientes
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
          <span>✓</span> 100% Reseñas de servicios finalizados
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {reviews.map((rev, index) => {
          const author = rev.author || rev.autorNombre || "Familiar";
          const rating = rev.rating || rev.puntuacion || 5;
          const date = rev.date || rev.fecha || "Reciente";
          const text = rev.text || rev.comment || rev.comentario || "Servicio completado satisfactoriamente.";
          const authorFoto = rev.authorFoto || rev.foto;

          return (
            <div
              key={rev.id || `${author}-${index}`}
              className="p-4 rounded-xl bg-white transition-shadow hover:shadow-sm"
              style={{ border: `1px solid ${P.baseNeutral}` }}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  {authorFoto ? (
                    <img
                      src={authorFoto}
                      alt={author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: P.secondary }}
                    >
                      {author?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold" style={{ color: P.dark }}>
                      {author}
                    </p>
                    <p className="text-xs" style={{ color: P.neutralDark }}>
                      {date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <StarRating rating={rating} size="sm" />
                  <span className="text-[11px] font-bold text-amber-600 mt-1">{rating}.0 / 5.0</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 mt-1 pl-1">
                "{text}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

