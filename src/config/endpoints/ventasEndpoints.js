/**
 * Endpoints de Ventas
 */

import { API_BASE_URL } from '../apiConfig';

export const ventasEndpoints = {
  base: `${API_BASE_URL}/api/ventas`,
  getAll: `${API_BASE_URL}/api/ventas`,
  getById: (id) => `${API_BASE_URL}/api/ventas/${id}`,
  create: `${API_BASE_URL}/api/ventas`,
  update: (id) => `${API_BASE_URL}/api/ventas/${id}`,
  delete: (id) => `${API_BASE_URL}/api/ventas/${id}`,
  byDate: `${API_BASE_URL}/api/ventas/fecha`,
  byVendedor: (vendedorId) => `${API_BASE_URL}/api/ventas/vendedor/${vendedorId}`,
  statistics: `${API_BASE_URL}/api/ventas/estadisticas`,
};
