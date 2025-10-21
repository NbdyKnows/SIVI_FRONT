/**
 * Endpoints de Inventario
 */

import { API_BASE_URL } from '../apiConfig';

export const inventarioEndpoints = {
  base: `${API_BASE_URL}/api/inventario`,
  getAll: `${API_BASE_URL}/api/inventario`,
  getById: (id) => `${API_BASE_URL}/api/inventario/${id}`,
  update: (id) => `${API_BASE_URL}/api/inventario/${id}`,
  agregarStock: `${API_BASE_URL}/api/inventario/agregar-stock`,
  ajustarStock: `${API_BASE_URL}/api/inventario/ajustar-stock`,
  bajoStock: `${API_BASE_URL}/api/inventario/bajo-stock`,
};
