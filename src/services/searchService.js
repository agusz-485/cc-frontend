import api, { getMediaUrl } from "../api/client";

export const encodeScheduleInDescription = (bio, schedule) => {
  const cleanBio = (bio || "").replace(/<!--\s*SCHEDULE_DATA:[\s\S]*?-->/g, "").trim();
  if (!schedule) return cleanBio;
  return `${cleanBio}\n\n<!-- SCHEDULE_DATA:${JSON.stringify(schedule)} -->`;
};

export const decodeScheduleFromDescription = (description) => {
  if (!description || typeof description !== "string") return { bio: "", schedule: null };
  const match = description.match(/<!--\s*SCHEDULE_DATA:([\s\S]*?)-->/);
  const cleanBio = description.replace(/<!--\s*SCHEDULE_DATA:[\s\S]*?-->/g, "").trim();
  if (match && match[1]) {
    try {
      return { bio: cleanBio, schedule: JSON.parse(match[1]) };
    } catch {}
  }
  return { bio: cleanBio, schedule: null };
};

export const saveCaregiverSchedule = async (userId, schedule, role) => {
  try {
    localStorage.setItem(`caregiver_schedule_${userId}`, JSON.stringify(schedule));
    localStorage.setItem("caregiver_schedule", JSON.stringify(schedule));
    if (!userId || userId === "current") return;
    const isEnf = role?.toLowerCase()?.includes("enfermero");
    const endpoint = isEnf ? `/enfermeros/${userId}` : `/cuidadores/${userId}`;
    const cur = await api.get(endpoint).catch(() => null);
    if (cur?.data) {
      const updatedDesc = encodeScheduleInDescription(cur.data.descripcion || "", schedule);
      await api.put(endpoint, { descripcion: updatedDesc }).catch(() => null);
    }
  } catch (e) {
    console.warn("No se pudo persistir la agenda en el backend:", e);
  }
};

export const searchProfessionals = async () => {
  try {
    let caregivers = [];
    try {
      const responseC = await api.get("/cuidadores");
      caregivers = (responseC.data || []).map((c) => {
        const id = c.id || c.idCuidador;
        const nombreCompleto = `${c.nombre || ""} ${c.apellido || ""}`.trim() || "Cuidador Profesional";
        const rate = Number(c.precioHora) || Number(c.tarifaHora) || 3000;
        const { bio: cleanBio } = decodeScheduleFromDescription(c.descripcion);
        const totalReviews = Number(c.totalResenas !== undefined ? c.totalResenas : (c.totalResenias !== undefined ? c.totalResenias : (c.reviews || 0)));
        const avgRating = Number(c.calificacionPromedio !== undefined ? c.calificacionPromedio : (c.rating || 5.0));

        return {
          ...c,
          id,
          name: nombreCompleto,
          rating: avgRating,
          reviews: totalReviews,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: c.zonaPrincipal || "Argentina",
          specialties: c.especialidades || [],
          coverageZones: c.zonasCobertura || [],
          certifications: c.certificaciones || [],
          description: cleanBio,
          verified: c.disponible !== undefined ? c.disponible : true,
          tipo: "cuidador",
          image: getMediaUrl(c.fotoPerfil),
        };
      });
    } catch (e) {}

    let nurses = [];
    try {
      const responseN = await api.get("/enfermeros");
      nurses = (responseN.data || []).map((n) => {
        const id = n.id || n.idEnfermero;
        const nombreCompleto = `${n.nombre || ""} ${n.apellido || ""}`.trim() || "Enfermero Matriculado";
        const rate = Number(n.precioHora) || Number(n.tarifaHora) || 4500;
        const { bio: cleanBio } = decodeScheduleFromDescription(n.descripcion);
        const totalReviews = Number(n.totalResenas !== undefined ? n.totalResenas : (n.totalResenias !== undefined ? n.totalResenias : (n.reviews || 0)));
        const avgRating = Number(n.calificacionPromedio !== undefined ? n.calificacionPromedio : (n.rating || 5.0));

        return {
          ...n,
          id,
          name: nombreCompleto,
          rating: avgRating,
          reviews: totalReviews,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: n.zonaPrincipal || "Argentina",
          matricula: n.matriculaProfesional || "",
          specialties: ["Enfermería General", "Atención Clínica Domiciliaria"],
          coverageZones: n.zonasCobertura || [],
          certifications: n.certificaciones || [],
          description: cleanBio,
          verified: n.visible !== undefined ? n.visible : true,
          tipo: "enfermero",
          image: getMediaUrl(n.fotoPerfil),
        };
      });
    } catch (e) {}

    const allPros = [...caregivers, ...nurses];

    // Enriquecer en paralelo con métricas en vivo de reseñas
    const enriched = await Promise.all(
      allPros.map(async (p) => {
        try {
          const metRes = await api.get(`/resenias/cuidador/${p.id}/metricas`);
          if (metRes?.data) {
            const count = Number(metRes.data.totalResenias ?? metRes.data.totalResenas ?? 0);
            const score = (count > 0 && metRes.data.promedio !== undefined) ? Number(metRes.data.promedio) : (p.rating || 5.0);
            return {
              ...p,
              reviews: count,
              rating: score,
            };
          }
        } catch {}
        return p;
      })
    );

    return enriched;
  } catch (err) {
    return [];
  }
};

export const getProfessionalById = async (id) => {
  const targetId = Number(id);
  if (!targetId || isNaN(targetId)) return null;

  let localProfile = {};
  try {
    const stored = localStorage.getItem(`caregiver_profile_${targetId}`);
    if (stored) localProfile = JSON.parse(stored);
  } catch {}

  let localSchedule = null;
  try {
    const s = localStorage.getItem(`caregiver_schedule_${targetId}`) || localStorage.getItem("caregiver_schedule");
    if (s) localSchedule = JSON.parse(s);
  } catch {}

  let bookedSlots = [];
  try {
    const resTurnos = await api.get(`/turnos?cuidadorId=${targetId}`);
    if (resTurnos?.data && Array.isArray(resTurnos.data)) {
      bookedSlots = resTurnos.data
        .filter((t) => t.estadoTurno !== "CANCELADO" && t.estadoTurno !== "RECHAZADO")
        .map((t) => ({
          id: `turno-${t.id}`,
          date: t.fecha ? String(t.fecha) : "",
          desde: t.horaInicio ? t.horaInicio.slice(0, 5) : "08:00",
          hasta: t.horaFin ? t.horaFin.slice(0, 5) : "16:00",
          motivo: `Reserva programada (${t.tipoServicio || "Servicio"})`,
        }))
        .filter((s) => s.date);
    }
  } catch {}

  let metrics = null;
  try {
    const metRes = await api.get(`/resenias/cuidador/${targetId}/metricas`);
    if (metRes?.data) {
      metrics = metRes.data;
    }
  } catch {}

  const mergeSchedule = (baseSched) => {
    const s = baseSched || { blockedWeekDays: [], blockedDates: [], blockedWeeklySlots: {}, blockedDateSlots: [] };
    const dateSlots = [...(Array.isArray(s.blockedDateSlots) ? s.blockedDateSlots : []), ...bookedSlots];
    return { ...s, blockedDateSlots: dateSlots };
  };

  try {
    const res = await api.get(`/cuidadores/${targetId}`);
    if (res.data) {
      const c = res.data;
      const rate = Number(c.precioHora) || 3000;
      const { bio: cleanBio, schedule: backendSched } = decodeScheduleFromDescription(c.descripcion);
      const activeSched = mergeSchedule(backendSched || localSchedule);
      const mergedCerts = (c.certificaciones && c.certificaciones.length > 0) ? c.certificaciones : (localProfile.certs || []);
      const mergedZones = (c.zonasCobertura && c.zonasCobertura.length > 0) ? c.zonasCobertura : (localProfile.coverageZones || [c.zonaPrincipal || "Argentina"]);

      const backendReviews = Number(c.totalResenas !== undefined ? c.totalResenas : (c.totalResenias !== undefined ? c.totalResenias : (c.reviews || 0)));
      const finalReviews = metrics
        ? Number(metrics.totalResenias ?? metrics.totalResenas ?? 0)
        : backendReviews;
      const finalRating = (finalReviews > 0 && metrics?.promedio !== undefined)
        ? Number(metrics.promedio)
        : (c.calificacionPromedio !== undefined ? Number(c.calificacionPromedio) : (c.rating || 5.0));

      return {
        id: c.id || targetId,
        name: `${c.nombre || ""} ${c.apellido || ""}`.trim() || "Cuidador Profesional",
        rating: finalRating,
        reviews: finalReviews,
        hourlyRate: rate,
        dailyRate: rate * 8,
        location: c.zonaPrincipal || "Argentina",
        specialties: c.especialidades || [],
        bio: cleanBio || "Cuidador profesional con experiencia en asistencia y cuidado integral.",
        experience: c.aniosExperiencia || 3,
        image: getMediaUrl(c.fotoPerfil),
        coverageZones: mergedZones,
        certifications: mergedCerts,
        schedule: activeSched,
        verified: c.disponible !== undefined ? c.disponible : true,
        tipo: "cuidador",
      };
    }
  } catch (err) {
    try {
      const resN = await api.get(`/enfermeros/${targetId}`);
      if (resN.data) {
        const n = resN.data;
        const rate = Number(n.precioHora) || 4500;
        const { bio: cleanBio, schedule: backendSched } = decodeScheduleFromDescription(n.descripcion);
        const activeSched = mergeSchedule(backendSched || localSchedule);
        const mergedCerts = (n.certificaciones && n.certificaciones.length > 0) ? n.certificaciones : (localProfile.certs || []);
        const mergedZones = (n.zonasCobertura && n.zonasCobertura.length > 0) ? n.zonasCobertura : (localProfile.coverageZones || [n.zonaPrincipal || "Argentina"]);

        const backendReviewsN = Number(n.totalResenas !== undefined ? n.totalResenas : (n.totalResenias !== undefined ? n.totalResenias : (n.reviews || 0)));
        const finalReviewsN = metrics
          ? Number(metrics.totalResenias ?? metrics.totalResenas ?? 0)
          : backendReviewsN;
        const finalRatingN = (finalReviewsN > 0 && metrics?.promedio !== undefined)
          ? Number(metrics.promedio)
          : (n.calificacionPromedio !== undefined ? Number(n.calificacionPromedio) : (n.rating || 5.0));

        return {
          id: n.id || targetId,
          name: `${n.nombre || ""} ${n.apellido || ""}`.trim() || "Enfermero Matriculado",
          rating: finalRatingN,
          reviews: finalReviewsN,
          hourlyRate: rate,
          dailyRate: rate * 8,
          location: n.zonaPrincipal || "Argentina",
          matricula: n.matriculaProfesional || "",
          specialties: ["Enfermería General", "Atención Clínica Domiciliaria"],
          bio: cleanBio || "Enfermero matriculado capacitado en atención clínica.",
          experience: n.aniosExperiencia || 3,
          image: getMediaUrl(n.fotoPerfil),
          coverageZones: mergedZones,
          certifications: mergedCerts,
          schedule: activeSched,
          verified: n.visible !== undefined ? n.visible : true,
          tipo: "enfermero",
        };
      }
    } catch (e) {}
  }
  return null;
};

export const updateProfessionalProfile = async (id, role, payload) => {
  const isEnfermero = role?.toUpperCase() === "ENFERMERO" || role === "enfermero";
  const endpoint = isEnfermero ? `/enfermeros/${id}` : `/cuidadores/${id}`;
  const res = await api.put(endpoint, payload);
  return res.data;
};
