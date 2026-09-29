import React, { useEffect, useState } from "react";
import { Users, UserCheck, Clock, Ban, RefreshCw, CheckCircle, ShieldCheck, HeartHandshake, Stethoscope } from "lucide-react";
import { adminService } from "../../services/adminService";
import UserModerationTable from "../../components/admin/UserModerationTable";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { P } from "../../components/shared";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("inicio_admin");
    const [metricas, setMetricas] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);
            const [resMetricas, resUsuarios] = await Promise.all([
                adminService.getMetricas(),
                adminService.getUsuarios(),
            ]);
            setMetricas(resMetricas);
            setUsuarios(resUsuarios);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la información del panel administrativo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleApprove = async (id, nombreCompleto) => {
        if (!window.confirm(`¿Aprobar y habilitar a ${nombreCompleto}?`)) return;
        try {
            await adminService.aprobarUsuario(id);
            await cargarDatos();
        } catch (err) {
            alert("Error al aprobar usuario");
        }
    };

    const handleSuspend = async (id, nombreCompleto) => {
        if (!window.confirm(`¿Seguro que deseas suspender a ${nombreCompleto}?`)) return;
        try {
            await adminService.suspenderUsuario(id);
            await cargarDatos();
        } catch (err) {
            alert("Error al suspender usuario");
        }
    };

    const cards = [
        { label: "Total Registrados", val: metricas?.totalUsuarios ?? 0, icon: Users, color: P?.primary || "#0284c7", bg: "#e0f2fe" },
        { label: "Usuarios Activos", val: metricas?.usuariosActivos ?? 0, icon: UserCheck, color: "#16a34a", bg: "#dcfce7" },
        { label: "Pendientes", val: metricas?.pendientesVerificacion ?? 0, icon: Clock, color: P?.accent || "#ea580c", bg: "#ffedd5" },
        { label: "Suspendidos", val: metricas?.usuariosSuspendidos ?? 0, icon: Ban, color: "#dc2626", bg: "#fee2e2" },
    ];

    const cuidadoresPendientes = usuarios.filter(u => (u.rol || u.role) === "CUIDADOR" && (u.estado || u.status) !== "ACTIVO");

    // Métricas calculadas para la barra de distribución
    const total = metricas?.totalUsuarios || 1;
    const cuidadores = metricas?.totalCuidadores ?? 0;
    const enfermeros = metricas?.totalEnfermeros ?? 0;
    const familiares = metricas?.totalFamiliares ?? 0;

    const pctCuidadores = Math.round((cuidadores / total) * 100);
    const pctEnfermeros = Math.round((enfermeros / total) * 100);
    const pctFamiliares = Math.round((familiares / total) * 100);

    const rolesData = [
        { label: "Cuidadores", count: cuidadores, pct: pctCuidadores, color: "bg-sky-500", icon: HeartHandshake },
        { label: "Enfermeros", count: enfermeros, pct: pctEnfermeros, color: "bg-teal-500", icon: Stethoscope },
        { label: "Familiares", count: familiares, pct: pctFamiliares, color: "bg-indigo-500", icon: Users },
    ];

    return (
        <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f8fbfd" }}>
                <div className="p-8 max-w-7xl mx-auto space-y-6">
                    {/* Header común */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: P?.dark || "#0f172a" }}>
                                {activeTab === "inicio_admin" && "Panel de Métricas"}
                                {activeTab === "moderacion" && "Verificaciones Profesionales"}
                                {activeTab === "gestion_usuarios" && "Gestión de Usuarios"}
                            </h1>
                            <p className="text-sm mt-0.5" style={{ color: P?.neutralDark || "#64748b" }}>
                                Supervisión en tiempo real y moderación del sistema
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={cargarDatos}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                            style={{ borderColor: P?.baseNeutral || "#e2e8f0", color: P?.dark || "#0f172a" }}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                            Actualizar
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl text-xs font-bold text-red-700 bg-red-100 border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* VISTA 1: MÉTRICAS */}
                    {activeTab === "inicio_admin" && (
                        <div className="space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {cards.map((c, i) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={i} className="p-5 rounded-3xl bg-white border flex items-center gap-4 shadow-xs" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
                                                <Icon className="w-6 h-6" style={{ color: c.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold" style={{ color: P?.neutralDark || "#64748b" }}>{c.label}</p>
                                                <p className="text-2xl font-black mt-0.5" style={{ color: P?.dark || "#0f172a" }}>{loading ? "..." : c.val}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detalle Analítico: Distribución por Rol y Últimos Registros */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Distribución por Rol */}
                                <div className="bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: P?.dark || "#0f172a" }}>Distribución por Rol</h3>
                                        <p className="text-xs text-slate-500 mt-1">Composición actual de la red</p>

                                        <div className="space-y-4 mt-6">
                                            {rolesData.map((item, idx) => {
                                                const RoleIcon = item.icon;
                                                return (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="flex justify-between text-xs font-semibold">
                                                            <span className="flex items-center gap-2 text-slate-700">
                                                                <RoleIcon className="w-4 h-4 text-slate-400" />
                                                                {item.label}
                                                            </span>
                                                            <span className="text-slate-500">{item.count} ({item.pct}%)</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                                                style={{ width: `${item.pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t mt-6 border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Total usuarios en red</span>
                                        <span className="font-bold text-slate-700">{metricas?.totalUsuarios ?? 0}</span>
                                    </div>
                                </div>

                                {/* Últimos Registros */}
                                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border shadow-xs" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: P?.dark || "#0f172a" }}>Últimos Registros</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Nuevos ingresos a la plataforma</p>
                                        </div>
                                    </div>

                                    {metricas?.ultimosRegistros && metricas.ultimosRegistros.length > 0 ? (
                                        <div className="divide-y divide-slate-100">
                                            {metricas.ultimosRegistros.map((u) => (
                                                <div key={u.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">{u.nombre} {u.apellido}</p>
                                                            <p className="text-[11px] text-slate-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                            {u.rol}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.estado === "ACTIVO"
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : u.estado === "PENDIENTE_VERIFICACION"
                                                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                                    : "bg-red-50 text-red-700 border border-red-200"
                                                            }`}>
                                                            {u.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-40 flex items-center justify-center text-xs text-slate-400">
                                            Sin registros recientes
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VISTA 2: VERIFICACIONES */}
                    {activeTab === "moderacion" && (
                        <div className="space-y-4">
                            {cuidadoresPendientes.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                    <p className="text-base font-bold" style={{ color: P?.dark || "#0f172a" }}>Todos los perfiles están al día</p>
                                    <p className="text-xs text-slate-500 mt-1">No hay cuidadores pendientes de validación o con certificados por revisar.</p>
                                </div>
                            ) : (
                                cuidadoresPendientes.map((c) => (
                                    <div key={c.id} className="bg-white rounded-2xl p-5 border flex justify-between items-center" style={{ borderColor: P?.baseNeutral || "#e2e8f0" }}>
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: P?.dark || "#0f172a" }}>{c.nombre || c.name}</h3>
                                            <p className="text-xs text-slate-500">{c.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSuspend(c.id, c.nombre || c.name)} className="px-3 py-1.5 border rounded-xl text-xs font-bold text-red-600 hover:bg-red-50">
                                                Rechazar
                                            </button>
                                            <button onClick={() => handleApprove(c.id, c.nombre || c.name)} className="px-4 py-1.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: P?.primary || "#0284c7" }}>
                                                Aprobar Perfil
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* VISTA 3: USUARIOS */}
                    {activeTab === "gestion_usuarios" && (
                        <div className="space-y-3">
                            <UserModerationTable
                                users={usuarios}
                                onApprove={handleApprove}
                                onSuspend={handleSuspend}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}