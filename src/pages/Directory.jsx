import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Filter, LayoutDashboard } from "lucide-react";
import { P, formatARS } from "../shared";
import { searchProfessionals } from "../services/searchService";
import { getFavoriteCaregivers, toggleFavoriteCaregiver } from "../services/favoritesService";
import { useAuth } from "../context/AuthContext";
import { FilterSidebar } from "../components/directory/FilterSidebar";
import { ProfessionalCard } from "../components/directory/ProfessionalCard";

export default function Directory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("user_id") || "current";

  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState(8000);
  const [minRating, setMinRating] = useState(0);
  const [careTypes, setCareTypes] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Todas las ubicaciones");
  const [professionals, setProfessionals] = useState([]);
  const [selectedType, setSelectedType] = useState("todos");
  const [favorites, setFavorites] = useState([]);

  const locationOptions = ["Todas las ubicaciones", "Palermo", "Belgrano", "Recoleta", "Almagro", "Caballito", "San Telmo", "Lanús", "Quilmes", "San Isidro"];
  const careTypeOptions = ["Alzheimer", "Parkinson", "Post-operatorio", "Rehabilitación", "Cuidados Paliativos", "Acompañamiento"];

  // Cargar cuidadores desde el servicio de la Célula 3
  useEffect(() => {
    const fetchList = async () => {
      const data = await searchProfessionals();
      setProfessionals(data);
    };
    fetchList();
  }, []);

  // Cargar favoritos del usuario
  useEffect(() => {
    setFavorites(getFavoriteCaregivers(userId));
  }, [userId]);

  const handleToggleFavorite = (caregiver) => {
    const updated = toggleFavoriteCaregiver(caregiver, userId);
    setFavorites(updated);
  };

  const filtered = professionals.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchesRating = c.rating >= minRating;
    const matchesPrice = c.hourlyRate <= priceMax;
    const matchesCare = careTypes.length === 0 || careTypes.some((ct) => c.specialties.includes(ct));
    const matchesLocation = selectedLocation === "Todas las ubicaciones" || c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = selectedType === "todos" || c.tipo === selectedType;
    return matchesSearch && matchesRating && matchesPrice && matchesCare && matchesLocation && matchesType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_asc") return a.hourlyRate - b.hourlyRate;
    if (sortBy === "price_desc") return b.hourlyRate - a.hourlyRate;
    return 0;
  });

  const activeFilterCount = careTypes.length + (minRating > 0 ? 1 : 0) + (priceMax < 8000 ? 1 : 0) + (selectedType !== "todos" ? 1 : 0);

  return (
    <div style={{ backgroundColor: "#f8fbfd", minHeight: "100vh" }}>
      {/* Top Search Bar */}
      <div className="sticky top-16 z-40 border-b bg-white" style={{ borderColor: P.baseNeutral }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-52 px-4 py-2.5 rounded-xl border bg-slate-50" style={{ borderColor: P.baseNeutral }}>
              <Search className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Buscar por nombre o ciudad..." 
                className="flex-1 bg-transparent text-sm outline-none text-slate-800" 
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-slate-50" style={{ borderColor: P.baseNeutral }}>
              <MapPin className="w-4 h-4 text-slate-400" />
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)} 
                className="bg-transparent text-sm outline-none cursor-pointer font-medium text-slate-700 bg-white"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-100" 
              style={{
                backgroundColor: showFilters ? P.primary : "#f0f4f6",
                color: showFilters ? "white" : P.dark,
                border: `1.5px solid ${showFilters ? P.primary : P.baseNeutral}`,
              }}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-amber-500 text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer border bg-white text-slate-700 font-bold" 
              style={{ borderColor: P.baseNeutral }}
            >
              <option value="rating">Mejor valorados</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>

            <button 
              onClick={() => navigate("/dashboard")} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 ml-auto bg-amber-500"
            >
              <LayoutDashboard className="w-4 h-4" />
              Volver al Panel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Filter Sidebar component */}
          {showFilters && (
            <FilterSidebar 
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              minRating={minRating}
              setMinRating={setMinRating}
              careTypes={careTypes}
              setCareTypes={setCareTypes}
              careTypeOptions={careTypeOptions}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          )}

          {/* Grid list of professionals */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-medium text-slate-500 text-left">
                <span className="font-extrabold text-slate-800">{sorted.length}</span> profesionales encontrados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map((caregiver) => (
                <ProfessionalCard 
                  key={caregiver.id} 
                  caregiver={caregiver} 
                  isFavorite={favorites.some((f) => Number(f.id) === Number(caregiver.id))}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={(c) => navigate(`/cuidador/${c.id}`)}
                />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed p-6" style={{ borderColor: P.baseNeutral }}>
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-700">No se encontraron profesionales</p>
                <p className="text-xs text-slate-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
