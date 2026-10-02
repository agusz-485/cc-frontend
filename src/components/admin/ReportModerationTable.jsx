import React, { useState } from "react";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    Eye,
    UserX,
    Filter,
    Search,
    MessageSquare,
    User,
    Calendar,
    Send,
    X
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { adminService } from "../../services/adminService";
import { P } from "../shared";

export default function ReportModerationTable({ reports = [], onRefresh = () => {} }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [statusFilter, setStatusFilter] = useState("TODOS");
    const [searchQuery, setSearchQuery] = useState("");
    const [resolutionText, setResolutionText] = useState("");
    const [resolutionStatus, setResolutionStatus] = useState("RESUELTO");
    const [savingResolution, setSavingResolution] = useState(false);
    const [actionMsg, setActionMsg] = useState(null);

    // Filtrar reportes
    const filteredReports = reports.filter((r) => {
        const matchesStatus = statusFilter === "TODOS" || r.estado === statusFilter;
        const matchesQuery =
            !searchQuery.trim() ||
            (r.motivo && r.motivo.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.descripcion && r.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.reportanteNombre && r.reportanteNombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.reportadoNombre && r.reportadoNombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
            String(r.id).includes(searchQuery);

        return matchesStatus && matchesQuery;
    });

    const handleOpenModal = (rep) => {
        setSelectedReport(rep);
        setResolutionText(rep.respuestaAdmin || "");
        setResolutionStatus(rep.estado === "PENDIENTE" ? "EN_REVISION" : rep.estado);
        setActionMsg(null);
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
        setResolutionText("");
        setActionMsg(null);
    };

    const handleSaveResolution = async () => {
        if (!selectedReport) return;
        if (!resolutionText.trim()) {
            alert("Por favor escribe una nota o resolución oficial para el usuario.");
            return;
        }

        try {
            setSavingResolution(true);
            await reportService.resolverReporteAdmin(selectedReport.id, {
                estado: resolutionStatus,
                respuestaAdmin: resolutionText.trim()
            });

            setActionMsg({ type: "success", text: "Resolución guardada y notificada con éxito." });
            await onRefresh();
            setTimeout(() => {
                handleCloseModal();
            }, 1000);
        } catch (err) {
            console.error("Error al resolver reporte:", err);
            setActionMsg({ type: "error", text: "Error al actualizar el estado del reporte." });
        } finally {
            setSavingResolution(false);
        }
    };

    const handleSuspendReportedUser = async () => {
        if (!selectedReport?.reportadoId) return;
        const name = selectedReport.reportadoNombre || `Usuario #${selectedReport.reportadoId}`;
        if (!window.confirm(`¿Confirmas la suspensión inmediata de la cuenta de ${name} por infracción?`)) return;

        try {
            await adminService.suspenderUsuario(selectedReport.reportadoId);
            setActionMsg({ type: "success", text: `Usuario ${name} suspendido de la plataforma.` });
            await onRefresh();
        } catch (err) {
            alert("Error al suspender usuario.");
        }
    };

    const getStatusBadge = (estado) => {
        switch (estado) {
            case "PENDIENTE":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pendiente
                    </span>
                );
            case "EN_REVISION":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        <Shield className="w-3 h-3" /> En Revisión
                    </span>
                );
            case "RESUELTO":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Resuelto
                    </span>
                );
            case "DESESTIMADO":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Desestimado
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {estado}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-4">
            {/* Filtros superiores */}
            <div className="bg-white p-4 rounded-3xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                {/* Tabs de estado */}
                <div className="flex flex-wrap gap-1.5">
                    {["TODOS", "PENDIENTE", "EN_REVISION", "RESUELTO", "DESESTIMADO"].map((st) => {
                        const count = st === "TODOS" ? reports.length : reports.filter((r) => r.estado === st).length;
                        return (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    statusFilter === st
                                        ? "bg-sky-700 text-white shadow-xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {st === "TODOS" ? "Todos" : st === "PENDIENTE" ? "Pendientes" : st === "EN_REVISION" ? "En Revisión" : st === "RESUELTO" ? "Resueltos" : "Desestimados"}
                                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === st ? "bg-white/20 text-white" : "bg-white text-slate-600"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Buscador */}
                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por motivo, usuario o ticket..."
                        className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800"
                    />
                </div>
            </div>

            {/* Tabla de Reportes */}
            <div className="bg-white rounded-3xl border shadow-xs overflow-hidden" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 border-b text-slate-500 font-bold uppercase tracking-wider text-[11px]" style={{ borderColor: "#e2e8f0" }}>
                                <th className="p-4">Ticket</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Motivo / Caso</th>
                                <th className="p-4">Reportante</th>
                                <th className="p-4">Reportado</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                        No se encontraron reportes con los criterios seleccionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((rep) => (
                                    <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-sky-700 whitespace-nowrap">
                                            #{`REP-${String(rep.id).padStart(4, "0")}`}
                                            <span className="block text-[10px] text-slate-400 font-normal">
                                                {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : ""}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                                                {rep.tipo}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="font-bold text-slate-800 line-clamp-1">{rep.motivo}</p>
                                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rep.descripcion}</p>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="font-semibold text-slate-800 block">
                                                {rep.reportanteNombre || `Usuario #${rep.reportanteId}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block">
                                                {rep.reportanteEmail}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {rep.reportadoNombre ? (
                                                <>
                                                    <span className="font-semibold text-rose-700 block">
                                                        {rep.reportadoNombre}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 block">
                                                        {rep.reportadoEmail}
                                                    </span>
                                                </>
                                            ) : rep.turnoId ? (
                                                <span className="text-slate-500 font-medium">Turno #{rep.turnoId}</span>
                                            ) : (
                                                <span className="text-slate-400 italic">No especificado</span>
                                            )}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {getStatusBadge(rep.estado)}
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal(rep)}
                                                className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Revisar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Auditoría y Resolución de Reporte */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: "#e2e8f0" }}>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                                        #{`REP-${String(selectedReport.id).padStart(4, "0")}`}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Auditoría de Incidente: {selectedReport.motivo}
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    Registrado el {new Date(selectedReport.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Partes Involucradas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-500 uppercase text-[10px] block">
                                    Usuario Reportante
                                </span>
                                <p className="font-bold text-slate-800 text-sm">{selectedReport.reportanteNombre || `ID #${selectedReport.reportanteId}`}</p>
                                <p className="text-slate-500">{selectedReport.reportanteEmail}</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-rose-600 uppercase text-[10px] block">
                                        Parte Reportada / Turno
                                    </span>
                                    {selectedReport.reportadoId && (
                                        <button
                                            type="button"
                                            onClick={handleSuspendReportedUser}
                                            className="text-[10px] font-bold text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <UserX className="w-3 h-3" /> Suspender
                                        </button>
                                    )}
                                </div>
                                <p className="font-bold text-slate-800 text-sm">
                                    {selectedReport.reportadoNombre || (selectedReport.turnoId ? `Turno #${selectedReport.turnoId}` : "No asignado")}
                                </p>
                                <p className="text-slate-500">{selectedReport.reportadoEmail || "Sin email registrado"}</p>
                            </div>
                        </div>

                        {/* Descripción Completa */}
                        <div className="space-y-1 text-xs">
                            <label className="font-bold text-slate-700 uppercase text-[10px] block">
                                Relato de los Hechos (Descripción del Usuario):
                            </label>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {selectedReport.descripcion}
                            </div>
                        </div>

                        {/* Formulario de Dictamen / Resolución */}
                        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3 text-xs">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <label className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
                                    <Shield className="w-4 h-4 text-sky-700" />
                                    Dictamen Oficial del Administrador
                                </label>

                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-semibold text-[11px]">Nuevo Estado:</span>
                                    <select
                                        value={resolutionStatus}
                                        onChange={(e) => setResolutionStatus(e.target.value)}
                                        className="px-3 py-1 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="EN_REVISION">En Revisión</option>
                                        <option value="RESUELTO">Resuelto</option>
                                        <option value="DESESTIMADO">Desestimado</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                rows={3}
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                                placeholder="Escribe aquí la respuesta formal y las acciones tomadas por el equipo de moderación..."
                                className="w-full p-3 rounded-xl bg-white border border-sky-300 text-slate-800 focus:ring-2 focus:ring-sky-500 text-xs resize-none"
                            />
                        </div>

                        {actionMsg && (
                            <div className={`p-3 rounded-xl text-xs font-bold ${actionMsg.type === "success" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-200"}`}>
                                {actionMsg.text}
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "#e2e8f0" }}>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveResolution}
                                disabled={savingResolution}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {savingResolution ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Guardar y Notificar Resolución
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
