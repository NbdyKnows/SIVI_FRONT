/**
 * Endpoints de Proveedores
 */

import { API_BASE_URL } from '../apiConfig';

export const proveedoresEndpoints = {
  base: `${API_BASE_URL}/proveedores`,
  getAll: `${API_BASE_URL}/proveedores`,
  getById: (id) => `${API_BASE_URL}/proveedores/${id}`,
  create: `${API_BASE_URL}/proveedores`,
  update: (id) => `${API_BASE_URL}/proveedores/${id}`,
  delete: (id) => `${API_BASE_URL}/proveedores/${id}`,
};
