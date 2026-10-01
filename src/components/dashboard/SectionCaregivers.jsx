import { Star, Heart, Trash2, MapPin, Search } from "lucide-react";
import { P, formatARS } from "../../shared";
import { UserAvatar } from "../ui/UserAvatar";

export function SectionCaregivers({ navigate, savedCaregivers = [], onRemoveFavorite }) {
  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Mis Cuidadores Guardados
            </h1>
            <p className="text-sm mt-1" style={{ color: P.neutralDark }}>
              Acceso rápido a los profesionales que has guardado en favoritos
            </p>
          </div>
          {savedCaregivers.length > 0 && (
            <button
              onClick={() => navigate("/directory")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 cursor-pointer text-white"
              style={{ backgroundColor: P.primary }}
            >
              <Search className="w-3.5 h-3.5" />
              Buscar más cuidadores
            </button>
          )}
        </div>

        {savedCaregivers.length === 0 ? (
          <div
            className="bg-white rounded-3xl p-10 text-center border shadow-sm max-w-lg mx-auto my-8"
            style={{ borderColor: P.baseNeutral }}
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Aún no tienes cuidadores guardados
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Explora nuestro directorio y guarda a tus cuidadores de confianza haciendo clic en el corazón para encontrarlos fácilmente cuando los necesites.
            </p>
            <button
              onClick={() => navigate("/directory")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              style={{ backgroundColor: P.primary }}
            >
              <Search className="w-4 h-4" />
              Explorar Directorio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedCaregivers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ borderColor: P.baseNeutral }}
              >
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <UserAvatar
                      src={c.image}
                      name={c.name}
                      tipo={c.tipo}
                      size="lg"
                      shape="rounded-2xl"
                      className="w-16 h-16"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base truncate text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {c.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveFavorite?.(c)}
                          title="Quitar de favoritos"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0 ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800">{c.rating || 4.9}</span>
                          <span className="text-slate-400">({c.reviews || 0})</span>
                        </div>
                        {c.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{c.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  {c.specialties && c.specialties.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap my-3">
                      {c.specialties.slice(0, 3).map((s, idx) => {
                        const name = typeof s === "string" ? s : s.nombre || s;
                        return (
                          <span
                            key={`${name}-${idx}`}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100"
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Hourly Rate */}
                  {c.hourlyRate && (
                    <div className="text-xs font-semibold text-slate-600 mb-3">
                      Tarifa: <span className="font-bold" style={{ color: P.primary }}>{formatARS(c.hourlyRate)}/h</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: P.baseNeutral }}>
                  <button
                    onClick={() => navigate(`/cuidador/${c.id}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-slate-50 cursor-pointer"
                    style={{ borderColor: P.baseNeutral, color: P.dark }}
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={() => navigate(`/cuidador/${c.id}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
                    style={{ backgroundColor: P.primary }}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

