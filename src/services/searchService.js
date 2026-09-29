import api from "../api/client";

/**
 * Busca todos los profesionales registrados (Cuidadores y Enfermeros) directamente de la base de datos.
 */
export const searchProfessionals = async () => {
  try {
    let caregivers = [];
    try {
      const responseC = await api.get("/cuidadores");
      caregivers = (responseC.data || []).map((c) => {
        const id = c.id || c.idCuidador;
        const nombreCompleto = `${c.nombre || ""} ${c.apellido || ""}`.trim() || "Cuidador Profesional";
        const rate = Number(c.precioHora) || Number(c.tarifaHora) || 3000;

        let localProfile = {};
        try {
          const stored = localStorage.getItem(`caregiver_profile_${id}`);
          if (stored) localProfile = JSON.parse(stored);
        } catch {}

        const specialties = (c.especialidades && c.especialidades.length > 0)
          ? c.especialidades
          : (localProfile.selectedSpecs || []);

        const coverageZones = (c.zonasCobertura && c.zonasCobertura.length > 0)
          ? c.zonasCobertura
          : (localProfile.coverageZones && localProfile.coverageZones.length > 0
              ? localProfile.coverageZones
              : (c.zonaPrincipal || localProfile.mainZone ? [c.zonaPrincipal || localProfile.mainZone] : []));

        return {
          ...c,
          id,
          name: nombreCompleto,
          rating: c.calificacionPromedio || 5.0,
          reviews: c.totalResenas || 0,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: c.zonaPrincipal || localProfile.mainZone || "Argentina",
          specialties: specialties,
          coverageZones: coverageZones,
          certifications: (c.certificaciones && c.certificaciones.length > 0) ? c.certificaciones : (localProfile.certs || []),
          description: c.descripcion || localProfile.bio || "",
          verified: c.disponible !== undefined ? c.disponible : (c.visible !== undefined ? c.visible : true),
          tipo: "cuidador",
          image:
            c.fotoPerfil ||
            c.fotoUrl ||
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
        };
      });
    } catch (e) {
      console.warn("No se pudieron obtener cuidadores desde la API:", e);
    }

    let nurses = [];
    try {
      const responseN = await api.get("/enfermeros");
      nurses = (responseN.data || []).map((n) => {
        const id = n.id || n.idEnfermero;
        const nombreCompleto = `${n.nombre || ""} ${n.apellido || ""}`.trim() || "Enfermero Matriculado";
        const rate = Number(n.precioHora) || Number(n.tarifaHora) || 4500;

        let localProfile = {};
        try {
          const stored = localStorage.getItem(`caregiver_profile_${id}`);
          if (stored) localProfile = JSON.parse(stored);
        } catch {}

        const coverageZones = (n.zonasCobertura && n.zonasCobertura.length > 0)
          ? n.zonasCobertura
          : (localProfile.coverageZones && localProfile.coverageZones.length > 0
              ? localProfile.coverageZones
              : (n.zonaPrincipal || localProfile.mainZone ? [n.zonaPrincipal || localProfile.mainZone] : ["Argentina"]));

        return {
          ...n,
          id,
          name: nombreCompleto,
          rating: n.calificacionPromedio || 5.0,
          reviews: n.totalResenas || 0,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: n.zonaPrincipal || localProfile.mainZone || "Argentina",
          matricula: n.matriculaProfesional || localProfile.matricula || "",
          specialties: ["Enfermería General", "Atención Clínica Domiciliaria"],
          coverageZones: coverageZones,
          certifications: (n.certificaciones && n.certificaciones.length > 0) ? n.certificaciones : (localProfile.certs || []),
          description: n.descripcion || localProfile.bio || "",
          verified: n.visible !== undefined ? n.visible : true,
          tipo: "enfermero",
          image:
            n.fotoPerfil ||
            n.fotoUrl ||
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60",
        };
      });
    } catch (e) {
      console.warn("No se pudieron obtener enfermeros desde la API:", e);
    }

    return [...caregivers, ...nurses];
  } catch (err) {
    console.error("Error al buscar profesionales en la base de datos:", err);
    return [];
  }
};

/**
 * Obtiene el detalle de un profesional por ID consultando el backend y complementando certificados/zonas locales si existen.
 */
export const getProfessionalById = async (id) => {
  const targetId = Number(id);
  if (!targetId || isNaN(targetId)) return null;

  let localProfile = {};
  try {
    const stored = localStorage.getItem(`caregiver_profile_${targetId}`);
    if (stored) localProfile = JSON.parse(stored);
  } catch {}

  // 1. Intentar buscar en endpoint de cuidadores
  try {
    const res = await api.get(`/cuidadores/${targetId}`);
    if (res.data) {
      const c = res.data;
      const rate = Number(c.precioHora) || Number(c.tarifaHora) || 3000;
      const nombreCompleto = `${c.nombre || ""} ${c.apellido || ""}`.trim() || "Cuidador Profesional";
      
      const mergedCerts = (c.certificaciones && c.certificaciones.length > 0)
        ? c.certificaciones
        : (localProfile.certs || []);

      const mergedZones = (c.zonasCobertura && c.zonasCobertura.length > 0)
        ? c.zonasCobertura
        : (localProfile.coverageZones && localProfile.coverageZones.length > 0
            ? localProfile.coverageZones
            : (c.zonaPrincipal || localProfile.mainZone ? [c.zonaPrincipal || localProfile.mainZone] : []));

      return {
        id: c.id || c.idCuidador || targetId,
        name: nombreCompleto,
        rating: c.calificacionPromedio || 5.0,
        reviews: c.totalResenas || 0,
        hourlyRate: rate,
        dailyRate: rate * 8,
        location: c.zonaPrincipal || localProfile.mainZone || c.localidad || "Argentina",
        specialties: (c.especialidades && c.especialidades.length > 0) ? c.especialidades : (localProfile.selectedSpecs || []),
        bio: c.descripcion || localProfile.bio || "Cuidador profesional con experiencia en asistencia y cuidado integral.",
        experience: c.aniosExperiencia || c.experienciaAnos || localProfile.experience || 3,
        image:
          c.fotoPerfil ||
          c.fotoUrl ||
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
        certifications: mergedCerts,
        coverageZones: mergedZones,
        verified: c.disponible !== undefined ? c.disponible : (c.visible !== undefined ? c.visible : true),
        tipo: "cuidador",
      };
    }
  } catch (err) {
    // Si no es cuidador, intentar endpoint de enfermeros
    try {
      const resN = await api.get(`/enfermeros/${targetId}`);
      if (resN.data) {
        const n = resN.data;
        const rate = Number(n.precioHora) || Number(n.tarifaHora) || 4500;
        const nombreCompleto = `${n.nombre || ""} ${n.apellido || ""}`.trim() || "Enfermero Matriculado";

        const mergedCerts = (n.certificaciones && n.certificaciones.length > 0)
          ? n.certificaciones
          : (localProfile.certs && localProfile.certs.length > 0
              ? localProfile.certs
              : (n.matriculaProfesional || localProfile.matricula
                  ? [
                      {
                        title: "Matrícula Profesional Habilitada",
                        issuer: `Matrícula: ${n.matriculaProfesional || localProfile.matricula}`,
                        year: "Vigente",
                      },
                    ]
                  : []));

        const mergedZones = (n.zonasCobertura && n.zonasCobertura.length > 0)
          ? n.zonasCobertura
          : (localProfile.coverageZones && localProfile.coverageZones.length > 0
              ? localProfile.coverageZones
              : (n.zonaPrincipal || localProfile.mainZone ? [n.zonaPrincipal || localProfile.mainZone] : ["Argentina"]));

        return {
          id: n.id || n.idEnfermero || targetId,
          name: nombreCompleto,
          rating: n.calificacionPromedio || 5.0,
          reviews: n.totalResenas || 0,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: n.zonaPrincipal || localProfile.mainZone || n.localidad || "Argentina",
          matricula: n.matriculaProfesional || localProfile.matricula || "",
          specialties: ["Enfermería General", "Atención Clínica Domiciliaria"],
          bio:
            n.descripcion ||
            localProfile.bio ||
            "Enfermero matriculado capacitado en cuidados clínicos, medicación y atención domiciliaria.",
          experience: n.aniosExperiencia || n.experienciaAnos || localProfile.experience || 3,
          image:
            n.fotoPerfil ||
            n.fotoUrl ||
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60",
          certifications: mergedCerts,
          coverageZones: mergedZones,
          verified: n.visible !== undefined ? n.visible : true,
          tipo: "enfermero",
        };
      }
    } catch (e) {
      console.warn(`No se encontró profesional con ID ${targetId} en cuidadores ni enfermeros:`, e);
    }
  }

  return null;
};

/**
 * Actualiza el perfil profesional de un Cuidador o Enfermero en la base de datos.
 */
export const updateProfessionalProfile = async (id, role, payload) => {
  const isEnfermero = role?.toUpperCase() === "ENFERMERO" || role === "enfermero";
  const endpoint = isEnfermero ? `/enfermeros/${id}` : `/cuidadores/${id}`;
  const res = await api.put(endpoint, payload);
  return res.data;
};

