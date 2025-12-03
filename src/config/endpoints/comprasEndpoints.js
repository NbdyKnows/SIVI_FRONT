/**
 * Endpoints de Compras
 */

import { API_BASE_URL } from '../apiConfig';

export const comprasEndpoints = {
  base: `${API_BASE_URL}/compras`,
  getAll: `${API_BASE_URL}/compras`,
  getById: (id) => `${API_BASE_URL}/compras/${id}`,
  create: `${API_BASE_URL}/compras`,
  update: (id) => `${API_BASE_URL}/compras/${id}`,
  delete: (id) => `${API_BASE_URL}/compras/${id}`,
  byProveedor: (proveedorId) => `${API_BASE_URL}/compras/proveedor/${proveedorId}`,
};
