/**
 * Endpoints de Descuentos
 */

import { API_BASE_URL } from '../apiConfig';

export const descuentosEndpoints = {
  base: `${API_BASE_URL}/api/descuentos`,
  getAll: `${API_BASE_URL}/api/descuentos`,
  getById: (id) => `${API_BASE_URL}/api/descuentos/${id}`,
  create: `${API_BASE_URL}/api/descuentos`,
  update: (id) => `${API_BASE_URL}/api/descuentos/${id}`,
  delete: (id) => `${API_BASE_URL}/api/descuentos/${id}`,
  activos: `${API_BASE_URL}/api/descuentos/activos`,
};
