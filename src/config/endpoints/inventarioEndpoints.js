/**
 * Endpoints de Inventario
 */

import { API_BASE_URL } from '../apiConfig';

export const inventarioEndpoints = {
  base: `${API_BASE_URL}/inventario`,
  getAll: `${API_BASE_URL}/inventario`,
  getById: (id) => `${API_BASE_URL}/inventario/${id}`,
  update: (id) => `${API_BASE_URL}/inventario/${id}`,
  agregarStock: `${API_BASE_URL}/inventario/agregar-stock`,
  ajustarStock: `${API_BASE_URL}/inventario/ajustar-stock`,
  bajoStock: `${API_BASE_URL}/inventario/bajo-stock`,
};
