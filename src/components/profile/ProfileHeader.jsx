import { MapPin, CheckCircle, Heart } from "lucide-react";
import { P, StarRating, SpecialtyBadge } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";

export function ProfileHeader({ caregiver, isFavorite = false, onToggleFavorite }) {
  const specialties = caregiver?.specialties || [];
  const image = caregiver?.image || caregiver?.fotoPerfil || null;
  const location = caregiver?.location || "Argentina";
  const rating = caregiver?.rating ?? 4.8;
  const reviews = caregiver?.reviews ?? 0;
  const experience = caregiver?.experience ?? 3;

  return (
    <div
      className="rounded-2xl p-6 mb-5"
      style={{ backgroundColor: "white", border: `1px solid ${P.baseNeutral}` }}
    >
      <div className="flex items-start gap-5 flex-col sm:flex-row">
        <div className="relative flex-shrink-0">
          <UserAvatar
            src={image}
            name={caregiver?.name || "Profesional"}
            tipo={caregiver?.tipo}
            size="xl"
            shape="rounded-2xl"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {caregiver?.name || "Profesional"}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: P.neutralDark }} />
                <span className="text-sm" style={{ color: P.neutralDark }}>
                  {location},{" "}
                  <span className="blur-[3px] select-none">Av. Las Heras 2342, 4°A</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite?.(caregiver)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                isFavorite
                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"
                }`}
              />
              <span>{isFavorite ? "Guardado en Favoritos" : "Guardar en Favoritos"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StarRating rating={rating} size="md" />
            <span className="font-bold text-sm" style={{ color: P.dark }}>
              {rating}
            </span>
            <span className="text-sm" style={{ color: P.neutralDark }}>
              ({reviews} reseñas)
            </span>
            <span style={{ color: P.neutralDark }}>·</span>
            <span className="text-sm" style={{ color: P.neutralDark }}>
              {experience} años de experiencia
            </span>
          </div>

          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {specialties.map((s, idx) => (
                <SpecialtyBadge key={`${s}-${idx}`} label={typeof s === "string" ? s : s.nombre || s} />
              ))}
            </div>
          )}

          {/* Availability only — no phone/email */}
          <div className="flex flex-wrap gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
              <span className="text-xs" style={{ color: P.neutralDark }}>
                Disponible esta semana
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
