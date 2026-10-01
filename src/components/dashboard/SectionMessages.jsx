import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MessageSquare, Phone, Send, Loader2, CheckCheck, Clock } from "lucide-react";
import { P } from "../../shared";
import { getMediaUrl } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { getConversations, getMessages, sendMessage, startOrGetConversation } from "../../services/chatService";
import { UserAvatar } from "../ui/UserAvatar";

export function SectionMessages() {
    const [searchParams] = useSearchParams();
    const targetCaregiverId = searchParams.get("with");
    const targetCaregiverName = searchParams.get("name");
    const targetCaregiverFoto = searchParams.get("foto");

    const { user } = useAuth();
    const userId = user?.id || localStorage.getItem("user_id") || "current";

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const chatRef = useRef(null);

    // 1. Cargar lista de conversaciones
    const loadChats = async () => {
        try {
            const list = await getConversations(userId);
            setChats(list);

            // Si se especificó un usuario objetivo en la URL, seleccionarlo o crearlo
            if (targetCaregiverId) {
                const existing = list.find(c => Number(c.otherUserId) === Number(targetCaregiverId));
                if (existing) {
                    setSelectedChatId(existing.id);
                } else {
                    const newChat = await startOrGetConversation({
                        otherUserId: Number(targetCaregiverId),
                        otherUserName: targetCaregiverName || "Profesional de Cuidado",
                        otherUserFoto: targetCaregiverFoto || null,
                        userId
                    });
                    setChats(prev => [newChat, ...prev.filter(c => c.id !== newChat.id)]);
                    setSelectedChatId(newChat.id);
                }
            } else if (!selectedChatId && list.length > 0) {
                setSelectedChatId(list[0].id);
            }
        } catch (err) {
            console.error("Error al cargar chats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChats();
    }, [userId, targetCaregiverId]);

    // 2. Cargar mensajes del chat activo y Polling cada 4 segundos
    const loadCurrentMessages = async (chatId) => {
        if (!chatId) return;
        try {
            const msgs = await getMessages(chatId, userId);
            setMessagesByChat(prev => ({
                ...prev,
                [chatId]: msgs
            }));
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
    };

    useEffect(() => {
        if (!selectedChatId) return;
        loadCurrentMessages(selectedChatId);

        // Polling para simular recepción en tiempo real
        const interval = setInterval(() => {
            loadCurrentMessages(selectedChatId);
        }, 4000);

        return () => clearInterval(interval);
    }, [selectedChatId, userId]);

    const activeChat = chats.find(c => c.id === selectedChatId);
    const currentMessages = selectedChatId ? (messagesByChat[selectedChatId] || []) : [];

    // 3. Enviar mensaje
    const handleSend = async () => {
        if (!text.trim() || !selectedChatId || sending) return;

        const messageText = text.trim();
        setText("");
        setSending(true);

        try {
            const newMsg = await sendMessage({
                conversationId: selectedChatId,
                recipientId: activeChat?.otherUserId,
                text: messageText,
                userId
            });

            setMessagesByChat(prev => ({
                ...prev,
                [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
            }));

            // Actualizar vista previa en lista de chats
            setChats(prev => prev.map(c => c.id === selectedChatId ? {
                ...c,
                lastMessage: messageText,
                time: newMsg.time
            } : c));
        } catch (err) {
            console.error("Error al enviar mensaje:", err);
        } finally {
            setSending(false);
        }
    };

    // Auto-scroll hacia abajo
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [currentMessages, selectedChatId]);

    const filteredChats = chats.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex overflow-hidden bg-slate-50">
            {/* Sidebar de Chats */}
            <div className="w-80 border-r flex flex-col bg-white flex-shrink-0" style={{ borderColor: P.baseNeutral }}>
                <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: P.baseNeutral }}>
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar conversación..." 
                        className="text-sm outline-none w-full bg-transparent text-slate-800" 
                    />
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                            <p className="text-xs font-semibold">Cargando conversaciones...</p>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">Sin conversaciones</p>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                                {searchQuery ? "No se encontraron resultados" : "Tus mensajes activos aparecerán aquí."}
                            </p>
                        </div>
                    ) : (
                        filteredChats.map(c => {
                            const isSelected = selectedChatId === c.id;
                            return (
                                <div 
                                    key={c.id} 
                                    onClick={() => setSelectedChatId(c.id)} 
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                                        isSelected ? "bg-teal-50/80 border-l-4 border-teal-600" : "hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <UserAvatar
                                            src={c.fotoPerfil || c.image}
                                            name={c.name}
                                            size="sm"
                                            shape="rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <p className="text-sm font-bold truncate text-slate-800">{c.name}</p>
                                            <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{c.time}</span>
                                        </div>
                                        <p className="text-xs truncate text-slate-500">{c.lastMessage || "Conversación iniciada"}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Área Principal de Mensajes */}
            {!activeChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                    <div className="max-w-md w-full bg-white p-8 rounded-3xl border shadow-sm flex flex-col items-center" style={{ borderColor: P.baseNeutral }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-teal-50 text-teal-700">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Selecciona una conversación</h3>
                        <p className="text-xs mt-2 leading-relaxed text-slate-500 max-w-sm">
                            Elige una conversación de la lista lateral o contacta a un cuidador desde el directorio para coordinar cuidados y resolver consultas.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/40">
                    {/* Header del Chat Activo */}
                    <div className="px-6 py-3.5 border-b flex items-center justify-between bg-white shadow-2xs" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex items-center gap-3">
                            <UserAvatar
                                src={activeChat.fotoPerfil || activeChat.image}
                                name={activeChat.name}
                                size="sm"
                                shape="rounded-full"
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-900">{activeChat.name}</p>
                                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Disponible en CareConnect
                                </p>
                            </div>
                        </div>

                        {activeChat.phone && (
                            <a 
                                href={`tel:${activeChat.phone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer" 
                                style={{ borderColor: P.baseNeutral }}
                            >
                                <Phone className="w-3.5 h-3.5 text-teal-700" /> 
                                <span>Llamar</span>
                            </a>
                        )}
                    </div>

                    {/* Contenedor de Mensajes */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                        {currentMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-2">
                                <Clock className="w-8 h-8 text-slate-300" />
                                <p className="text-xs font-semibold">Inicia la conversación enviando un mensaje a continuación.</p>
                            </div>
                        ) : (
                            currentMessages.map(m => {
                                const isUser = m.sender === 'user';
                                return (
                                    <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div 
                                            className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm shadow-xs ${
                                                isUser 
                                                    ? 'text-white rounded-tr-xs' 
                                                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                                            }`}
                                            style={{
                                                backgroundColor: isUser ? P.primary : '#ffffff',
                                            }}
                                        >
                                            <p className="leading-relaxed break-words">{m.text}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1 opacity-75 text-[10px]">
                                                <span>{m.time}</span>
                                                {isUser && <CheckCheck className="w-3 h-3 inline" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input de Envío de Mensaje */}
                    <div className="p-4 border-t bg-white shadow-xs" style={{ borderColor: P.baseNeutral }}>
                        <div className="flex gap-2 items-center max-w-4xl mx-auto">
                            <input 
                                value={text} 
                                onChange={e => setText(e.target.value)} 
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }} 
                                placeholder="Escribe un mensaje para coordinar la atención..." 
                                className="flex-1 px-4 py-3 rounded-2xl border text-sm outline-none bg-slate-50 focus:bg-white focus:border-teal-600 transition-colors" 
                                style={{ borderColor: P.baseNeutral }} 
                            />
                            <button 
                                type="button"
                                onClick={handleSend} 
                                disabled={!text.trim() || sending}
                                className="p-3 rounded-2xl text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm flex items-center justify-center" 
                                style={{ backgroundColor: P.primary }}
                                title="Enviar mensaje"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SectionMessages;
