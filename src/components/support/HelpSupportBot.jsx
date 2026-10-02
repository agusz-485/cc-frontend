import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bot,
    X,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Search,
    Send,
    ArrowLeft,
    FileText,
    Clock,
    Shield,
    Sparkles,
    HelpCircle,
    RotateCcw,
    ExternalLink,
    LifeBuoy
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { reportService } from "../../services/reportService";
import { BOT_CATEGORIES, BOT_FAQS, INITIAL_QUICK_PROMPTS } from "../../data/botKnowledge";
import { P } from "../shared";

export default function HelpSupportBot() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Estado de la ventana del bot
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'report' | 'my_tickets'

    // Estado del chat conversacional
    const [messages, setMessages] = useState([
        {
            id: "welcome_1",
            sender: "bot",
            text: "¡Hola! 👋 Soy **CareBot**, tu asistente virtual en CareConnect. ¿En qué puedo ayudarte hoy?",
            quickOptions: INITIAL_QUICK_PROMPTS
        }
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const chatEndRef = useRef(null);

    // Estado del formulario de Reporte de Incidentes
    const [reportForm, setReportForm] = useState({
        tipo: "CONDUCTA_INAPROPIADA",
        motivo: "",
        descripcion: "",
        reportadoId: "",
        turnoId: ""
    });
    const [submittingReport, setSubmittingReport] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(null);
    const [reportError, setReportError] = useState(null);

    // Estado de Mis Tickets
    const [myReports, setMyReports] = useState([]);
    const [loadingMyReports, setLoadingMyReports] = useState(false);
    const [expandedReportId, setExpandedReportId] = useState(null);

    // Auto-scroll en el chat
    useEffect(() => {
        if (isOpen && activeTab === "chat") {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, activeTab]);

    // Cargar mis reportes si abre la pestaña correspondiente
    useEffect(() => {
        if (isOpen && activeTab === "my_tickets" && isAuthenticated) {
            fetchMyReports();
        }
    }, [isOpen, activeTab, isAuthenticated]);

    const fetchMyReports = async () => {
        try {
            setLoadingMyReports(true);
            const data = await reportService.getMisReportes();
            setMyReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar reportes del usuario:", err);
        } finally {
            setLoadingMyReports(false);
        }
    };

    // Manejar selección de una pregunta o acción rápida
    const handleQuickAction = (prompt) => {
        if (prompt.faqId) {
            const faq = BOT_FAQS.find((f) => f.id === prompt.faqId);
            if (faq) {
                handleSelectFaq(faq);
            }
        } else if (prompt.action === "START_REPORT_WIZARD") {
            setActiveTab("report");
            setReportError(null);
            setReportSuccess(null);
        } else if (prompt.action === "VIEW_MY_REPORTS") {
            if (!isAuthenticated) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `msg_${Date.now()}_user`,
                        sender: "user",
                        text: "Ver mis tickets de reporte"
                    },
                    {
                        id: `msg_${Date.now()}_bot`,
                        sender: "bot",
                        text: "Para consultar el estado de tus tickets de reporte debes iniciar sesión en tu cuenta.",
                        suggestedActions: [
                            { label: "Iniciar Sesión", route: "/login" },
                            { label: "Volver al Menú", action: "RESET_CHAT" }
                        ]
                    }
                ]);
            } else {
                setActiveTab("my_tickets");
            }
        } else if (prompt.action === "RESET_CHAT") {
            resetConversation();
        }
    };

    const handleSelectFaq = (faq) => {
        setMessages((prev) => [
            ...prev,
            {
                id: `msg_${Date.now()}_user`,
                sender: "user",
                text: faq.question
            },
            {
                id: `msg_${Date.now()}_bot`,
                sender: "bot",
                text: faq.answer,
                suggestedActions: [
                    ...(faq.suggestedActions || []),
                    { label: "⬅️ Otra consulta", action: "RESET_CHAT" }
                ]
            }
        ]);
        setSelectedCategory(null);
        setSearchTerm("");
    };

    const handleActionClick = (action) => {
        if (action.route) {
            setIsOpen(false);
            navigate(action.route);
        } else if (action.action) {
            handleQuickAction(action);
        }
    };

    const resetConversation = () => {
        setSelectedCategory(null);
        setSearchTerm("");
        setMessages([
            {
                id: `welcome_${Date.now()}`,
                sender: "bot",
                text: "¡Hola de nuevo! ¿En qué otra consulta puedo orientarte?",
                quickOptions: INITIAL_QUICK_PROMPTS
            }
        ]);
    };

    // Envío del formulario de reporte
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setReportError(null);

        if (!isAuthenticated) {
            setReportError("Debes iniciar sesión para registrar un ticket oficial con seguimiento.");
            return;
        }

        if (!reportForm.motivo.trim() || !reportForm.descripcion.trim()) {
            setReportError("Por favor completa el motivo y la descripción detallada.");
            return;
        }

        try {
            setSubmittingReport(true);
            const payload = {
                tipo: reportForm.tipo,
                motivo: reportForm.motivo.trim(),
                descripcion: reportForm.descripcion.trim(),
                reportadoId: reportForm.reportadoId ? Number(reportForm.reportadoId) : null,
                turnoId: reportForm.turnoId ? Number(reportForm.turnoId) : null
            };

            const res = await reportService.crearReporte(payload);
            setReportSuccess(res);
            setReportForm({
                tipo: "CONDUCTA_INAPROPIADA",
                motivo: "",
                descripcion: "",
                reportadoId: "",
                turnoId: ""
            });

            // Si está en my_tickets, recargamos
            fetchMyReports();
        } catch (err) {
            console.error("Error al enviar reporte:", err);
            const msg = err.response?.data?.message || "No se pudo registrar el reporte. Intenta nuevamente.";
            setReportError(msg);
        } finally {
            setSubmittingReport(false);
        }
    };

    // Filtrar FAQs por término de búsqueda o categoría
    const filteredFaqs = BOT_FAQS.filter((faq) => {
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            return faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
        }
        if (selectedCategory) {
            return faq.categoryId === selectedCategory;
        }
        return false;
    });

    const formatMarkdown = (text) => {
        if (!text) return "";
        // Formateo sencillo para bold y saltos de línea
        const parts = text.split("\n");
        return parts.map((part, i) => {
            // Reemplazar **texto** con <strong>texto</strong>
            const formatted = part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return (
                <p
                    key={i}
                    className="mb-1.5 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
    };

    const getStatusBadge = (estado) => {
        switch (estado) {
            case "PENDIENTE":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pendiente
                    </span>
                );
            case "EN_REVISION":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <Shield className="w-3 h-3" /> En Revisión
                    </span>
                );
            case "RESUELTO":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Resuelto
                    </span>
                );
            case "DESESTIMADO":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Desestimado
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {estado}
                    </span>
                );
        }
    };

    return (
        <aside aria-label="Asistente de Ayuda y Soporte" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
            {/* Ventana Principal del Chat */}
            {isOpen && (
                <div
                    className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
                    style={{ borderColor: "#e2e8f0" }}
                >
                    {/* Header del Asistente */}
                    <div
                        className="px-5 py-4 text-white flex items-center justify-between flex-shrink-0 shadow-xs"
                        style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-sky-700 rounded-full"></span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-sm tracking-wide leading-tight">CareBot</h3>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-sky-400/30 rounded-md border border-white/20">
                                        Oficial
                                    </span>
                                </div>
                                <p className="text-xs text-sky-100 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    Asistencia y Reportes 24/7
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={resetConversation}
                                title="Reiniciar conversación"
                                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-100 hover:text-white transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                title="Cerrar asistente"
                                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-100 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Barra de pestañas de navegación */}
                    <div className="flex border-b bg-slate-50/80 px-2 pt-2 gap-1 text-xs font-semibold flex-shrink-0" style={{ borderColor: "#e2e8f0" }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab("chat")}
                            className={`flex-1 py-2 px-2.5 rounded-t-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                activeTab === "chat"
                                    ? "bg-white text-sky-700 border-t-2 border-sky-600 shadow-xs"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Guía Rápida
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("report");
                                setReportError(null);
                                setReportSuccess(null);
                            }}
                            className={`flex-1 py-2 px-2.5 rounded-t-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                activeTab === "report"
                                    ? "bg-white text-rose-600 border-t-2 border-rose-500 shadow-xs"
                                    : "text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                            }`}
                        >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Reportar
                        </button>

                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("my_tickets")}
                                className={`flex-1 py-2 px-2.5 rounded-t-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                    activeTab === "my_tickets"
                                        ? "bg-white text-sky-700 border-t-2 border-sky-600 shadow-xs"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Mis Tickets
                                {myReports.length > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[10px] flex items-center justify-center font-bold">
                                        {myReports.length}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    {/* VISTA 1: GUÍA RÁPIDA & FAQ CHAT */}
                    {activeTab === "chat" && (
                        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
                            {/* Buscador de preguntas frecuentes */}
                            <div className="p-3 bg-white border-b flex-shrink-0" style={{ borderColor: "#f1f5f9" }}>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setSelectedCategory(null);
                                        }}
                                        placeholder="Buscar temas (contratar, pagos, reseñas...)"
                                        className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800"
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Área de mensajes scrolleable */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                                {/* Si hay búsqueda activa o categoría seleccionada */}
                                {(searchTerm.trim() || selectedCategory) ? (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSearchTerm("");
                                                }}
                                                className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:underline cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Volver al menú
                                            </button>
                                            <span className="text-[11px] text-slate-400">
                                                {filteredFaqs.length} resultados encontrados
                                            </span>
                                        </div>

                                        {filteredFaqs.length === 0 ? (
                                            <div className="p-4 text-center rounded-2xl bg-white border border-slate-200 text-slate-500">
                                                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                <p className="font-semibold">No encontramos respuestas para esa búsqueda.</p>
                                                <p className="text-[11px] mt-1 text-slate-400">
                                                    ¿Deseas enviar un reporte de incidente o consultar al equipo de soporte?
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab("report")}
                                                    className="mt-3 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 font-bold hover:bg-rose-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                                                >
                                                    <AlertTriangle className="w-3 h-3" /> Reportar Problema
                                                </button>
                                            </div>
                                        ) : (
                                            filteredFaqs.map((faq) => (
                                                <div
                                                    key={faq.id}
                                                    onClick={() => handleSelectFaq(faq)}
                                                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                                                                {faq.question}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                {faq.summary}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Historial de Mensajes */}
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                                                        msg.sender === "user"
                                                            ? "bg-sky-600 text-white rounded-br-xs"
                                                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                                                    }`}
                                                >
                                                    {formatMarkdown(msg.text)}
                                                </div>

                                                {/* Botones de acción o categorías si vienen en el mensaje */}
                                                {msg.quickOptions && (
                                                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                                                        {msg.quickOptions.map((opt, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() => handleQuickAction(opt)}
                                                                className="px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 font-medium hover:border-sky-400 shadow-2xs transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Botones sugeridos al pie de una respuesta */}
                                                {msg.suggestedActions && (
                                                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                                                        {msg.suggestedActions.map((act, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() => handleActionClick(act)}
                                                                className={`px-3 py-1.5 rounded-xl font-bold shadow-2xs transition-all text-[11px] flex items-center gap-1 cursor-pointer ${
                                                                    act.action === "START_REPORT_WIZARD"
                                                                        ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                                                                        : act.action === "RESET_CHAT"
                                                                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                                        : "bg-sky-600 text-white hover:bg-sky-700"
                                                                }`}
                                                            >
                                                                {act.label}
                                                                {act.route && <ExternalLink className="w-3 h-3 ml-0.5" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Explorador de Categorías Interactivas */}
                                        <div className="pt-2">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                Categorías de Ayuda
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {BOT_CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (cat.id === "reportes") {
                                                                setActiveTab("report");
                                                            } else {
                                                                setSelectedCategory(cat.id);
                                                            }
                                                        }}
                                                        className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all text-left flex flex-col justify-between shadow-2xs cursor-pointer group"
                                                    >
                                                        <span className="font-bold text-slate-700 group-hover:text-sky-700 transition-colors">
                                                            {cat.title}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                                                            {cat.description}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </div>
                    )}

                    {/* VISTA 2: FORMULARIO WIZARD DE REPORTE DE INCIDENTE */}
                    {activeTab === "report" && (
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col text-xs">
                            {reportSuccess ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                    <div className="w-14 h-14 rounded-3xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-base font-bold text-slate-800">
                                        ¡Reporte Registrado con Éxito!
                                    </h4>
                                    <div className="mt-2 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs w-full max-w-xs text-left">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-medium">Ticket:</span>
                                            <span className="font-bold text-sky-700">#{reportSuccess.id ? `REP-${String(reportSuccess.id).padStart(4, "0")}` : "REP-TICKET"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs mt-1">
                                            <span className="text-slate-400 font-medium">Estado:</span>
                                            {getStatusBadge(reportSuccess.estado || "PENDIENTE")}
                                        </div>
                                        <div className="flex justify-between items-center text-xs mt-1">
                                            <span className="text-slate-400 font-medium">Tipo:</span>
                                            <span className="font-semibold text-slate-700">{reportSuccess.tipo}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-[11px] mt-3 max-w-xs leading-relaxed">
                                        Nuestro equipo administrativo auditará este caso. Podrás consultar la resolución en la pestaña <strong>Mis Tickets</strong>.
                                    </p>

                                    <div className="mt-5 flex gap-2 w-full max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReportSuccess(null);
                                                setActiveTab("my_tickets");
                                            }}
                                            className="flex-1 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors cursor-pointer"
                                        >
                                            Ver Mis Tickets
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReportSuccess(null);
                                                setActiveTab("chat");
                                            }}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            Ir al Chat
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleReportSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-rose-800">
                                            <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                                Reportar un Problema o Usuario
                                            </div>
                                            <p className="text-[11px] text-rose-700 leading-snug">
                                                Garantizamos la confidencialidad de los reportes. Los administradores intervendrán con prioridad.
                                            </p>
                                        </div>

                                        {!isAuthenticated && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-[11px] flex items-start gap-2">
                                                <LifeBuoy className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>Inicia sesión para registrar reportes con seguimiento.</strong>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            navigate("/login");
                                                        }}
                                                        className="block mt-1 font-bold underline text-amber-900 cursor-pointer"
                                                    >
                                                        Ir a Iniciar Sesión →
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {reportError && (
                                            <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold">
                                                {reportError}
                                            </div>
                                        )}

                                        {/* Tipo de reporte */}
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                                                Tipo de Incidente *
                                            </label>
                                            <select
                                                value={reportForm.tipo}
                                                onChange={(e) => setReportForm({ ...reportForm, tipo: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
                                            >
                                                <option value="CONDUCTA_INAPROPIADA">⚠️ Conducta Inapropiada / Falta de respeto</option>
                                                <option value="INCUMPLIMIENTO_TURNO">⏰ Incumplimiento o Abandono de Turno</option>
                                                <option value="PROBLEMA_PAGO">💳 Problema con Tarifas o Pagos</option>
                                                <option value="FALLA_TECNICA">🛠️ Error o Falla Técnica en la Web</option>
                                                <option value="OTRO">📌 Otro Motivo / Consulta Especial</option>
                                            </select>
                                        </div>

                                        {/* Motivo breve */}
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                                                Título / Motivo Breve *
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={150}
                                                value={reportForm.motivo}
                                                onChange={(e) => setReportForm({ ...reportForm, motivo: e.target.value })}
                                                placeholder="Ej: Inasistencia injustificada al turno de hoy"
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
                                                required
                                            />
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                                                Descripción Detallada de los Hechos *
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={reportForm.descripcion}
                                                onChange={(e) => setReportForm({ ...reportForm, descripcion: e.target.value })}
                                                placeholder="Describe lo ocurrido con fecha, horario y contexto relevante..."
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Botón enviar */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={submittingReport || !isAuthenticated}
                                            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            {submittingReport ? (
                                                <>
                                                    <Clock className="w-4 h-4 animate-spin" /> Registrando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" /> Enviar Reporte Oficial
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* VISTA 3: MIS TICKETS */}
                    {activeTab === "my_tickets" && (
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 text-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-sky-600" />
                                    Mis Tickets de Incidente
                                </h4>
                                <button
                                    type="button"
                                    onClick={fetchMyReports}
                                    className="text-[11px] text-sky-600 font-semibold hover:underline cursor-pointer"
                                >
                                    Actualizar
                                </button>
                            </div>

                            {loadingMyReports ? (
                                <div className="p-8 text-center text-slate-400">
                                    <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
                                    Cargando tus reportes...
                                </div>
                            ) : myReports.length === 0 ? (
                                <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-slate-700">No tienes reportes activos</p>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Si experimentas algún problema puedes abrir un nuevo ticket en cualquier momento.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("report")}
                                        className="mt-3 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors cursor-pointer"
                                    >
                                        Crear Nuevo Reporte
                                    </button>
                                </div>
                            ) : (
                                myReports.map((rep) => {
                                    const isExpanded = expandedReportId === rep.id;
                                    return (
                                        <div
                                            key={rep.id}
                                            className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2 transition-all"
                                        >
                                            <div
                                                onClick={() => setExpandedReportId(isExpanded ? null : rep.id)}
                                                className="flex items-start justify-between gap-2 cursor-pointer"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="font-bold text-sky-700 text-[11px]">
                                                            #{`REP-${String(rep.id).padStart(4, "0")}`}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : ""}
                                                        </span>
                                                    </div>
                                                    <h5 className="font-bold text-slate-800 leading-snug">{rep.motivo}</h5>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    {getStatusBadge(rep.estado)}
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                                        {rep.tipo}
                                                    </span>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-600">
                                                    <div>
                                                        <span className="font-bold text-slate-700 text-[10px] uppercase block">
                                                            Tu Descripción:
                                                        </span>
                                                        <p className="text-slate-600 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                                                            {rep.descripcion}
                                                        </p>
                                                    </div>

                                                    {rep.respuestaAdmin ? (
                                                        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-2.5">
                                                            <div className="flex items-center gap-1 text-sky-800 font-bold text-[11px] mb-1">
                                                                <Shield className="w-3.5 h-3.5 text-sky-600" />
                                                                Resolución del Administrador:
                                                            </div>
                                                            <p className="text-sky-900 text-[11px]">
                                                                {rep.respuestaAdmin}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[11px] text-amber-600 italic">
                                                            ⏳ Este reporte está siendo evaluado por el equipo de moderación.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Botón Flotante para abrir/cerrar el Bot */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.4)"
                }}
                aria-label="Abrir asistente de ayuda CareBot"
            >
                <div className="relative">
                    <Bot className="w-6 h-6 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                </div>
                <span className="font-bold text-sm tracking-wide hidden sm:inline-block">
                    {isOpen ? "Cerrar Ayuda" : "¿Necesitas Ayuda?"}
                </span>
            </button>
        </aside>
    );
}
