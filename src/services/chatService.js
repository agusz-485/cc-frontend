import api, { getMediaUrl } from "../api/client";

/**
 * Servicio REST API para la gestión de conversaciones y mensajería en CareConnect.
 */

// Fallback inicial con conversaciones demo realistas si el backend aún no tiene datos
const DEFAULT_DEMO_CHATS = [
  {
    id: 1,
    otherUserId: 1,
    name: "María González",
    role: "Enfermera Matriculada",
    fotoPerfil: null,
    image: null,
    phone: "+54 9 11 4059-8821",
    lastMessage: "Excelente! Prepararé una rutina personalizada para él. Estaré allí el lunes.",
    time: "09:33",
    unread: 0,
    messages: [
      { id: 101, sender: "other", text: "Buenos días! Le confirmo que estaré disponible los días acordados tal como coordinamos. ¿Tiene alguna indicación especial para los medicamentos?", time: "09:14" },
      { id: 102, sender: "user", text: "Buenos días María. Sí, la metformina debe tomarse con el desayuno y el ramipril por las noches.", time: "09:22" },
      { id: 103, sender: "other", text: "Perfecto, anotado. También quisiera saber si prefiere salir a pasear por las mañanas o por las tardes.", time: "09:25" },
      { id: 104, sender: "user", text: "Por las mañanas es mejor, después de desayunar. Le encanta el parque del barrio.", time: "09:31" },
      { id: 105, sender: "other", text: "Excelente! Prepararé una rutina personalizada para él. Estaré allí el lunes a las 8:30. Cuídense mucho 😊", time: "09:33" }
    ]
  }
];

export const getConversations = async (userId) => {
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const localKey = `careconnect_conversations_${currentUserId}`;

  try {
    const response = await api.get(`/conversaciones`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(c => ({
        id: c.id,
        otherUserId: c.destinatarioId || c.cuidadorId || c.familiarId,
        name: c.otroUsuarioNombre || c.cuidadorNombre || c.familiarNombre || "Contacto",
        fotoPerfil: getMediaUrl(c.otroUsuarioFoto || c.cuidadorFoto || c.familiarFoto),
        image: getMediaUrl(c.otroUsuarioFoto || c.cuidadorFoto || c.familiarFoto),
        phone: c.otroUsuarioTelefono || c.telefono || "",
        lastMessage: c.ultimoMensaje || "",
        time: c.fechaActualizacion ? new Date(c.fechaActualizacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Hoy",
        unread: c.mensajesNoLeidos || 0
      }));
    }
  } catch (error) {
    // Si el endpoint no está disponible en backend, usar almacenamiento local
    // console.warn("Backend chat endpoint offline. Usando almacenamiento local:", error);
  }

  // Fallback local
  try {
    const local = localStorage.getItem(localKey);
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem(localKey, JSON.stringify(DEFAULT_DEMO_CHATS));
    return DEFAULT_DEMO_CHATS;
  } catch {
    return DEFAULT_DEMO_CHATS;
  }
};

export const getMessages = async (conversationId, userId) => {
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const messagesKey = `careconnect_messages_${conversationId}`;

  try {
    const response = await api.get(`/conversaciones/${conversationId}/mensajes`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(m => ({
        id: m.id,
        sender: Number(m.remitenteId) === Number(currentUserId) ? "user" : "other",
        text: m.contenido,
        time: m.fechaEnvio ? new Date(m.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Hoy"
      }));
    }
  } catch (error) {
    // Fallback local
  }

  try {
    const savedMessages = localStorage.getItem(messagesKey);
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    const demoChat = DEFAULT_DEMO_CHATS.find(c => c.id === Number(conversationId));
    if (demoChat && demoChat.messages) {
      localStorage.setItem(messagesKey, JSON.stringify(demoChat.messages));
      return demoChat.messages;
    }
    return [];
  } catch {
    return [];
  }
};

export const sendMessage = async ({ conversationId, recipientId, text, userId }) => {
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const messagesKey = `careconnect_messages_${conversationId}`;
  const convKey = `careconnect_conversations_${currentUserId}`;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newMsg = {
    id: Date.now(),
    sender: "user",
    text: text.trim(),
    time: nowTime
  };

  try {
    await api.post(`/conversaciones/${conversationId}/mensajes`, {
      remitenteId: Number(currentUserId),
      destinatarioId: Number(recipientId),
      contenido: text.trim(),
    });
  } catch (error) {
    // console.warn("Mensaje guardado en modo local:", error);
  }

  // Guardar en localStorage
  try {
    const currentList = JSON.parse(localStorage.getItem(messagesKey) || "[]");
    const updatedList = [...currentList, newMsg];
    localStorage.setItem(messagesKey, JSON.stringify(updatedList));

    // Actualizar último mensaje en la lista de conversaciones
    const allConvs = JSON.parse(localStorage.getItem(convKey) || JSON.stringify(DEFAULT_DEMO_CHATS));
    const updatedConvs = allConvs.map(c => c.id === Number(conversationId) ? {
      ...c,
      lastMessage: text.trim(),
      time: nowTime
    } : c);
    localStorage.setItem(convKey, JSON.stringify(updatedConvs));
  } catch {}

  return newMsg;
};

export const startOrGetConversation = async ({ otherUserId, otherUserName, otherUserFoto, otherUserPhone, otherUserRole, userId }) => {
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const convKey = `careconnect_conversations_${currentUserId}`;

  try {
    const response = await api.post(`/conversaciones`, {
      familiarId: Number(currentUserId),
      cuidadorId: Number(otherUserId)
    });
    if (response.data && response.data.id) {
      return response.data;
    }
  } catch (error) {
    // Fallback local
  }

  // Buscar si ya existe localmente
  const allConvs = JSON.parse(localStorage.getItem(convKey) || JSON.stringify(DEFAULT_DEMO_CHATS));
  const existing = allConvs.find(c => Number(c.otherUserId) === Number(otherUserId));

  if (existing) {
    return existing;
  }

  const newConv = {
    id: Date.now(),
    otherUserId: Number(otherUserId),
    name: otherUserName || "Profesional de Cuidado",
    role: otherUserRole || "Cuidador Profesional",
    fotoPerfil: getMediaUrl(otherUserFoto),
    image: getMediaUrl(otherUserFoto),
    phone: otherUserPhone || "",
    lastMessage: "Conversación iniciada",
    time: "Ahora",
    unread: 0,
    messages: []
  };

  const updatedConvs = [newConv, ...allConvs];
  localStorage.setItem(convKey, JSON.stringify(updatedConvs));
  return newConv;
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  startOrGetConversation
};
