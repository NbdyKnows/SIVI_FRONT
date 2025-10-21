/**
 * Endpoints de Clientes
 */

import { API_BASE_URL } from '../apiConfig';

export const clientesEndpoints = {
  base: `${API_BASE_URL}/api/clientes`,
  getAll: `${API_BASE_URL}/api/clientes`,
  getById: (id) => `${API_BASE_URL}/api/clientes/${id}`,
  create: `${API_BASE_URL}/api/clientes`,
  update: (id) => `${API_BASE_URL}/api/clientes/${id}`,
  delete: (id) => `${API_BASE_URL}/api/clientes/${id}`,
  search: `${API_BASE_URL}/api/clientes/search`,
};
