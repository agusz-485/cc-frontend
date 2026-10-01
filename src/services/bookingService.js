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
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "confirmed":
    case "confirmado":
    case "accepted":
    case "aceptado":
      return "CONFIRMADO";
    case "completed":
    case "completado":
    case "finalizado":
      return "FINALIZADO";
    case "cancelled":
    case "cancelado":
    case "rejected":
    case "rechazado":
      return "CANCELADO";
    case "in_progress":
    case "en_curso":
      return "EN_CURSO";
    case "pending":
    case "pendiente":
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
    image: t.cuidadorFoto || t.cuidadorFotoPerfil || null,
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

export const mapTurnoToCaregiverRequest = (t) => ({
  id: t.id,
  bookingId: `RES-${t.id}`,
  family: t.familiarNombre || "Familia Contratante",
  familiarId: t.familiarId,
  familiarFoto: t.familiarFoto || t.familiarFotoPerfil || null,
  patient: t.adultoMayorNombre || "Adulto Mayor",
  adultoMayorId: t.adultoMayorId,
  date: t.fecha ? String(t.fecha) : "Fecha acordada",
  hours: t.horaInicio && t.horaFin ? `${t.horaInicio.slice(0, 5)} a ${t.horaFin.slice(0, 5)}` : "Turno programado",
  notes: t.descripcionServicio || t.tipoServicio || "",
  serviceType: t.tipoServicio || t.tipoServicioNombre || "Cuidado de Adulto Mayor",
  amount: t.precioTotal ? Number(t.precioTotal) : 0,
  status: mapStatusToFrontend(t.estadoTurno),
  phone: t.familiarTelefono || "+54 9 11 4059-8821",
  address: t.direccion || "Domicilio del Paciente",
  createdAt: t.timestampInicio || t.createdAt || new Date().toISOString(),
});

export const getCaregiverRequests = async (cuidadorId) => {
  const userId = cuidadorId || localStorage.getItem("user_id");
  if (!userId) return [];

  const numId = Number(userId);
  const url = !isNaN(numId) ? `/turnos?cuidadorId=${numId}` : `/turnos`;

  try {
    const response = await api.get(url);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapTurnoToCaregiverRequest);
    }
    return [];
  } catch (err) {
    console.error("Error al obtener solicitudes del cuidador:", err);
    return [];
  }
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

  return familiarId ? await getBookings(familiarId) : true;
};
