import api from "../api/client";
import { CAREGIVERS } from "../shared";

export const searchProfessionals = async () => {
  try {
    const responseC = await api.get("/cuidadores");
    const caregivers = (responseC.data || []).map((c) => ({
      ...c,
      id: c.id || c.idCuidador,
      name: c.nombre || "Cuidador Profesional",
      rating: c.calificacionPromedio || 4.8,
      reviews: c.totalResenas || 10,
      hourlyRate: c.tarifaHora || 3000,
      dailyRate: c.tarifaDia || (c.tarifaHora ? c.tarifaHora * 8 : 24000),
      location: c.zonaPrincipal || "Argentina",
      specialties: c.especialidades || c.especialidadesIds || [],
      description: c.descripcion || "",
      verified: c.visible !== undefined ? c.visible : true,
      tipo: "cuidador",
      image:
        c.fotoUrl ||
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
    }));

    let nurses = [];
    try {
      const responseN = await api.get("/enfermeros");
      nurses = (responseN.data || []).map((n) => ({
        ...n,
        id: n.id || n.idEnfermero,
        name: n.nombre || "Enfermero Matriculado",
        rating: n.calificacionPromedio || 4.9,
        reviews: n.totalResenas || 15,
        hourlyRate: n.tarifaHora || 4500,
        dailyRate: n.tarifaDia || (n.tarifaHora ? n.tarifaHora * 8 : 36000),
        location: n.zonaPrincipal || "Argentina",
        specialties: n.especialidades || n.especialidadesIds || ["Enfermería"],
        description: n.descripcion || "",
        verified: n.visible !== undefined ? n.visible : true,
        tipo: "enfermero",
        image:
          n.fotoUrl ||
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60",
      }));
    } catch (e) {
      console.warn("No se pudieron obtener enfermeros desde la API:", e);
    }

    const merged = [...caregivers, ...nurses];
    if (merged.length > 0) {
      return merged;
    }
    return CAREGIVERS;
  } catch (err) {
    console.warn("Error al buscar profesionales. Usando fallback local:", err);
    return CAREGIVERS;
  }
};

/**
 * Obtiene el detalle de un profesional por ID consultando el backend,
 * el perfil local (ID 999) o la lista de cuidadores.
 */
export const getProfessionalById = async (id) => {
  const targetId = Number(id);

  // 1. Caso especial: Perfil local publicado desde el onboarding (id = 999)
  if (targetId === 999) {
    const saved = localStorage.getItem("caregiver_profile");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.visible) {
          return {
            id: 999,
            name:
              data.professionalType === "enfermero"
                ? "Tu Perfil (Enfermero Matriculado)"
                : "Tu Perfil Profesional (Publicado)",
            rating: 5.0,
            reviews: 0,
            hourlyRate: Number(data.price) || 4000,
            dailyRate: (Number(data.price) || 4000) * 8,
            location: data.mainZone || "Argentina",
            image:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
            specialties:
              data.professionalType === "enfermero"
                ? ["Enfermería Geriátrica"]
                : data.selectedSpecs || [],
            bio:
              data.bio ||
              "Profesional del cuidado dedicado y comprometido con la salud y bienestar de los adultos mayores.",
            experience: Number(data.experience) || 1,
            certifications:
              data.professionalType === "enfermero"
                ? [
                    {
                      title: "Matrícula Habilitada",
                      issuer: `Ministerio de Salud (N° ${data.matricula})`,
                      year: "Vigente",
                    },
                  ]
                : (data.certs || []).map((c) => ({
                    title: c.title,
                    issuer: c.issuer,
                    year: c.validUntil ? c.validUntil.split("-")[0] : "Vigente",
                  })),
            coverageZones: data.coverageZones || [],
            professionalType: data.professionalType || "cuidador",
            verified: true,
          };
        }
      } catch (e) {
        console.error("Error al leer caregiver_profile desde localStorage:", e);
      }
    }
  }

  // 2. Intentar buscar en API por ID directo en endpoint de cuidadores
  try {
    const res = await api.get(`/cuidadores/${targetId}`);
    if (res.data) {
      const c = res.data;
      return {
        id: c.id || c.idCuidador || targetId,
        name: c.nombre || c.nombreCompleto || "Cuidador Profesional",
        rating: c.calificacionPromedio || 4.8,
        reviews: c.totalResenas || 10,
        hourlyRate: c.tarifaHora || 3000,
        dailyRate: c.tarifaDia || (c.tarifaHora ? c.tarifaHora * 8 : 24000),
        location: c.zonaPrincipal || c.localidad || "Argentina",
        specialties: c.especialidades || c.especialidadesIds || [],
        bio: c.descripcion || c.bio || "Cuidador con amplia experiencia en asistencia integral.",
        experience: c.experienciaAnos || c.experiencia || 3,
        image:
          c.fotoUrl ||
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
        certifications: c.certificaciones || [],
        coverageZones: c.zonasCobertura || [],
        verified: c.visible !== undefined ? c.visible : true,
        tipo: "cuidador",
      };
    }
  } catch (err) {
    // Si no es cuidador, intentar endpoint de enfermeros
    try {
      const resN = await api.get(`/enfermeros/${targetId}`);
      if (resN.data) {
        const n = resN.data;
        return {
          id: n.id || n.idEnfermero || targetId,
          name: n.nombre || n.nombreCompleto || "Enfermero Matriculado",
          rating: n.calificacionPromedio || 4.9,
          reviews: n.totalResenas || 15,
          hourlyRate: n.tarifaHora || 4500,
          dailyRate: n.tarifaDia || (n.tarifaHora ? n.tarifaHora * 8 : 36000),
          location: n.zonaPrincipal || n.localidad || "Argentina",
          specialties: n.especialidades || n.especialidadesIds || ["Enfermería"],
          bio:
            n.descripcion ||
            n.bio ||
            "Enfermero matriculado con experiencia en atención clínica domiciliaria.",
          experience: n.experienciaAnos || n.experiencia || 5,
          image:
            n.fotoUrl ||
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60",
          certifications: n.certificaciones || [],
          coverageZones: n.zonasCobertura || [],
          verified: n.visible !== undefined ? n.visible : true,
          tipo: "enfermero",
        };
      }
    } catch (e) {
      // Continuar al fallback de búsqueda en lista
    }
  }

  // 3. Buscar en la lista general de profesionales
  try {
    const list = await searchProfessionals();
    const found = list.find((p) => Number(p.id) === targetId);
    if (found) {
      return {
        ...found,
        bio: found.description || found.bio || "Profesional del cuidado y atención personalizada.",
        dailyRate: found.dailyRate || found.hourlyRate * 8,
        experience: found.experience || 3,
        certifications: found.certifications || [],
      };
    }
  } catch (err) {
    console.warn("Error al buscar en lista general:", err);
  }

  // 4. Buscar coincidencia exacta en mock local (sin fallback ciego)
  const localMatch = CAREGIVERS.find((c) => Number(c.id) === targetId);
  if (localMatch) {
    return localMatch;
  }

  // 5. No encontrado
  return null;
};
