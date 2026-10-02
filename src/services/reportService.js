import client from '../api/client';

export const reportService = {
    /**
     * Crear un nuevo reporte / ticket de incidente
     * @param {Object} data - { tipo, motivo, descripcion, reportadoId, turnoId }
     */
    crearReporte: async (data) => {
        const response = await client.post('/reportes', data);
        return response.data;
    },

    /**
     * Obtener el historial de reportes creados por el usuario autenticado
     */
    getMisReportes: async () => {
        const response = await client.get('/reportes/mis-reportes');
        return response.data;
    },

    /**
     * Obtener detalle de un reporte por ID
     */
    getReportePorId: async (id) => {
        const response = await client.get(`/reportes/${id}`);
        return response.data;
    },

    /**
     * (Admin) Obtener todos los reportes con filtro opcional de estado
     * @param {string} [estado] - PENDIENTE, EN_REVISION, RESUELTO, DESESTIMADO
     */
    getReportesAdmin: async (estado) => {
        const params = estado && estado !== 'TODOS' ? { estado } : {};
        const response = await client.get('/admin/reportes', { params });
        return response.data;
    },

    /**
     * (Admin) Resolver un reporte y registrar respuesta oficial
     * @param {number|string} id 
     * @param {Object} data - { estado: 'RESUELTO'|'EN_REVISION'|'DESESTIMADO', respuestaAdmin: string }
     */
    resolverReporteAdmin: async (id, data) => {
        const response = await client.patch(`/admin/reportes/${id}/resolver`, data);
        return response.data;
    }
};

export default reportService;
