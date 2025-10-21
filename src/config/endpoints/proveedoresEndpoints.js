/**
 * Endpoints de Proveedores
 */

import { API_BASE_URL } from '../apiConfig';

export const proveedoresEndpoints = {
  base: `${API_BASE_URL}/api/proveedores`,
  getAll: `${API_BASE_URL}/api/proveedores`,
  getById: (id) => `${API_BASE_URL}/api/proveedores/${id}`,
  create: `${API_BASE_URL}/api/proveedores`,
  update: (id) => `${API_BASE_URL}/api/proveedores/${id}`,
  delete: (id) => `${API_BASE_URL}/api/proveedores/${id}`,
};
