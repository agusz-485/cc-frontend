import api from "../api/client";

const mapStatusToFrontend = (estadoTurno) => {
  switch (estadoTurno) {
    case "PENDIENTE":
    case "SOLICITADO":
      return "pending";
    case "CONFIRMADO":
    case "ACEPTADO":
    case "EN_CURSO":
      return "confirmed";
    case "FINALIZADO":
    case "COMPLETADO":
      return "completed";
    case "CANCELADO":
    case "RECHAZADO":
      return "cancelled";
    default:
      return estadoTurno || "pending";
  }
};

const mapStatusToBackend = (status) => {
  switch (status) {
    case "confirmed":
      return "CONFIRMADO";
    case "completed":
      return "FINALIZADO";
    case "cancelled":
      return "CANCELADO";
    case "pending":
    default:
      return "PENDIENTE";
  }
};

const mapTurnoToFrontend = (t) => ({
  id: `RES-${t.id}`,
  rawId: t.id,
  caregiver: {
    id: t.cuidadorId,
    name: t.cuidadorNombre || "Profesional de Cuidado",
    image:
      t.cuidadorFoto ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&auto=format",
    location: t.zonaPrincipal || "Buenos Aires",
    rating: t.calificacionPromedio || 4.9,
  },
  senior: {
    id: t.adultoMayorId,
    nombre: t.adultoMayorNombre || "Adulto Mayor",
  },
  serviceType: t.tipoServicio || t.tipoServicioNombre || "Cuidado de Adulto Mayor",
  type: t.descripcionServicio || "Cuidado Integral",
  shift:
    t.horaInicio && t.horaFin
      ? `${t.horaInicio.slice(0, 5)} - ${t.horaFin.slice(0, 5)}`
      : "Turno Completo",
  datesText: t.fecha || "Fecha acordada",
  dateStart: t.fecha || "",
  amount: t.precioTotal ? Number(t.precioTotal) : 0,
  status: mapStatusToFrontend(t.estadoTurno),
  createdAt: t.timestampInicio || t.createdAt || new Date().toISOString(),
});

export const getBookings = async (familiarId) => {
  const userId = familiarId || localStorage.getItem("user_id");
  if (!userId) return [];

  const numId = Number(userId);
  const url = !isNaN(numId) ? `/turnos?familiarId=${numId}` : `/turnos`;

  try {
    const response = await api.get(url);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapTurnoToFrontend);
    }
    return [];
  } catch (err) {
    console.error("Error al obtener turnos desde el servidor:", err);
    return [];
  }
};

export const createBooking = async (bookingPayload, familiarId) => {
  const userId = familiarId || localStorage.getItem("user_id") || "1";

  const requestBody = {
    familiarId: Number(userId),
    cuidadorId: Number(bookingPayload.caregiverId || bookingPayload.caregiver?.id || 1),
    adultoMayorId: Number(bookingPayload.seniorId || bookingPayload.senior?.id || 1),
    fecha:
      bookingPayload.fecha ||
      (bookingPayload.dates && bookingPayload.dates[0]
        ? `2026-07-${String(bookingPayload.dates[0]).padStart(2, "0")}`
        : new Date().toISOString().split("T")[0]),
    horaInicio: bookingPayload.horaInicio || "08:00:00",
    horaFin: bookingPayload.horaFin || "16:00:00",
    duracionMinutos: bookingPayload.duracionMinutos || 480,
    tipoServicioNombre: bookingPayload.serviceType || "Cuidado de Adulto Mayor",
    descripcionServicio: bookingPayload.notes || bookingPayload.type || "Cuidado Integral",
    precioTotal: bookingPayload.amount || 0,
  };

  const response = await api.post("/turnos", requestBody);
  return mapTurnoToFrontend(response.data);
};

export const updateBookingStatus = async (bookingId, newStatus, familiarId) => {
  const rawIdStr = String(bookingId).replace("RES-", "");
  const numericId = Number(rawIdStr);

  if (isNaN(numericId)) {
    throw new Error("ID de turno inválido");
  }

  await api.patch(`/turnos/${numericId}/estado`, {
    estado: mapStatusToBackend(newStatus),
  });

  return await getBookings(familiarId);
};
