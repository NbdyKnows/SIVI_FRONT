/**
 * Endpoints de Movimiento
 */

import { API_BASE_URL } from '../appConfig';

export const movimientosEndpoints = {
    getAll: (entradaSalida = 0) =>
        `${API_BASE_URL}/movimientos/ListaMovimientos?entradaSalida=${entradaSalida}`,
    getById: (id) => `${API_BASE_URL}/movimientos/${id}/detalles`,
    create: `${API_BASE_URL}/movimientos`
};
