import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Phone, Send } from "lucide-react";
import { P } from "../../shared";

export function SectionMessages({ initialChats = [] }) {
    const [chats, setChats] = useState(initialChats);
    const [selectedChatId, setSelectedChatId] = useState(initialChats[0]?.id || null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [text, setText] = useState("");
    const chatRef = useRef(null);

    const activeChat = chats.find(c => c.id === selectedChatId);
    const currentMessages = selectedChatId ? (messagesByChat[selectedChatId] || []) : [];

    const handleSend = () => {
        if (!text.trim() || !selectedChatId) return;

        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessagesByChat(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
        }));

        // Actualizar último mensaje en la lista de chats
        setChats(prev => prev.map(c => c.id === selectedChatId ? {
            ...c,
            lastMessage: text.trim(),
            time: newMessage.time
        } : c));

        setText("");
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messagesByChat, selectedChatId]);

    const filteredChats = chats.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar de Chats */}
            <div className="w-80 border-r flex flex-col" style={{ borderColor: P.baseNeutral, backgroundColor: "white" }}>
                <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: P.baseNeutral }}>
                    <Search className="w-4 h-4" style={{ color: P.neutralDark }} />
                    <input 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar chat..." 
                        className="text-sm outline-none w-full bg-transparent" 
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">Sin conversaciones</p>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                                {searchQuery ? "No se encontraron resultados" : "Tus mensajes activos aparecerán aquí."}
                            </p>
                        </div>
                    ) : (
                        filteredChats.map(c => (
                            <div 
                                key={c.id} 
                                onClick={() => setSelectedChatId(c.id)} 
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors" 
                                style={{ backgroundColor: selectedChatId === c.id ? "#e8f4f8" : "transparent" }}
                            >
                                <img src={c.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold truncate" style={{ color: P.dark }}>{c.name}</p>
                                        <span className="text-[10px]" style={{ color: P.neutralDark }}>{c.time}</span>
                                    </div>
                                    <p className="text-xs truncate" style={{ color: P.neutralDark }}>{c.lastMessage || "Sin mensajes"}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Área Principal de Chat / Estado Vacío */}
            {!activeChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                    <div className="max-w-md w-full bg-white p-8 rounded-3xl border shadow-sm flex flex-col items-center" style={{ borderColor: P.baseNeutral }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(37,150,190,0.1)", color: P.primary }}>
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold" style={{ color: P.dark }}>No hay mensajes disponibles</h3>
                        <p className="text-xs mt-2 leading-relaxed max-w-sm" style={{ color: P.neutralDark }}>
                            Aún no tienes conversaciones activas. Cuando te comuniques con un cuidador o profesional desde el directorio, podrás coordinar el servicio y chatear directamente desde aquí.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#f8fbfd" }}>
                    {/* Header del Chat */}
                    <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: P.baseNeutral, backgroundColor: "white" }}>
                        <div className="flex items-center gap-3">
                            <img src={activeChat.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div>
                                <p className="text-sm font-bold" style={{ color: P.dark }}>{activeChat.name}</p>
                                <p className="text-xs text-emerald-600 font-semibold">En línea</p>
                            </div>
                        </div>
                        {activeChat.phone && (
                            <a 
                                href={`tel:${activeChat.phone}`}
                                className="p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors" 
                                style={{ borderColor: P.baseNeutral, color: P.dark }}
                            >
                                <Phone className="w-3.5 h-3.5" /> Llamar
                            </a>
                        )}
                    </div>

                    {/* Mensajes */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {currentMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                                <p className="text-xs font-semibold">Inicia la conversación enviando un mensaje a continuación.</p>
                            </div>
                        ) : (
                            currentMessages.map(m => (
                                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm" style={{
                                        backgroundColor: m.sender === 'user' ? P.primary : 'white',
                                        color: m.sender === 'user' ? 'white' : P.dark,
                                        borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    }}>
                                        <p>{m.text}</p>
                                        <span className="text-[9px] block text-right mt-1 opacity-70">{m.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Entrada de texto */}
                    <div className="p-4 border-t" style={{ borderColor: P.baseNeutral, backgroundColor: "white" }}>
                        <div className="flex gap-2 items-center">
                            <input 
                                value={text} 
                                onChange={e => setText(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                                placeholder="Escribe un mensaje..." 
                                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none bg-slate-50 focus:bg-white transition-colors" 
                                style={{ borderColor: P.baseNeutral }} 
                            />
                            <button 
                                onClick={handleSend} 
                                disabled={!text.trim()}
                                className="p-3 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer" 
                                style={{ backgroundColor: P.primary }}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
