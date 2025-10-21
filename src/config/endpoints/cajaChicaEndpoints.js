/**
 * Endpoints de Caja Chica
 */

import { API_BASE_URL } from '../apiConfig';

export const cajaChicaEndpoints = {
  base: `${API_BASE_URL}/api/caja-chica`,
  getAll: `${API_BASE_URL}/api/caja-chica`,
  getById: (id) => `${API_BASE_URL}/api/caja-chica/${id}`,
  create: `${API_BASE_URL}/api/caja-chica`,
  update: (id) => `${API_BASE_URL}/api/caja-chica/${id}`,
  delete: (id) => `${API_BASE_URL}/api/caja-chica/${id}`,
  balance: `${API_BASE_URL}/api/caja-chica/balance`,
};
