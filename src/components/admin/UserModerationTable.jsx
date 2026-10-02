import React, { useState } from "react";
import { CheckCircle, Ban, Search, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { P } from "../shared";
import { UserAvatar } from "../ui/UserAvatar";

export default function UserModerationTable({ users = [], onApprove, onSuspend, loading }) {
    const [filter, setFilter] = useState("TODOS");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter((u) => {
        const matchesFilter = filter === "TODOS" ? true : u.estado === filter;
        const fullName = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.matriculaProfesional && u.matriculaProfesional.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="bg-white rounded-3xl border overflow-hidden shadow-xs" style={{ borderColor: P.baseNeutral }}>
            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between items-center" style={{ borderColor: P.baseNeutral }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-80 bg-white" style={{ borderColor: P.baseNeutral }}>
                    <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.neutralDark }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o matrícula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs outline-none w-full bg-transparent"
                    />
                </div>

                <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                    {[
                        { id: "TODOS", label: "Todos" },
                        { id: "PENDIENTE_VERIFICACION", label: "Pendientes" },
                        { id: "ACTIVO", label: "Activos" },
                        { id: "SUSPENDIDO", label: "Suspendidos" },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setFilter(id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                            style={{
                                backgroundColor: filter === id ? P.primary : "transparent",
                                color: filter === id ? "white" : P.neutralDark,
                                border: `1px solid ${filter === id ? P.primary : P.baseNeutral}`,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: P.baseNeutral, color: P.neutralDark, backgroundColor: P.neutralLight }}>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Matrícula / Zona</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm" style={{ divideColor: P.baseNeutral }}>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-xs italic text-slate-400">
                                    Cargando registros...
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-xs italic text-slate-500">
                                    No se encontraron usuarios para los filtros seleccionados
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                src={u.fotoPerfil}
                                                name={`${u.nombre || ""} ${u.apellido || ""}`}
                                                tipo={u.rol}
                                                size="sm"
                                                shape="rounded-xl"
                                                className="w-9 h-9 border border-slate-200 shadow-2xs flex-shrink-0"
                                            />
                                            <div>
                                                <p className="font-bold" style={{ color: P.dark }}>{u.nombre} {u.apellido}</p>
                                                <p className="text-xs" style={{ color: P.neutralDark }}>{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-xs" style={{ color: P.dark }}>
                                        {u.rol}
                                    </td>
                                    <td className="p-4 text-xs">
                                        {u.matriculaProfesional ? (
                                            <div>
                                                <span className="font-mono font-bold px-2 py-0.5 rounded-md text-[11px]" style={{ backgroundColor: "#e8f4f8", color: P.primary }}>
                                                    MP: {u.matriculaProfesional}
                                                </span>
                                                {u.zonaPrincipal && (
                                                    <p className="mt-1" style={{ color: P.neutralDark }}>{u.zonaPrincipal}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span style={{ color: P.neutralDark }}>{u.zonaPrincipal || "Sin matrícula"}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className="px-2.5 py-1 rounded-full text-xs font-bold"
                                            style={{
                                                backgroundColor:
                                                    u.estado === "ACTIVO"
                                                        ? "#e8f6ee"
                                                        : u.estado === "PENDIENTE_VERIFICACION"
                                                        ? "#fef0e6"
                                                        : "#fde8e8",
                                                color:
                                                    u.estado === "ACTIVO"
                                                        ? "#16a34a"
                                                        : u.estado === "PENDIENTE_VERIFICACION"
                                                        ? P.accent
                                                        : "#dc2626",
                                            }}
                                        >
                                            {u.estado === "PENDIENTE_VERIFICACION" ? "Pendiente" : u.estado}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {u.estado !== "ACTIVO" && (
                                            <button
                                                type="button"
                                                onClick={() => onApprove(u.id, `${u.nombre} ${u.apellido}`)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                                                style={{ backgroundColor: "#16a34a" }}
                                            >
                                                <UserCheck className="w-3.5 h-3.5" /> Habilitar
                                            </button>
                                        )}
                                        {u.estado !== "SUSPENDIDO" && (
                                            <button
                                                type="button"
                                                onClick={() => onSuspend(u.id, `${u.nombre} ${u.apellido}`)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:bg-red-50 cursor-pointer"
                                                style={{ borderColor: "#fca5a5", color: "#dc2626" }}
                                            >
                                                <Ban className="w-3.5 h-3.5" /> Suspender
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}