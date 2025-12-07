/**
 * Endpoints de Descuentos (Sistema Antiguo)
 */

import { API_BASE_URL } from '../apiConfig';

export const descuentosEndpoints = {
  base: `${API_BASE_URL}/descuentos`,
  getAll: `${API_BASE_URL}/descuentos`,
  getById: (id) => `${API_BASE_URL}/descuentos/${id}`,
  create: `${API_BASE_URL}/descuentos`,
  update: (id) => `${API_BASE_URL}/descuentos/${id}`,
  delete: (id) => `${API_BASE_URL}/descuentos/${id}`,
  activos: `${API_BASE_URL}/descuentos/activos`,
  estadisticas: `${API_BASE_URL}/descuentos/estadisticas`,
};
