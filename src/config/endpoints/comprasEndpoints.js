/**
 * Endpoints de Compras
 */

import { API_BASE_URL } from '../apiConfig';

export const comprasEndpoints = {
  base: `${API_BASE_URL}/api/compras`,
  getAll: `${API_BASE_URL}/api/compras`,
  getById: (id) => `${API_BASE_URL}/api/compras/${id}`,
  create: `${API_BASE_URL}/api/compras`,
  update: (id) => `${API_BASE_URL}/api/compras/${id}`,
  delete: (id) => `${API_BASE_URL}/api/compras/${id}`,
  byProveedor: (proveedorId) => `${API_BASE_URL}/api/compras/proveedor/${proveedorId}`,
};
