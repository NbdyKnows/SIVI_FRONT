/**
 * Endpoints de Caja Chica
 */

import { API_BASE_URL } from '../apiConfig';

export const cajaChicaEndpoints = {
  base: `${API_BASE_URL}/caja-chica`,
  getAll: `${API_BASE_URL}/caja-chica`,
  getById: (id) => `${API_BASE_URL}/caja-chica/${id}`,
  create: `${API_BASE_URL}/caja-chica`,
  update: (id) => `${API_BASE_URL}/caja-chica/${id}`,
  delete: (id) => `${API_BASE_URL}/caja-chica/${id}`,
  balance: `${API_BASE_URL}/caja-chica/balance`,
};
