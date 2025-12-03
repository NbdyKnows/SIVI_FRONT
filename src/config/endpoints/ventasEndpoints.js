/**
 * Endpoints de Ventas
 */

import { API_BASE_URL } from '../apiConfig';

export const ventasEndpoints = {
  base: `${API_BASE_URL}/ventas`,
  getAll: `${API_BASE_URL}/ventas`,
  getById: (id) => `${API_BASE_URL}/ventas/${id}`,
  create: `${API_BASE_URL}/ventas`,
  update: (id) => `${API_BASE_URL}/ventas/${id}`,
  delete: (id) => `${API_BASE_URL}/ventas/${id}`,
  byDate: `${API_BASE_URL}/ventas/fecha`,
  byVendedor: (vendedorId) => `${API_BASE_URL}/ventas/vendedor/${vendedorId}`,
  estadisticasVendedor: (vendedorId) => `${API_BASE_URL}/ventas/vendedor/${vendedorId}/estadisticas`,
  statistics: `${API_BASE_URL}/ventas/estadisticas`,
};
