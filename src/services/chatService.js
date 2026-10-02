import api, { getMediaUrl } from "../api/client";

/**
 * Servicio REST API para la gestión de conversaciones y mensajería en CareConnect.
 */

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
        role: c.otroUsuarioRol || "Contacto",
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
  }

  // Fallback local (filtrando cualquier demo previa)
  try {
    const local = localStorage.getItem(localKey);
    if (local) {
      const parsed = JSON.parse(local);
      const filtered = Array.isArray(parsed) ? parsed.filter(c => c.name !== "María González" && c.id !== 1) : [];
      return filtered;
    }
    return [];
  } catch {
    return [];
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
    // Fallback local si el backend no responde
  }

  // Guardar en localStorage
  try {
    const currentList = JSON.parse(localStorage.getItem(messagesKey) || "[]");
    const updatedList = [...currentList, newMsg];
    localStorage.setItem(messagesKey, JSON.stringify(updatedList));

    // Actualizar último mensaje en la lista de conversaciones
    const allConvs = JSON.parse(localStorage.getItem(convKey) || "[]");
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
      return {
        id: response.data.id,
        otherUserId: response.data.destinatarioId || response.data.cuidadorId || response.data.familiarId || otherUserId,
        name: response.data.otroUsuarioNombre || response.data.cuidadorNombre || response.data.familiarNombre || otherUserName || "Contacto",
        role: response.data.otroUsuarioRol || otherUserRole || "Contacto",
        fotoPerfil: getMediaUrl(response.data.otroUsuarioFoto || response.data.cuidadorFoto || response.data.familiarFoto || otherUserFoto),
        image: getMediaUrl(response.data.otroUsuarioFoto || response.data.cuidadorFoto || response.data.familiarFoto || otherUserFoto),
        phone: response.data.otroUsuarioTelefono || otherUserPhone || "",
        lastMessage: response.data.ultimoMensaje || "Conversación iniciada",
        time: "Ahora",
        unread: 0
      };
    }
  } catch (error) {
    // Fallback local
  }

  // Buscar si ya existe localmente
  const allConvs = JSON.parse(localStorage.getItem(convKey) || "[]");
  const existing = allConvs.find(c => Number(c.otherUserId) === Number(otherUserId));

  if (existing) {
    return existing;
  }

  const newConv = {
    id: Date.now(),
    otherUserId: Number(otherUserId),
    name: otherUserName || "Contacto",
    role: otherUserRole || "Contacto",
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
