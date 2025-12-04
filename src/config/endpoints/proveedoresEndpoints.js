/**
 * Endpoints de Proveedores
 */

import { API_BASE_URL } from '../apiConfig';

export const proveedoresEndpoints = {
  base: `${API_BASE_URL}/proveedor`,
  
  // Listado
  getAll: `${API_BASE_URL}/proveedor`,
  getAllDatos: `${API_BASE_URL}/proveedor/datos`,
  getHabilitados: `${API_BASE_URL}/proveedor/habilitados`,
  
  // Búsqueda
  getById: (id) => `${API_BASE_URL}/proveedor/${id}`,
  getByDocumentoUnico: (documento) => `${API_BASE_URL}/proveedor/documentoUnico/${documento}`,
  getByDocumentoVarios: (documento) => `${API_BASE_URL}/proveedor/documentoVarios/${documento}`,
  search: `${API_BASE_URL}/proveedor/search`,
  
  // CRUD
  create: `${API_BASE_URL}/proveedor`,
  update: (id) => `${API_BASE_URL}/proveedor/${id}`,
  delete: (id) => `${API_BASE_URL}/proveedor/${id}`,
  
  // Habilitar/Deshabilitar
  disable: (id) => `${API_BASE_URL}/proveedor/${id}/disable`,
  enable: (id) => `${API_BASE_URL}/proveedor/${id}/enable`,
};
