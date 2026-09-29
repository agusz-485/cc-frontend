import { MessageSquare } from "lucide-react";
import { P, StarRating } from "../../shared";

export function ProfileReviewsTab({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div
        className="p-8 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center"
        style={{ borderColor: P.baseNeutral }}
      >
        <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
        <p className="font-bold text-sm text-slate-700">Aún no hay reseñas</p>
        <p className="text-xs text-slate-400 mt-1">
          Las opiniones de las familias aparecerán aquí luego de completar los primeros servicios.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map(({ author, rating, date, text }, index) => (
        <div
          key={`${author}-${index}`}
          className="p-4 rounded-xl"
          style={{ border: `1px solid ${P.baseNeutral}` }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: P.secondary }}
              >
                {author?.[0] || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: P.dark }}>
                  {author}
                </p>
                <p className="text-xs" style={{ color: P.neutralDark }}>
                  {date}
                </p>
              </div>
            </div>
            <StarRating rating={rating} size="sm" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: P.dark }}>
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}
