/**
 * Endpoints de Productos
 */

import { API_BASE_URL } from '../apiConfig';

export const productosEndpoints = {
  base: `${API_BASE_URL}/api/productos`,
  getAll: `${API_BASE_URL}/api/productos`,
  getById: (id) => `${API_BASE_URL}/api/productos/${id}`,
  create: `${API_BASE_URL}/api/productos`,
  update: (id) => `${API_BASE_URL}/api/productos/${id}`,
  delete: (id) => `${API_BASE_URL}/api/productos/${id}`,
  search: `${API_BASE_URL}/api/productos/search`,
  byCategory: (categoria) => `${API_BASE_URL}/api/productos/categoria/${categoria}`,
};
