import api, { getMediaUrl } from "../api/client";

/**
 * Servicio para la gestión de valoraciones, estrellas y reseñas de turnos en CareConnect.
 */

export const createOrUpdateReview = async ({ turnoId, puntuacion, comentario, autorId }) => {
  const currentUserId = autorId || localStorage.getItem("user_id");
  const rawTurnoId = typeof turnoId === "string" ? Number(turnoId.replace("RES-", "")) : Number(turnoId);

  const payload = {
    turnoId: rawTurnoId,
    autorId: currentUserId ? Number(currentUserId) : null,
    puntuacion: Number(puntuacion),
    comentario: comentario ? comentario.trim() : null,
  };

  const localKey = `careconnect_review_turno_${rawTurnoId}_${currentUserId}`;

  try {
    const response = await api.post("/resenias", payload);
    if (response.data) {
      localStorage.setItem(localKey, JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.warn("Backend /resenias offline o no disponible. Guardando localmente:", error);
  }

  // Fallback local
  const mockSaved = {
    id: Date.now(),
    turnoId: rawTurnoId,
    autorId: Number(currentUserId || 1),
    autorNombre: localStorage.getItem("user_name") || "Usuario",
    puntuacion: Number(puntuacion),
    comentario: comentario ? comentario.trim() : "",
    fechaCreacion: new Date().toISOString(),
  };
  localStorage.setItem(localKey, JSON.stringify(mockSaved));
  return mockSaved;
};

export const getMyReviewForTurno = async (turnoId, autorId) => {
  const currentUserId = autorId || localStorage.getItem("user_id");
  const rawTurnoId = typeof turnoId === "string" ? Number(turnoId.replace("RES-", "")) : Number(turnoId);
  const localKey = `careconnect_review_turno_${rawTurnoId}_${currentUserId}`;

  try {
    const response = await api.get(`/resenias/turno/${rawTurnoId}/mi-resenia${currentUserId ? `?autorId=${currentUserId}` : ""}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    // Fallback local
  }

  try {
    const saved = localStorage.getItem(localKey);
    if (saved) return JSON.parse(saved);
  } catch {}

  return null;
};

export const getReviewsByCaregiver = async (cuidadorId) => {
  const rawCuidadorId = Number(cuidadorId);
  try {
    const response = await api.get(`/resenias/cuidador/${rawCuidadorId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(r => ({
        id: r.id,
        author: r.autorNombre || "Familiar",
        authorFoto: getMediaUrl(r.autorFoto),
        rating: r.puntuacion || 5,
        comment: r.comentario || "Excelente atención y cuidado profesional.",
        date: r.fechaCreacion ? new Date(r.fechaCreacion).toLocaleDateString() : "Reciente",
      }));
    }
  } catch (error) {
    // console.warn("No se pudieron obtener reseñas del servidor:", error);
  }

  return [];
};

export default {
  createOrUpdateReview,
  getMyReviewForTurno,
  getReviewsByCaregiver,
};
